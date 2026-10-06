# Adaptive AgroTech Cloud – Next-Gen Research & Diagnostics Frontend

Live demo: https://harshest-human.github.io/IoT_Dashboard_Gas_Concentration_Frontend/

This public repository contains a simulated gas-monitoring dashboard. GitHub Pages deploys the dashboard automatically when changes are pushed to `main`.

---

## 📌 Project Objectives & Redesign Rationale

This project delivers a reimagined, streamlined frontend GUI for **Adaptive AgroTech Company**'s IoT sensor ecosystem, addressing key usability issues faced by gas-monitoring researchers:

1. **Separation of Researcher Needs vs. Test Engineering Diagnostics**:
   * *Problem:* The legacy Adaptive AgroTech dashboard mixed multiple technical consoles (LoRaWAN packet logs, Wi-Fi 2.4 GHz BSSID scans, ThingSpeak API key management, SD card file dump tools) into the main researcher workflow, overwhelming non-engineering users.
   * *Solution:* Adopted the clean, uncluttered design philosophy of **LI-COR HOBO Cloud**. Researchers land on a clean, intuitive monitoring dashboard with simple dropdown menus and instant time-series plots. All deep engineering tools are neatly organized in an **"Advanced Diagnostics"** section at the end.

2. **Immediate Visibility of Disconnected / Absent Nodes (Grayed-Out State)**:
   * Disconnected nodes (`ATB_52`, `ATB_55`, `ATB_58`, `ATB_63`, `ATB_64`) are **visibly grayed out** with dashed borders and warning indicators.
   * Directly answers two critical researcher questions:
     * **When did the node disconnect?** (e.g., *"Disconnected 3 days ago on Oct 03, 2026 09:20 CEST"*).
     * **How much data was collected so far?** (e.g., *"Prior data collected: 18,240 points · 4.4 MB"*).

3. **Comprehensive Battery Health Telemetry (Major Added Feature)**:
   * *Problem:* The previous Adaptive AgroTech dashboard did not report battery health or voltage state.
   * *Solution:* Full battery telemetry has been integrated:
     * Battery Level (%) and Live Voltage (3.0V – 4.2V Li-ion).
     * State of Health (**SOH**) rating (*Excellent*, *Good*, *Attention*, *Critical / Depleted*).
     * **Solar Energy Harvesting** status (`Charging +145 mA`, `Discharging -18 mA`, or `Mains Powered`).
     * 14-day **Battery Voltage vs. Solar Irradiance** trend curve to verify solar charging balance.

4. **Unified One-Click Raw Data Extraction**:
   * Replaces convoluted multi-dashboard exports with a **single, standardized CSV export workflow**.
   * Flexible scope (*Current Node*, *All Online Nodes*, or *Entire Fleet Archive*).
   * Filter by date ranges (*Last 24 Hours*, *7 Days*, *30 Days*, or *Full 90-day Season*).
   * Export Queue history log replicating LI-COR's export queue.

---

## 🖼️ Reference Screenshots & Benchmarks Folder

The [`screenshots/`](screenshots/) directory contains the benchmark documents and original GUI captures used to guide this redesign:

* `LI-COR Cloud Dashboard Screenshot.pdf` — Reference for clean, high-density sensor measurement tiles and device overview.
* `LI-COR Cloud view data trend for one sensor mote.pdf` — Reference for single-parameter *Quick Look* trend modals.
* `LI-COR Cloud.pdf` — Reference for unified raw data exports and export queue tables.
* `IoT Monitoring Dashboard _ Adaptive AgroTech.pdf` — Legacy Adaptive AgroTech monitoring interface.
* `IoT Node Diagnostics Console _ Adaptive AgroTech.pdf` — Legacy node diagnostic and network console.
* `LoRaWAN Console · Adaptive AgroTech.pdf` — Legacy LoRaWAN gateway packet inspector.
* `Sensor Management Dashboard _ Adaptive AgroTech.pdf` — Legacy ThingSpeak API and credential configuration page.

---

## 🚀 How to Run and Test Locally

### Option A: Direct Browser Open (Zero Setup)
Double-click [`index.html`](index.html) in your file manager or open it directly in Chrome, Firefox, Safari, or Microsoft Edge.

### Option B: Local Node.js Preview Server
If you have Node.js installed, run:
```bash
node server.js
```
Then visit [http://localhost:3000](http://localhost:3000).

---

## 🔐 GitHub Privacy & Collaborator Access Settings

To ensure this repository remains private and accessible only to your colleagues:

1. **Verify Private Repository Status**:
   * On GitHub, go to your repository: `https://github.com/harshest-human/IoT_Dashboard_Gas_Concentration_Frontend`.
   * Click **Settings** (top right tab).
   * Scroll down to the **Danger Zone** at the bottom.
   * Under **Change repository visibility**, ensure it is set to **Private** (if currently public, click *Change visibility* $\rightarrow$ *Make private*).

2. **Grant Collaborator Access**:
   * In repository **Settings**, click **Collaborators** in the left sidebar (under *Access*).
   * Click **Add people**.
   * Enter your colleague's GitHub username or email address and select the appropriate permission (e.g., *Write* or *Admin*).

3. **Push Latest Changes to GitHub**:
   Run the following commands in your local terminal:
   ```bash
   git add .
   git commit -m "Update README: Internal collaborator instructions and add screenshots folder"
   git push -u origin main
   ```

---

## 📂 Codebase Architecture

```
IoT_Dashboard_Gas_Concentration_Frontend/
├── index.html                   # Main interactive single-page dashboard application
├── css/
│   └── dashboard.css           # Modern styles, grayed-out offline node styling
├── js/
│   ├── data-engine.js          # Realistic diurnal weather simulation & CSV generator
│   ├── charts-manager.js       # Chart.js time series & Quick Look visualizer
│   └── dashboard-app.js        # Application controller, tab switching, and state
├── screenshots/                # Reference PDFs and GUI screenshots from LI-COR & AgroTech
├── server.js                   # Lightweight Node.js local preview HTTP server
└── README.md                   # Internal project documentation & collaborator guide
```

---

*Adaptive AgroTech Proprietary – Developed in collaboration with ATB Potsdam (Leibniz-Institut für Agrartechnik und Bioökonomie e.V.).*

## Gas concentration examples

The dashboard demonstrates CO₂, CH₄, and NH₃ concentrations in ppm alongside air temperature (°C) and relative humidity (%). All readings are simulated examples from dairy-barn gas sampling points, not live measurements. Metric cards, quick-look charts, fleet comparisons, and CSV exports use these parameters. Battery solar-charging telemetry remains available in diagnostics.
