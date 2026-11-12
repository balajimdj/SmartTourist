# SafeTrek — Tourist Safety Dashboard

A beginner-friendly React application demonstrating tourist safety tools with GPS location monitoring, geofencing, a rule-based risk score, SOS incident tracking, QR identity cards, and a simulated hash chain.

> **Demonstration only:** SafeTrek does not contact emergency services, provide authoritative safety boundaries, or use a real blockchain. Accounts and data are stored in the browser's `localStorage`; do not use real or sensitive personal information.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm
- A modern browser

## Run locally

1. Open this folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Install dependencies and start the development server:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite, usually `http://localhost:5173`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Tourist | `tourist@safety.demo` | `tourist123` |
| Administrator | `admin@safety.demo` | `admin123` |

You can also create a tourist account from the registration page. Demo accounts and data are saved in the current browser profile. Clearing site data removes them and restores the sample records.

## Features

- **Tourist account:** Register, sign in, view a unique Tourist ID, and log out.
- **Dashboard:** View location/sharing status, zone status, safety risk indicators, and emergency actions.
- **Digital ID:** Display a QR code and add or verify an identity record in the local simulated chain. The chain uses browser SHA-256 hashing; it is not deployed to a blockchain network.
- **Location monitoring:** Request browser GPS permission, refresh the position, and enable or pause sharing. GPS works only when supported and permitted by the browser.
- **Geofencing:** View example safe, warning, and restricted circles on the map. These zones are illustrative and are not official boundaries.
- **Risk scoring:** Rule-based JavaScript checks location, unusually large location changes, stale updates, and repeated SOS alerts. It is not a trained AI model.
- **SOS and incidents:** Create local SOS records containing the Tourist ID, time, and available coordinates. The admin demo can update incident status.
- **Admin dashboard:** View locally registered tourists, recent incidents, risk signals, and identity verification.
- **Safety assistant:** Provides predefined, general travel guidance; it does not have live hospital or police information.

## Netlify deployment

The repository includes [`netlify.toml`](./netlify.toml), which configures:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback for React Router routes

For a Git-connected Netlify site, connect the repository and deploy the intended branch. Confirm the latest deploy log contains a successful Vite production build and publishes `dist`. The deployed HTML should load JavaScript from `/assets/...`, not directly from `/src/main.jsx`.

For a manual deploy, build the project first and upload the generated **`dist`** directory—not the project source folder.

## Project structure

```text
src/
  components/   Shared navigation, cards, maps, and indicators
  pages/        Login, registration, tourist, admin, and safety pages
  utils/        Local storage, geofencing, risk scoring, and hash-chain logic
  App.jsx       Routes and shared application state
  main.jsx      React entry point
  index.css     Application styles
index.html
netlify.toml
package.json
vite.config.js
```

## Privacy and limitations

- This is a front-end learning project, not a production safety or dispatch system.
- `localStorage` is not a secure database. Demo credentials and app data remain on the device and can be inspected or changed by its user.
- Location is requested only through the browser's Geolocation API. The map uses OpenStreetMap tiles.
- Contact local emergency services directly if you need real assistance.
