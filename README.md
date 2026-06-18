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
## 🛠️ Deep Dives

<<<<<<< HEAD
=======
<details>
<summary>💡 Click to Expand: My HTML5 Drag & Drop "Aha!" Guide</summary>

### Learning HTML5 Drag & Drop: My "Aha!" Guide to the DataTransfer API

When I first looked at adding drag-and-drop to my React scheduler, I assumed I would need a massive external library...

*# HTML5 Drag & Drop: My "Aha!" Guide to the DataTransfer API
 
When I first looked at adding drag-and-drop to my React scheduler, I assumed I would need some massive external library to pull it off. Turns out, the web browser has a powerful system built right into it — the **HTML5 Drag and Drop API** — and once it clicked for me, I had to write it all down.
 
The absolute magic engine behind this entire process is an object called `e.dataTransfer`. Here's exactly how I figured out how it works, how data travels across the screen, and the browser traps I had to solve along the way.
 
---
 
## 1. The Core Mental Model: The Traveling Backpack
 
The biggest question I had starting out was: *if I click an item in Component A and drag it over to Component B, how does Component B know what I'm holding?*
 
The browser solves this with the `dataTransfer` object, which acts exactly like a **temporary backpack**.
 
Here's the flow in plain English:
 
1. When you **pick up** a draggable item, the browser hands you a blank backpack.
2. You **pack** a tiny piece of data into it — usually just an ID number, nothing fancy.
3. As your mouse **flies across the screen**, that backpack travels with your cursor.
4. When you **drop** the item onto a valid zone, that zone unzips the backpack, reads the data, and updates the app.
That's it. That's the whole mental model. Everything else is just implementation details.
 
---
 
## 2. The Timeline of a Single Drag Event
 
The data pipeline moves through **three distinct steps** in order:
 
```
[ EmployeeBadge ]  ======( Browser Backpack )======>  [ ShiftZone ]
   1. DragStart          2. DragOver & Hover             3. Drop
 (Pack the Backpack)   (Unlock the Landing Pad)    (Unpack & Update State)
```
 
---
 
### Step 1 — The Launchpad: `onDragStart`
 
This event fires the **exact millisecond** you click and begin sliding an item. This is where you prepare the backpack.
 
```javascript
const handleDragStart = (e) => {
  e.dataTransfer.setData("text/plain", employee.id.toString());
  e.dataTransfer.effectAllowed = "move";
};
```
 
**What's actually happening here:**
 
- `e.dataTransfer.setData(format, value)` is how we pack the bag. I'm telling the browser: *"Store this worker's ID as a plain text string."*
- `e.dataTransfer.effectAllowed = "move"` tells the browser's graphics engine to show a subtle **"moving" ghost visual** under the cursor — as opposed to a "copy" cursor with a plus sign.
---
 
### Step 2 — Flying Over Targets: `onDragOver`
 
As you drag the badge across the screen, it flies over other layout elements. This is where I hit the **biggest browser trap**.
 
> ⚠️ **The Trap:** By default, web browsers **block you from dropping data onto generic elements** like `<div>` containers. If you try without handling this, your cursor turns into a red "no-entry" symbol and the drop just... does nothing.
 
**The Fix:**
 
```javascript
const handleDragOver = (e) => {
  e.preventDefault();
};
```
 
By catching the `onDragOver` event and calling `e.preventDefault()`, I'm telling the browser: *"Hey, ignore your default safety rules. I'm manually declaring that this specific box is allowed to accept dropped items."*
 
One line. That's it. Easy to forget, but everything breaks without it.
 
---
 
### Step 3 — The Landing Pad: `onDrop`
 
The moment you let go of the mouse button over an unlocked box, the `onDrop` event fires. This is where the receiving component **unpacks the bag**.
 
```javascript
const handleDrop = (e) => {
  e.preventDefault();
  const empId = parseInt(e.dataTransfer.getData("text/plain"), 10);
  assignEmployee(empId, areaId, zoneName);
};
```
 
**What's actually happening here:**
 
- `e.dataTransfer.getData("text/plain")` tells the drop zone to open up that traveling browser backpack and pull out the string we packed in during Step 1.
- Once I have the ID string, I convert it back to a number with `parseInt` and hand it to my global React Context state.
- The state updates, React re-renders, and the badge appears in its brand-new drop zone. ✨
> Note: `e.preventDefault()` is also needed here to stop the browser from doing its own default drop behavior (like trying to open a file link).
 
---
 
## 3. Quick Reference: Key Properties & Methods
 
| Property / Method | Where It Lives | What It Does |
|---|---|---|
| `draggable="true"` | HTML Attribute | Unlocks an element so the mouse can physically lift it |
| `setData("text/plain", value)` | Drag Source | Packs a piece of text data into the browser's traveling clipboard |
| `effectAllowed` | Drag Source | Sets the visual style of the cursor (e.g., "move" ghost vs. "copy" icon) |
| `e.preventDefault()` | Drop Target | Stops the browser from blocking drops on generic layout containers |
| `getData("text/plain")` | Drop Target | Reaches into the event clipboard to retrieve the packed data |
 
---
 
## 4. The Big Takeaway
 
The most elegant thing I learned from this API is **how clean it keeps my state**.
 
Instead of moving whole data objects or copying arrays of employees back and forth between components, the browser's `dataTransfer` system lets me pass a **single string ID** across the screen. My React layout stays fast, and my data has a single source of truth.
 
Drag-and-drop always looked intimidating from the outside, but once I understood the backpack model — pack it, carry it, unpack it — the whole thing made complete sense.
 
---
 
*Notes from building a React shift scheduler — written so future-me doesn't forget how any of this works.*
*

</details>
>>>>>>> ae83d1e5af6eb4d477ab1cdba44e4d8d51ac4556
