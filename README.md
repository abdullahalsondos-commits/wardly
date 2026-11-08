# Wardly — B2B Reverse Auction Platform (Demo)

Interactive demo of a reverse auction platform for B2B procurement.
System Analysis & Design project — Misr University for Science & Technology (Course 402).

## Features
- Three roles: **Buyer**, **Supplier**, **Admin** (one-click demo accounts)
- Auction lifecycle: Draft → Pre-qualification → Scheduled → Live → Soft-close → Closed → Awarded → Completed
- Blind bidding (suppliers see only "Vendor #N"), minimum decrement, budget ceiling
- Soft-close: a bid in the last window extends the timer
- Bid bonds via a simulated payment gateway (held / released / forfeited)
- Runner-up failover when the winner defaults
- Bidding-engine trace that follows DFD Level 2 (steps 4.1 → 4.5)
- Live notifications, dashboards, admin verification, audit log
- English / Arabic (RTL), light / dark mode

## How it runs
The whole back end (database, bidding engine, scheduler, payment gateway, other suppliers)
is simulated in the browser. Nothing is saved; refreshing the page resets the data.
Use **Demo controls** (bottom corner) to speed up time (1× / 5× / 20×).

## Run locally
Open `index.html` in a browser, or:
```bash
npx serve .
```

## Deploy
Static site — no build step. Files: `index.html` (page), `style.css` (all styles and animations), `app.js` (app logic). Import the GitHub repo into Vercel with Framework Preset **Other**.

## Team
Yassin Mohamed · Kareem Ahmed · Mazen Osama Fathy — Supervisor: Dr. Mona Saad Khalil Morgan
