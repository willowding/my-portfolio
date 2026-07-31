/**
 * JoinedUsersStrip —— 7 名角色（脱敏）的「加入时间」横条
 *
 * 与 DauChart 互补：DauChart 给出"何时上线"，本组件给出"加入瞬间"
 */
import type { RoleJoin } from "@/data/picreview";

interface JoinedUsersStripProps {
  users: readonly RoleJoin[];
  retiredDate: string;
  retiredLabel: string;
  joinLabel: string;
}

export function JoinedUsersStrip({
  users,
  retiredDate,
  retiredLabel,
  joinLabel,
}: JoinedUsersStripProps) {
  const retiredTs = new Date(retiredDate).getTime();
  const earliest = users.length > 0
    ? new Date(users[0].joinedAt).getTime()
    : retiredTs;

  const totalSpan = Math.max(retiredTs - earliest, 1);

  return (
    <ol className="pr-users-strip">
      {users.map((u, i) => {
        const ts = new Date(u.joinedAt).getTime();
        const leftPct = ((ts - earliest) / totalSpan) * 100;
        return (
          <li key={i} className="pr-users-row" style={{ left: `${leftPct}%` }}>
            <div className="pr-users-dot" aria-hidden="true" />
            <div className="pr-users-card">
              <div className="pr-users-role">{u.role}</div>
              <div className="pr-users-date">
                <span className="pr-users-date-label">{joinLabel}</span>{" "}
                {u.joinedAt}
              </div>
            </div>
          </li>
        );
      })}
      {/* 离职日标记（位于最右） */}
      <li
        className="pr-users-row pr-users-row-retired"
        style={{ left: "100%" }}
      >
        <div className="pr-users-dot pr-users-dot-retired" aria-hidden="true" />
        <div className="pr-users-card pr-users-card-retired">
          <div className="pr-users-role pr-users-role-retired">
            {retiredLabel}
          </div>
          <div className="pr-users-date">{retiredDate}</div>
        </div>
      </li>
    </ol>
  );
}