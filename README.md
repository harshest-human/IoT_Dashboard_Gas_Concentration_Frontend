# Adaptive AgroTech Cloud – Next-Generation Research & Diagnostics Dashboard

> **A streamlined, researcher-first IoT environmental monitoring dashboard inspired by the simplicity and clarity of LI-COR HOBO Cloud, enhanced with comprehensive battery health telemetry and deep engineering diagnostics.**

---

## 🎯 Design Philosophy & Key Improvements

### 1. Separation of Concerns: Researcher Simplicity vs. Test Engineering
* **Old Adaptive AgroTech Issue**: Too many confusing, disconnected dashboards (LoRaWAN console, WiFi SSID scans, ThingSpeak channel config, SD card tools, IT diagnostic logs) cluttered the main interface. Researchers were overwhelmed by technical network diagnostics when they only wanted to view environmental data.
* **New Design (LI-COR HOBO Inspired)**: 
  * The primary landing view is **clean, simple, and researcher-oriented**.
  * A single **dropdown selector** allows switching between sensor nodes effortlessly.
  * Instant **measurement tiles** (Air Temperature, Relative Humidity, Dew Point via Magnus formula, Soil Moisture, Solar Radiation, Battery) with interactive **Quick-Look drawers** upon clicking.
  * Multi-parameter time series plots with 24h / 7-day / 30-day presets.

---

### 2. Disconnected & Absent Nodes are Clearly Grayed Out
* Disconnected nodes (`ATB_52`, `ATB_55`, `ATB_58`, `ATB_63`, `ATB_64`) are **visibly grayed out with dashed borders and desaturated badges**.
* **Instant Diagnostic Overview**:
  * **When did it disconnect?** (e.g., *"Disconnected 3 days ago on Oct 03, 2026 09:20 CEST"*).
  * **How much data was collected so far?** (e.g., *"Prior data collected: 18,240 points · 4.4 MB"*).
  * **Why did it disconnect?** (e.g., *"Battery under-voltage lockout below 3.30V"* or *"LoRa gateway timeout"*).
* Interactive simulation button on grayed-out cards to test reconnect / disconnect flows.

---

### 3. Comprehensive Battery Health Telemetry (Major Added Feature)
* **Old Adaptive AgroTech Limitation**: Did not display node battery health or voltage state.
* **New Dashboard Solution**:
  * Dedicated **Battery Health Telemetry** tab.
  * Live **voltage monitoring** (3.0V – 4.2V Li-ion range).
  * State of Health (**SOH**) classifications: *Excellent (98%)*, *Good (90%)*, *Attention (74%)*, *Critical / Depleted*.
  * **Solar Energy Harvesting** status (`Charging +145 mA` vs `Discharging -18 mA`).
  * Remaining estimated runtime calculations.

---

### 4. Unified One-Click Raw Data Extraction
* No more navigating multi-level menus or hunting for CSV links.
* Prominent **"Export CSV Data"** button on the top navigation and dedicated **Raw Data Export** studio.
* Allows flexible selection of:
  * Node Scope: *Current Node*, *All Online Nodes*, or *Entire 21-Node Fleet Archive*.
  * Target Environmental Parameters (Temp, RH, Dew Point, Soil, Solar, Battery, RSSI).
  * Time Resolution: *24 Hours*, *7 Days*, *30 Days*, or *Full Season (90 Days)*.
* Instant client-side CSV file generation & download.
* **Export Queue Table** (replicating LI-COR HOBO Cloud's export history).

---

### 5. Advanced Engineering Diagnostics (Placed at the End)
* Advanced tools are organized in a dedicated tab at the end for test engineers:
  * **LoRaWAN Gateway Console**: Real-time packet logs with Spreading Factor (SF7-SF12), SNR, RSSI, Frequency, and Frame Counters.
  * **Wi-Fi 2.4 GHz BSSID Network Scan Matrix**: Signal strength distribution across site networks.
  * **ThingSpeak API Credentials**: Channel IDs and masked Read/Write API keys.
  * **Multi-Node Temperature Divergence**: Micro-climate comparison chart across key plots.

---

## 🚀 How to Run the Dashboard

### Option A: Instant Browser Open (No Setup Required)
Simply double-click [`index.html`](file:///d:/Data_Analysis_R/Dashboard_Samples_Agrotech_LI-COR/index.html) in your file explorer, or open it with Chrome, Firefox, Safari, or Edge.

### Option B: Local Node.js Preview Server
If you have Node.js installed, run:
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```
Dashboard_Samples_Agrotech_LI-COR/
├── index.html                   # Main single-page interactive dashboard
├── css/
│   └── dashboard.css           # Modern styles, grayed-out offline node styling
├── js/
│   ├── data-engine.js          # Realistic diurnal agricultural simulation & CSV engine
│   ├── charts-manager.js       # Chart.js time series & Quick Look visualizer
│   └── dashboard-app.js        # UI controller, state management, and tab switcher
├── server.js                   # Lightweight preview HTTP server
├── README.md                   # Project documentation & GitHub guide
└── LICOR_HOBO_online_GUI/      # Original reference screenshots and specs
```

---

## 🌐 Sharing on GitHub

To push this project to a new GitHub repository to share with colleagues:

1. **Create a new repository** on [GitHub](https://github.com/new) (e.g., `adaptive-agrotech-dashboard`).
2. Run the following commands in your terminal:
   ```bash
   git add .
   git commit -m "Initial commit: Adaptive AgroTech Next-Gen Research Dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/adaptive-agrotech-dashboard.git
   git push -u origin main
   ```
3. **Enable GitHub Pages (Optional for Instant Live Demo)**:
   * Go to repository **Settings** > **Pages**.
   * Under **Branch**, select `main` and `/ (root)`.
   * Click **Save** — GitHub will generate a live URL (e.g., `https://<your-username>.github.io/adaptive-agrotech-dashboard/`) that your colleagues can view directly on their phones or laptops!

---

*Designed for ATB Potsdam – Leibniz-Institut für Agrartechnik und Bioökonomie e.V.*
