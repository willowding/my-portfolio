@echo off
cd /d C:\cursor\willowding-portfolio
del build.log _build.bat 2>nul
git add -A
git commit -m "fix: demo iframe scale broken on desktop viewports

- drop transform: scale(100vw / 1280) that caused demo content to be clipped
- iframe now fills 100% of 16:9 container at any viewport width
- demo's internal layout is fluid and adapts naturally
- affects both zh and en picreview pages
"
git push