/**
 * Adaptive AgroTech Data Simulation Engine
 * Generates realistic agricultural sensor data, battery telemetry, and connectivity states.
 * Supports connected and disconnected node lifecycles, time-series generation, and CSV exports.
 */

(function(window) {
  'use strict';

  // Sensor node definitions based on field deployments
  const INITIAL_NODES = [
    {
      id: "ATB_44",
      name: "ATB_44 (Canopy North)",
      field: "Field 1 - Winter Wheat",
      channelId: "998795",
      writeKey: "IA3Y••••••••DNTB",
      readKey: "DS82••••••••Z14Y",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 94,
      batteryVoltage: 4.14,
      batteryHealth: "Excellent (98% SOH)",
      solarState: "Charging (+145 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -68,
      snr: 9.2,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 24580,
      storageSize: "6.1 MB",
      temp: 21.3,
      rh: 64.8,
      soilMoisture: 32.4,
      solarRad: 480,
      dewPoint: 14.3
    },
    {
      id: "ATB_45",
      name: "ATB_45 (Canopy South)",
      field: "Field 1 - Winter Wheat",
      channelId: "998137",
      writeKey: "VZMS••••••••T477",
      readKey: "211R••••••••9F1F",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 88,
      batteryVoltage: 4.02,
      batteryHealth: "Good (94% SOH)",
      solarState: "Charging (+120 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -72,
      snr: 8.5,
      lastSeen: "1 min ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 24510,
      storageSize: "6.0 MB",
      temp: 21.8,
      rh: 63.2,
      soilMoisture: 30.1,
      solarRad: 510,
      dewPoint: 14.5
    },
    {
      id: "ATB_46",
      name: "ATB_46 (Root Zone 30cm)",
      field: "Field 1 - Winter Wheat",
      channelId: "998740",
      writeKey: "00SK••••••••IPP2",
      readKey: "VYW8••••••••N0CY",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 91,
      batteryVoltage: 4.08,
      batteryHealth: "Excellent (96% SOH)",
      solarState: "Charging (+130 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -74,
      snr: 7.8,
      lastSeen: "2 mins ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 24420,
      storageSize: "5.9 MB",
      temp: 18.5,
      rh: 78.4,
      soilMoisture: 36.8,
      solarRad: 0,
      dewPoint: 14.7
    },
    {
      id: "ATB_47",
      name: "ATB_47 (Soil Surface)",
      field: "Field 2 - Maize Plot",
      channelId: "998743",
      writeKey: "537C••••••••HC09",
      readKey: "38BY••••••••Z1DA",
      status: "connected",
      hardware: "AgroNode-WiFi Lite",
      firmware: "v2.8.1",
      batteryLevel: 76,
      batteryVoltage: 3.88,
      batteryHealth: "Good (89% SOH)",
      solarState: "Discharging (-18 mA)",
      estRuntime: "45 days remaining",
      rssi: -65,
      snr: 10.1,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 21300,
      storageSize: "5.2 MB",
      temp: 22.4,
      rh: 59.8,
      soilMoisture: 24.2,
      solarRad: 540,
      dewPoint: 14.1
    },
    {
      id: "ATB_48",
      name: "ATB_48 (Lysimeter Unit A)",
      field: "Field 2 - Maize Plot",
      channelId: "998744",
      writeKey: "TI8M••••••••FPX7",
      readKey: "HTMC••••••••BGX1",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 68,
      batteryVoltage: 3.82,
      batteryHealth: "Fair (82% SOH)",
      solarState: "Charging (+80 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -81,
      snr: 5.4,
      lastSeen: "4 mins ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 23900,
      storageSize: "5.8 MB",
      temp: 20.9,
      rh: 67.5,
      soilMoisture: 28.6,
      solarRad: 460,
      dewPoint: 14.6
    },
    {
      id: "ATB_49",
      name: "ATB_49 (Lysimeter Unit B)",
      field: "Field 2 - Maize Plot",
      channelId: "3291998",
      writeKey: "VWT1••••••••KXFK",
      readKey: "1MR8••••••••OEE9",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 82,
      batteryVoltage: 3.96,
      batteryHealth: "Good (91% SOH)",
      solarState: "Charging (+110 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -79,
      snr: 6.2,
      lastSeen: "1 min ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 24110,
      storageSize: "5.9 MB",
      temp: 21.0,
      rh: 66.8,
      soilMoisture: 29.1,
      solarRad: 470,
      dewPoint: 14.5
    },
    {
      id: "ATB_50",
      name: "ATB_50 (Weather Tower Top)",
      field: "Met Station Alpha",
      channelId: "3291999",
      writeKey: "HW8O••••••••IZLZ",
      readKey: "25GR••••••••FWIY",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 99,
      batteryVoltage: 4.20,
      batteryHealth: "Excellent (100% SOH)",
      solarState: "Charging (+210 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -58,
      snr: 12.4,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 28400,
      storageSize: "7.0 MB",
      temp: 20.4,
      rh: 62.1,
      soilMoisture: 0, // Tower node (no soil probe)
      solarRad: 620,
      dewPoint: 12.8
    },
    {
      id: "ATB_51",
      name: "ATB_51 (Apple Orchard Upper)",
      field: "Horticulture Plot C",
      channelId: "3292036",
      writeKey: "56SD••••••••0BC0",
      readKey: "X9TC••••••••4R8J",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 59,
      batteryVoltage: 3.75,
      batteryHealth: "Attention (74% SOH)",
      solarState: "Discharging (-22 mA / Partial Shade)",
      estRuntime: "22 days remaining",
      rssi: -85,
      snr: 4.1,
      lastSeen: "3 mins ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 19800,
      storageSize: "4.8 MB",
      temp: 21.4,
      rh: 70.2,
      soilMoisture: 34.5,
      solarRad: 310,
      dewPoint: 15.6
    },
    // Disconnected / Offline nodes (Grayed out in researcher UI)
    {
      id: "ATB_52",
      name: "ATB_52 (Apple Orchard Lower)",
      field: "Horticulture Plot C",
      channelId: "3292038",
      writeKey: "UUMC••••••••IO7J",
      readKey: "A5IQ••••••••QLXS",
      status: "disconnected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.7.2",
      batteryLevel: 14,
      batteryVoltage: 3.32,
      batteryHealth: "Critical (Battery Depleted)",
      solarState: "Offline",
      estRuntime: "0 hours (Depleted)",
      rssi: -94,
      snr: -2.1,
      lastSeen: "Disconnected 3 days ago (Oct 03, 2026 09:20 CEST)",
      lastTimestamp: new Date(Date.now() - 3 * 86400000),
      disconnectReason: "Battery voltage dropped below 3.30V brownout threshold",
      dataPointsCollected: 18240,
      storageSize: "4.4 MB",
      temp: 17.2,
      rh: 84.1,
      soilMoisture: 35.0,
      solarRad: 0,
      dewPoint: 14.4
    },
    {
      id: "ATB_53",
      name: "ATB_53 (Greenhouse 1 Ambient)",
      field: "Protected Culture Area",
      channelId: "3292092",
      writeKey: "0SRG••••••••UMNH",
      readKey: "9DMH••••••••A51W",
      status: "connected",
      hardware: "AgroNode-WiFi Lite",
      firmware: "v2.8.4",
      batteryLevel: 92,
      batteryVoltage: 4.10,
      batteryHealth: "Excellent (97% SOH)",
      solarState: "Mains Powered",
      estRuntime: "Permanent Grid",
      rssi: -60,
      snr: 11.2,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 31200,
      storageSize: "7.6 MB",
      temp: 24.8,
      rh: 72.4,
      soilMoisture: 42.1,
      solarRad: 380,
      dewPoint: 19.4
    },
    {
      id: "ATB_54",
      name: "ATB_54 (Greenhouse 2 Hydroponics)",
      field: "Protected Culture Area",
      channelId: "3292093",
      writeKey: "LH9C••••••••HB60",
      readKey: "MU7B••••••••ZJXW",
      status: "connected",
      hardware: "AgroNode-WiFi Lite",
      firmware: "v2.8.4",
      batteryLevel: 95,
      batteryVoltage: 4.15,
      batteryHealth: "Excellent (99% SOH)",
      solarState: "Mains Powered",
      estRuntime: "Permanent Grid",
      rssi: -62,
      snr: 10.8,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 31050,
      storageSize: "7.5 MB",
      temp: 25.2,
      rh: 74.0,
      soilMoisture: 48.0,
      solarRad: 390,
      dewPoint: 20.1
    },
    {
      id: "ATB_55",
      name: "ATB_55 (Drainage Sump Mote)",
      field: "Protected Culture Area",
      channelId: "3292095",
      writeKey: "G9HF••••••••IDRH",
      readKey: "AB3U••••••••C58V",
      status: "disconnected",
      hardware: "AgroNode-WiFi Lite",
      firmware: "v2.6.9",
      batteryLevel: 0,
      batteryVoltage: 2.85,
      batteryHealth: "Critical (Under-voltage Lockout)",
      solarState: "Offline",
      estRuntime: "0 hours",
      rssi: -99,
      snr: -8.0,
      lastSeen: "Disconnected 14 days ago (Sep 22, 2026 18:40 CEST)",
      lastTimestamp: new Date(Date.now() - 14 * 86400000),
      disconnectReason: "Water ingress / power supply cut",
      dataPointsCollected: 14200,
      storageSize: "3.5 MB",
      temp: 19.0,
      rh: 95.0,
      soilMoisture: 60.0,
      solarRad: 0,
      dewPoint: 18.2
    },
    {
      id: "ATB_56",
      name: "ATB_56 (Soybean Trial Block 1)",
      field: "Field 3 - Legume Trials",
      channelId: "3292096",
      writeKey: "6J0A••••••••QF0G",
      readKey: "1SZP••••••••VZB5",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 84,
      batteryVoltage: 3.98,
      batteryHealth: "Good (92% SOH)",
      solarState: "Charging (+105 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -70,
      snr: 8.9,
      lastSeen: "1 min ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 22800,
      storageSize: "5.5 MB",
      temp: 21.6,
      rh: 65.1,
      soilMoisture: 31.8,
      solarRad: 490,
      dewPoint: 14.7
    },
    {
      id: "ATB_57",
      name: "ATB_57 (Soybean Trial Block 2)",
      field: "Field 3 - Legume Trials",
      channelId: "3292121",
      writeKey: "2TMD••••••••7W3C",
      readKey: "ZXH5••••••••L9E3",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 81,
      batteryVoltage: 3.94,
      batteryHealth: "Good (90% SOH)",
      solarState: "Charging (+95 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -73,
      snr: 8.1,
      lastSeen: "2 mins ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 22650,
      storageSize: "5.5 MB",
      temp: 21.7,
      rh: 65.4,
      soilMoisture: 31.2,
      solarRad: 485,
      dewPoint: 14.8
    },
    {
      id: "ATB_58",
      name: "ATB_58 (Cover Crop Density)",
      field: "Field 3 - Legume Trials",
      channelId: "3292126",
      writeKey: "HCX1••••••••NY1W",
      readKey: "ULTJ••••••••4NG3",
      status: "disconnected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.0",
      batteryLevel: 8,
      batteryVoltage: 3.25,
      batteryHealth: "Critical (Degraded Cell)",
      solarState: "Offline",
      estRuntime: "0 hours",
      rssi: -92,
      snr: -1.5,
      lastSeen: "Disconnected 6 days ago (Sep 30, 2026 11:15 CEST)",
      lastTimestamp: new Date(Date.now() - 6 * 86400000),
      disconnectReason: "LoRaWAN Gateway timeout / gateway relocation",
      dataPointsCollected: 16900,
      storageSize: "4.1 MB",
      temp: 16.8,
      rh: 79.0,
      soilMoisture: 27.5,
      solarRad: 0,
      dewPoint: 13.1
    },
    {
      id: "ATB_59",
      name: "ATB_59 (Silvo-Pasture Tree)",
      field: "Agroforestry Zone",
      channelId: "3292127",
      writeKey: "QOH8••••••••9LQH",
      readKey: "P8NQ••••••••IUK0",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 73,
      batteryVoltage: 3.86,
      batteryHealth: "Good (88% SOH)",
      solarState: "Charging (+70 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -83,
      snr: 5.1,
      lastSeen: "3 mins ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 21900,
      storageSize: "5.3 MB",
      temp: 20.6,
      rh: 68.9,
      soilMoisture: 33.2,
      solarRad: 340,
      dewPoint: 14.6
    },
    {
      id: "ATB_60",
      name: "ATB_60 (Pasture Soil 10cm)",
      field: "Agroforestry Zone",
      channelId: "3292128",
      writeKey: "96HT••••••••HM3N",
      readKey: "2R6D••••••••LHL1",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 89,
      batteryVoltage: 4.04,
      batteryHealth: "Excellent (95% SOH)",
      solarState: "Charging (+135 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -76,
      snr: 7.4,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 24100,
      storageSize: "5.8 MB",
      temp: 19.8,
      rh: 71.0,
      soilMoisture: 38.4,
      solarRad: 0,
      dewPoint: 14.3
    },
    {
      id: "ATB_61",
      name: "ATB_61 (Irrigation Pivot Control)",
      field: "Field 4 - Precision Pivot",
      channelId: "3255020",
      writeKey: "7QW9••••••••GBUV",
      readKey: "1BP9••••••••JB7R",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 97,
      batteryVoltage: 4.18,
      batteryHealth: "Excellent (99% SOH)",
      solarState: "Charging (+190 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -66,
      snr: 9.8,
      lastSeen: "Just now",
      lastTimestamp: new Date(),
      dataPointsCollected: 27150,
      storageSize: "6.6 MB",
      temp: 21.2,
      rh: 66.2,
      soilMoisture: 35.6,
      solarRad: 505,
      dewPoint: 14.6
    },
    {
      id: "ATB_62",
      name: "ATB_62 (Pivot Outer Span)",
      field: "Field 4 - Precision Pivot",
      channelId: "3255021",
      writeKey: "AYGK••••••••GX7G",
      readKey: "01NC••••••••EV3T",
      status: "connected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.8.4",
      batteryLevel: 93,
      batteryVoltage: 4.12,
      batteryHealth: "Excellent (96% SOH)",
      solarState: "Charging (+160 mA)",
      estRuntime: "Indefinite (Solar Balanced)",
      rssi: -71,
      snr: 8.7,
      lastSeen: "2 mins ago",
      lastTimestamp: new Date(),
      dataPointsCollected: 26800,
      storageSize: "6.5 MB",
      temp: 21.5,
      rh: 64.9,
      soilMoisture: 34.1,
      solarRad: 515,
      dewPoint: 14.5
    },
    {
      id: "ATB_63",
      name: "ATB_63 (Microclimate Edge 1)",
      field: "Boundary Ecology",
      channelId: "3255023",
      writeKey: "9M9D••••••••9QG3",
      readKey: "QNCO••••••••DMPQ",
      status: "disconnected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.7.0",
      batteryLevel: 21,
      batteryVoltage: 3.48,
      batteryHealth: "Degraded (60% SOH)",
      solarState: "Offline",
      estRuntime: "0 hours",
      rssi: -96,
      snr: -4.0,
      lastSeen: "Disconnected 21 days ago (Sep 15, 2026 03:40 CEST)",
      lastTimestamp: new Date(Date.now() - 21 * 86400000),
      disconnectReason: "LoRaWAN range limit exceeded / antenna damage",
      dataPointsCollected: 11340,
      storageSize: "2.8 MB",
      temp: 15.4,
      rh: 88.2,
      soilMoisture: 26.0,
      solarRad: 0,
      dewPoint: 13.5
    },
    {
      id: "ATB_64",
      name: "ATB_64 (Microclimate Edge 2)",
      field: "Boundary Ecology",
      channelId: "3255024",
      writeKey: "LC6Z••••••••1NES",
      readKey: "44U4••••••••TJDC",
      status: "disconnected",
      hardware: "AgroNode-Pro LoRa",
      firmware: "v2.7.0",
      batteryLevel: 4,
      batteryVoltage: 3.12,
      batteryHealth: "Critical (Cell Depleted)",
      solarState: "Offline",
      estRuntime: "0 hours",
      rssi: -98,
      snr: -6.5,
      lastSeen: "Disconnected 27 days ago (Sep 09, 2026 14:10 CEST)",
      lastTimestamp: new Date(Date.now() - 27 * 86400000),
      disconnectReason: "Severe discharge & packet loss",
      dataPointsCollected: 8900,
      storageSize: "2.1 MB",
      temp: 14.8,
      rh: 89.5,
      soilMoisture: 25.2,
      solarRad: 0,
      dewPoint: 13.1
    }
  ];

  // Helper Magnus Formula to calculate Dew Point
  function calculateDewPoint(temp, rh) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(rh / 100.0);
    const dp = (b * alpha) / (a - alpha);
    return Math.round(dp * 100) / 100;
  }

  // Generate realistic time-series for a node
  function generateTimeSeries(node, days = 7, stepMinutes = 60) {
    const data = [];
    const now = new Date();
    const totalPoints = Math.floor((days * 24 * 60) / stepMinutes);
    const endTime = (node.status === "connected") ? now.getTime() : node.lastTimestamp.getTime();
    const startTime = endTime - (days * 24 * 3600 * 1000);

    // Baseline params for node
    const baseTemp = node.temp || 20.0;
    const baseRH = node.rh || 65.0;
    const baseSoil = node.soilMoisture || 30.0;
    const baseBatt = node.batteryVoltage || 4.0;

    for (let i = 0; i <= totalPoints; i++) {
      const timestamp = new Date(startTime + (i * stepMinutes * 60 * 1000));
      const hour = timestamp.getHours() + timestamp.getMinutes() / 60;
      
      // Solar diurnal cycle: peaks at 14:00 (hour 14), lowest at 06:00
      const diurnalFactor = Math.sin(((hour - 8) / 24) * 2 * Math.PI); // -1 to +1
      
      // Temperature variation (e.g. ± 6°C)
      const dayNoise = (Math.sin(i * 0.15) * 1.2) + ((Math.random() - 0.5) * 0.4);
      const temp = Math.round((baseTemp + (diurnalFactor * 5.5) + dayNoise) * 10) / 10;
      
      // RH inverse to temp
      const rh = Math.min(98, Math.max(25, Math.round((baseRH - (diurnalFactor * 18.0) - (dayNoise * 2.0)) * 10) / 10));
      
      // Dew point
      const dewPoint = calculateDewPoint(temp, rh);

      // Solar Radiation: 0 at night (hour < 6 or hour > 19), peaks at noon
      let solar = 0;
      if (hour >= 6.5 && hour <= 18.5) {
        const solarPeak = Math.sin(((hour - 6.5) / 12) * Math.PI);
        solar = Math.max(0, Math.round((solarPeak * 650) + ((Math.random() - 0.3) * 50)));
      }

      // Soil Moisture (slow drying cycle with occasional rain bump)
      const rainBump = (i > totalPoints * 0.4 && i < totalPoints * 0.5) ? 6.0 : 0;
      const soil = Math.round((baseSoil - ((totalPoints - i) * 0.015) + rainBump + ((Math.random() - 0.5) * 0.2)) * 10) / 10;

      // Battery Voltage (solar bump in daylight, gentle drain at night)
      let battVolt = baseBatt;
      if (node.status === "connected") {
        battVolt = (solar > 100) ? Math.min(4.20, baseBatt + 0.15) : Math.max(3.70, baseBatt - 0.08);
      } else {
        // Disconnected node decaying
        const decayRatio = (totalPoints - i) / totalPoints;
        battVolt = Math.max(2.8, Math.round((3.2 + (decayRatio * 0.6)) * 100) / 100);
      }
      const battPct = Math.min(100, Math.max(0, Math.round(((battVolt - 3.2) / (4.2 - 3.2)) * 100)));

      // RSSI
      const rssi = node.status === "connected" ? Math.round(node.rssi + ((Math.random() - 0.5) * 4)) : -99;

      data.push({
        time: timestamp,
        timestampISO: timestamp.toISOString(),
        timeLabel: timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp,
        rh,
        dewPoint,
        solar,
        soil,
        battVolt: Math.round(battVolt * 100) / 100,
        battPct,
        rssi
      });
    }

    return data;
  }

  // Main Data Engine Controller
  class DataEngine {
    constructor() {
      // Deep clone initial nodes to state
      this.nodes = JSON.parse(JSON.stringify(INITIAL_NODES));
      this.nodes.forEach(n => {
        n.lastTimestamp = new Date(n.lastTimestamp);
      });
      this.cache = new Map();
      this.exportLogs = [
        { id: "EXP-9082", name: "Wheat_Canopy_7D_AllParams.csv", nodes: "ATB_44, ATB_45, ATB_46", range: "Last 7 Days", size: "482 KB", created: "2026-10-06 14:30", status: "Ready" },
        { id: "EXP-9081", name: "Soil_Moisture_Lysimeters_30D.csv", nodes: "ATB_48, ATB_49", range: "Last 30 Days", size: "1.2 MB", created: "2026-10-05 09:15", status: "Ready" },
        { id: "EXP-9080", name: "Greenhouse_Environmental_Sync.csv", nodes: "ATB_53, ATB_54", range: "Last 14 Days", size: "920 KB", created: "2026-10-02 18:00", status: "Ready" }
      ];
    }

    getAllNodes() {
      return this.nodes;
    }

    getNode(id) {
      return this.nodes.find(n => n.id === id) || this.nodes[0];
    }

    getConnectedNodes() {
      return this.nodes.filter(n => n.status === "connected");
    }

    getDisconnectedNodes() {
      return this.nodes.filter(n => n.status === "disconnected");
    }

    getFleetSummary() {
      const total = this.nodes.length;
      const connected = this.getConnectedNodes().length;
      const disconnected = this.getDisconnectedNodes().length;
      const avgBattery = Math.round(this.nodes.reduce((acc, n) => acc + n.batteryLevel, 0) / total);
      const lowBatteryNodes = this.nodes.filter(n => n.batteryLevel < 20).length;
      const totalRecords = this.nodes.reduce((acc, n) => acc + n.dataPointsCollected, 0);

      return {
        total,
        connected,
        disconnected,
        avgBattery,
        lowBatteryNodes,
        totalRecords: totalRecords.toLocaleString(),
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    }

    getNodeData(id, days = 7) {
      const cacheKey = `${id}_${days}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      const node = this.getNode(id);
      const data = generateTimeSeries(node, days, days > 7 ? 120 : 30);
      this.cache.set(cacheKey, data);
      return data;
    }

    toggleNodeStatus(id) {
      const node = this.getNode(id);
      if (node.status === "connected") {
        node.status = "disconnected";
        node.lastSeen = "Just disconnected (User Action / Simulated Brownout)";
        node.lastTimestamp = new Date();
        node.disconnectReason = "Simulated manual disconnect / signal loss";
      } else {
        node.status = "connected";
        node.lastSeen = "Just reconnected";
        node.lastTimestamp = new Date();
        node.batteryLevel = Math.max(node.batteryLevel, 85);
        node.batteryVoltage = 4.05;
        node.batteryHealth = "Healthy (Recovered)";
      }
      this.cache.clear();
      return node;
    }

    tick() {
      // Simulate live random jitter for connected nodes
      this.nodes.forEach(node => {
        if (node.status === "connected") {
          const tempDelta = (Math.random() - 0.48) * 0.15;
          node.temp = Math.round((node.temp + tempDelta) * 10) / 10;
          const rhDelta = (Math.random() - 0.5) * 0.3;
          node.rh = Math.min(99, Math.max(20, Math.round((node.rh + rhDelta) * 10) / 10));
          node.dewPoint = calculateDewPoint(node.temp, node.rh);
          node.dataPointsCollected += 1;
        }
      });
    }

    generateCSVContent(selectedNodeIds, selectedMetrics, days = 7) {
      const nodesToExport = this.nodes.filter(n => selectedNodeIds.includes(n.id) || selectedNodeIds.includes("ALL"));
      const rows = [];

      // CSV Header
      const header = ["Timestamp_ISO", "Date_Time", "Node_ID", "Field_Location", "Hardware_Type", "Node_Status"];
      if (selectedMetrics.includes("temp")) header.push("Air_Temperature_degC");
      if (selectedMetrics.includes("rh")) header.push("Relative_Humidity_pct");
      if (selectedMetrics.includes("dewPoint")) header.push("Dew_Point_degC");
      if (selectedMetrics.includes("soilMoisture")) header.push("Soil_Moisture_pct");
      if (selectedMetrics.includes("solarRad")) header.push("Solar_Radiation_Wm2");
      if (selectedMetrics.includes("battery")) {
        header.push("Battery_Level_pct");
        header.push("Battery_Voltage_V");
        header.push("Battery_Health_State");
      }
      if (selectedMetrics.includes("rssi")) header.push("Signal_RSSI_dBm");

      rows.push(header.join(","));

      // Data rows
      nodesToExport.forEach(node => {
        const series = this.getNodeData(node.id, days);
        series.forEach(pt => {
          const row = [
            pt.timestampISO,
            `"${pt.timeLabel}"`,
            node.id,
            `"${node.field}"`,
            `"${node.hardware}"`,
            node.status
          ];

          if (selectedMetrics.includes("temp")) row.push(pt.temp);
          if (selectedMetrics.includes("rh")) row.push(pt.rh);
          if (selectedMetrics.includes("dewPoint")) row.push(pt.dewPoint);
          if (selectedMetrics.includes("soilMoisture")) row.push(pt.soil);
          if (selectedMetrics.includes("solarRad")) row.push(pt.solar);
          if (selectedMetrics.includes("battery")) {
            row.push(pt.battPct);
            row.push(pt.battVolt);
            row.push(`"${node.batteryHealth}"`);
          }
          if (selectedMetrics.includes("rssi")) row.push(pt.rssi);

          rows.push(row.join(","));
        });
      });

      return rows.join("\r\n");
    }

    addExportLog(name, nodeCount, dateRange, fileSize) {
      this.exportLogs.unshift({
        id: "EXP-" + Math.floor(1000 + Math.random() * 9000),
        name,
        nodes: `${nodeCount} nodes`,
        range: dateRange,
        size: fileSize,
        created: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: "Ready"
      });
    }
  }

  // Expose global instance
  window.AgroDataEngine = new DataEngine();

})(window);
