# Shift Compliance Tracker

A workforce-management dashboard for tracking shift staffing, zone coverage, and
sanitation-compliance status across a facility. Built to digitize the kind of
paper-and-clipboard tracking I managed firsthand as a sanitation site supervisor
in food-safety operations.



## Live demo

<!-- Deploy to Vercel or Netlify (both free) and replace the line below with the URL. -->
**Live demo:** (https://santitation-roster-compliance-track.vercel.app)

**Demo login (mock data):

| Role      | Username     | Password         |
| --------- | ------------ | ---------------- |
| Manager   | `admin`     | `admin`       |
| Supervisor | `supervisor` | `pass123` |
| Viewer | `viewer` | `pass123`

## Why I built this

Before moving into software, I spent years supervising sanitation crews under USDA
inspection, where shift coverage, zone assignments, and compliance logs were all
tracked by hand. This app is my attempt to turn that workflow into a single
dashboard — and a way to apply what I'm learning in front-end development to a
domain I already know well.

## Features

- **Authentication flow** — the login page validates credentials and issues a
  JWT-style session token (mocked client-side for now); an auth context decodes the
  token and exposes the current user and role to the rest of the app.
- **Protected routing** — authenticated-only pages redirect to the login screen when
  there's no active session, and logged-in users are redirected away from the
  login/sign-up pages.
- **Sign-up page** for registering a new user.
- **Dashboard** with a metrics bar surfacing shift attendance, open zones, compliance
  status, and completed logs.
- **Roster view** — a table of crew members showing role, assigned zone, and hours
  worked this week.

## Roadmap

- [ ] Build out the Compliance page (log entry, missed-check flagging, history)
- [ ] Build out the Scheduler page (assign crew to shifts and zones)
- [ ] Drive the dashboard metrics from live roster/compliance data instead of fixed values
- [ ] Move authentication and data to a real backend with a database

## Tech stack

React 19 · React Router · Context API · Vite

## Getting started

```bash
npm install
npm install react-router-dom
npm run dev
```

Then open the local URL Vite prints (default `http://localhost:5173`) and sign in
with one of the demo accounts above. Requires Node.js and npm (Node 20+ recommended).

## What I learned

