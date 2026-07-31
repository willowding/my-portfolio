#!/usr/bin/env python3
"""
Scrape a YouTube channel's video catalog for a date range using
YouTube Data API v3 (official, free, 10k units/day).

Setup (one-time):
    1. Go to https://console.cloud.google.com/
    2. Create project → APIs & Services → Library → enable "YouTube Data API v3"
    3. Credentials → Create Credentials → API key
    4. Set environment variable:
         Windows PowerShell :  $env:YT_API_KEY = "your_key_here"
         macOS / Linux       :  export YT_API_KEY="your_key_here"

Usage:
    python scrape_channel.py <channel_url_or_handle> --since 2025-11-17 --until 2026-03-30
    python scrape_channel.py https://www.youtube.com/@水月琴音 --since 2025-11-17 --until 2026-03-30
    python scrape_channel.py @channel_handle --since 2025-11-17 --until 2026-03-30 --output out.json

Output (stdout + optional json file):
    {
      "channel": { ... },
      "window": { "since": "...", "until": "..." },
      "video_count": N,
      "total_views": NNN,
      "average_views": NNN,
      "videos": [{ "title": "...", "url": "...", "published_at": "...", "views": NNN }, ...]
    }
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime
from typing import Any


API_BASE = "https://www.googleapis.com/youtube/v3"


# ----------------------------------------------------------------------------
# Low-level HTTP
# ----------------------------------------------------------------------------
def _get_json(url: str, params: dict[str, str]) -> dict[str, Any]:
    params = {k: v for k, v in params.items() if v is not None}
    qs = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{url}?{qs}")
    with urllib.request.urlopen(req, timeout=30) as resp:  # noqa: S310 - https only
        return json.loads(resp.read().decode("utf-8"))


# ----------------------------------------------------------------------------
# Input parsing — accept URL, @handle, /channel/UC..., plain handle
# ----------------------------------------------------------------------------
_HANDLE_RE = re.compile(r"@([A-Za-z0-9._-]{1,40})")
_CHANNEL_ID_RE = re.compile(r"/channel/(UC[A-Za-z0-9_-]{22})")


def normalize_channel_input(raw: str) -> dict[str, str]:
    """Return a dict identifying the channel — either handle or channel id."""
    s = raw.strip()
    # Direct channel id
    m = _CHANNEL_ID_RE.search(s)
    if m:
        return {"id": m.group(1)}
    # @handle from URL or plain
    m = _HANDLE_RE.search(s)
    if m:
        return {"forHandle": "@" + m.group(1).lstrip("@")}
    # bare handle like "username"
    if re.fullmatch(r"[A-Za-z0-9._-]{3,40}", s):
        return {"forHandle": "@" + s}
    raise ValueError(f"Could not parse channel reference from: {raw!r}")


# ----------------------------------------------------------------------------
# Resolve channel -> channelId + basic info
# ----------------------------------------------------------------------------
def resolve_channel(api_key: str, ref: dict[str, str]) -> dict[str, Any]:
    data = _get_json(
        f"{API_BASE}/channels",
        {
            "part": "snippet,statistics,contentDetails",
            "maxResults": "1",
            **ref,
            "key": api_key,
        },
    )
    items = data.get("items", [])
    if not items:
        raise SystemExit(f"No channel found for input: {ref}")
    return items[0]


# ----------------------------------------------------------------------------
# Collect all videos in the date window via uploads playlist
#   uploads playlist:    contentDetails.relatedPlaylists.uploads
#   one playlistItems.list call -> up to 50 video IDs
# ----------------------------------------------------------------------------
def list_video_ids_in_window(
    api_key: str,
    uploads_playlist_id: str,
    since: date,
    until: date,
) -> list[dict[str, str]]:
    """Returns [{"id": "...", "publishedAt": "YYYY-MM-DDTHH:MM:SSZ"}, ...]."""
    since_iso = f"{since.isoformat()}T00:00:00Z"
    # YouTube uses exclusive end — bump one day so the until-date is fully included
    until_iso = f"{until.isoformat()}T23:59:59Z"

    out: list[dict[str, str]] = []
    page_token: str | None = None

    while True:
        params: dict[str, str] = {
            "part": "contentDetails",
            "playlistId": uploads_playlist_id,
            "maxResults": "50",
            "key": api_key,
        }
        if page_token:
            params["pageToken"] = page_token

        data = _get_json(f"{API_BASE}/playlistItems", params)
        for item in data.get("items", []):
            published = item.get("contentDetails", {}).get("videoPublishedAt") or \
                        item.get("contentDetails", {}).get("videoPublishedAtRaw")
            # videoPublishedAt is on contentDetails in playlistItems response
            published = (
                item.get("contentDetails", {}).get("videoPublishedAt")
                or item.get("contentDetails", {}).get("publishedAt")
            )
            if not published:
                continue
            # date filter
            if published < since_iso or published > until_iso:
                # video IDs are returned newest-first, so once we hit < since we can stop
                if published < since_iso:
                    return out
                continue
            video_id = item.get("contentDetails", {}).get("resourceId", {}).get("videoId")
            if video_id:
                out.append({"id": video_id, "publishedAt": published})

        page_token = data.get("nextPageToken")
        if not page_token:
            break

    return out


# ----------------------------------------------------------------------------
# Fetch view counts in batches of 50 via videos.list
# ----------------------------------------------------------------------------
def fetch_video_stats(api_key: str, video_ids: list[str]) -> dict[str, dict[str, Any]]:
    stats: dict[str, dict[str, Any]] = {}
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i : i + 50]
        data = _get_json(
            f"{API_BASE}/videos",
            {
                "part": "snippet,statistics",
                "id": ",".join(chunk),
                "maxResults": "50",
                "key": api_key,
            },
        )
        for item in data.get("items", []):
            stats[item["id"]] = {
                "title": item.get("snippet", {}).get("title", ""),
                "publishedAt": item.get("snippet", {}).get("publishedAt", ""),
                "viewCount": int(
                    (item.get("statistics", {}).get("viewCount") or "0") or 0
                ),
                "likeCount": int(
                    (item.get("statistics", {}).get("likeCount") or "0") or 0
                ),
                "commentCount": int(
                    (item.get("statistics", {}).get("commentCount") or "0") or 0
                ),
                "url": f"https://www.youtube.com/watch?v={item['id']}",
            }
    return stats


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("channel", help="Channel URL, @handle, /channel/UC id, or bare handle")
    parser.add_argument("--since", required=True, help="Start date (inclusive), YYYY-MM-DD")
    parser.add_argument("--until", required=True, help="End date (inclusive), YYYY-MM-DD")
    parser.add_argument("--api-key", default=os.environ.get("YT_API_KEY"), help="YouTube Data API key (or set YT_API_KEY env var)")
    parser.add_argument("--output", "-o", help="Optional path to write full JSON results")
    parser.add_argument("--quiet", "-q", action="store_true", help="Suppress per-video output, print only summary")
    args = parser.parse_args()

    if not args.api_key:
        print("ERROR: missing API key. Pass --api-key or set env YT_API_KEY.", file=sys.stderr)
        return 2

    try:
        since_d = datetime.strptime(args.since, "%Y-%m-%d").date()
        until_d = datetime.strptime(args.until, "%Y-%m-%d").date()
    except ValueError:
        print("ERROR: --since/--until must be YYYY-MM-DD", file=sys.stderr)
        return 2
    if until_d < since_d:
        print("ERROR: --until must be on or after --since", file=sys.stderr)
        return 2

    ref = normalize_channel_input(args.channel)
    channel = resolve_channel(args.api_key, ref)
    channel_id = channel["id"]
    uploads = channel.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads")
    if not uploads:
        print("ERROR: channel has no uploads playlist (uncommon).", file=sys.stderr)
        return 2

    snippet = channel.get("snippet", {})
    stats = channel.get("statistics", {})

    channel_summary = {
        "id": channel_id,
        "title": snippet.get("title"),
        "handle": snippet.get("customUrl"),
        "subscriber_count": int(stats.get("subscriberCount") or 0),
        "total_channel_views": int(stats.get("viewCount") or 0),
        "total_channel_videos": int(stats.get("videoCount") or 0),
        "published_at_channel": snippet.get("publishedAt"),
    }
    print(f"Channel: {channel_summary['title']} ({channel_summary['handle']})", flush=True)

    index = list_video_ids_in_window(args.api_key, uploads, since_d, until_d)
    if not index:
        print(f"\nNo videos found in window {args.since} → {args.until}.", flush=True)
        result = {
            "channel": channel_summary,
            "window": {"since": args.since, "until": args.until},
            "video_count": 0,
            "total_views": 0,
            "average_views": 0,
            "videos": [],
        }
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
        return 0

    video_ids = [v["id"] for v in index]
    stats_map = fetch_video_stats(args.api_key, video_ids)

    videos: list[dict[str, Any]] = []
    for v in index:
        s = stats_map.get(v["id"])
        if not s:
            continue
        videos.append({"video_id": v["id"], **s})

    # sort newest first
    videos.sort(key=lambda x: x.get("publishedAt", ""), reverse=True)

    total_views = sum(v["viewCount"] for v in videos)
    count = len(videos)
    avg = round(total_views / count) if count else 0

    if not args.quiet:
        print(f"\nVideos in {args.since} → {args.until}: {count}", flush=True)
        for v in videos:
            print(f"  {v['publishedAt'][:10]}  {v['viewCount']:>10,}  {v['title']}", flush=True)

    print("\n--- Summary ---", flush=True)
    print(f"Channel              : {channel_summary['title']}", flush=True)
    print(f"Handle               : {channel_summary['handle']}", flush=True)
    print(f"Window               : {args.since} → {args.until}", flush=True)
    print(f"Videos in window     : {count}", flush=True)
    print(f"Total views          : {total_views:,}", flush=True)
    print(f"Average views / video: {avg:,}", flush=True)

    if args.output:
        result = {
            "channel": channel_summary,
            "window": {"since": args.since, "until": args.until},
            "video_count": count,
            "total_views": total_views,
            "average_views": avg,
            "videos": videos,
        }
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\nWrote {args.output}", flush=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
