/**
 * Adaptive AgroTech Main Application Controller
 * Manages UI interactions, node switching, data exports, diagnostics, and simulations.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State Management
  const state = {
    selectedNodeId: 'ATB_44',
    activeTab: 'monitoring', // 'monitoring', 'nodes-matrix', 'battery-health', 'raw-export', 'advanced-diagnostics'
    timeRangeDays: 7,
    activeMetrics: ['temp', 'rh', 'co2', 'ch4', 'nh3'],
    simulationRunning: true,
    simulationTimer: null,
    searchQuery: '',
    statusFilter: 'ALL' // 'ALL', 'connected', 'disconnected'
  };

  // DOM Elements
  const elements = {
    // Navigation
    tabButtons: document.querySelectorAll('.nav-tab-btn'),
    tabContents: document.querySelectorAll('.tab-content-panel'),
    // Node Selectors
    nodeSelect: document.getElementById('node-select-dropdown'),
    nodeSearchInput: document.getElementById('node-search-input'),
    btnFilterAll: document.getElementById('btn-filter-all'),
    btnFilterOnline: document.getElementById('btn-filter-online'),
    btnFilterOffline: document.getElementById('btn-filter-offline'),
    // Metric Cards
    cardTemp: document.getElementById('card-temp'),
    cardRH: document.getElementById('card-rh'),
    cardCO2: document.getElementById('card-co2'),
    cardCH4: document.getElementById('card-ch4'),
    cardNH3: document.getElementById('card-nh3'),
    cardBattery: document.getElementById('card-battery'),
    // Disconnect Alert Banner
    disconnectBanner: document.getElementById('disconnect-alert-banner'),
    // Time Range Buttons
    timeRangeBtns: document.querySelectorAll('.time-range-btn'),
    metricToggleBtns: document.querySelectorAll('.metric-toggle-btn'),
    // Nodes Matrix Table
    nodesTableBody: document.getElementById('nodes-table-body'),
    // Battery Overview
    batteryTableBody: document.getElementById('battery-table-body'),
    // Modals
    quickLookModal: document.getElementById('quicklook-modal'),
    quickLookTitle: document.getElementById('quicklook-title'),
    quickLookSubtitle: document.getElementById('quicklook-subtitle'),
    quickLookCloseBtn: document.getElementById('quicklook-close-btn'),
    // Export UI
    exportModal: document.getElementById('export-modal'),
    btnOpenExport: document.getElementById('btn-open-export'),
    btnCloseExport: document.getElementById('btn-close-export'),
    btnExecuteDownload: document.getElementById('btn-execute-download'),
    exportHistoryBody: document.getElementById('export-history-body'),
    // Simulation Controls
    btnToggleSim: document.getElementById('btn-toggle-sim'),
    btnSimToggleNode: document.getElementById('btn-sim-toggle-node'),
    // Summary Badges
    badgeFleetCount: document.getElementById('badge-fleet-count'),
    badgeOnlineCount: document.getElementById('badge-online-count'),
    badgeOfflineCount: document.getElementById('badge-offline-count'),
    badgeAvgBattery: document.getElementById('badge-avg-battery'),
    lastSyncTime: document.getElementById('last-sync-time')
  };

  // Initialize Application
  function initApp() {
    populateNodeDropdown();
    updateFleetSummaryUI();
    renderActiveNodeUI();
    renderNodesMatrixTable();
    renderBatteryOverviewTable();
    renderExportHistoryTable();
    setupEventListeners();
    startSimulationLoop();
  }

  // Populate Dropdown
  function populateNodeDropdown() {
    if (!elements.nodeSelect) return;
    elements.nodeSelect.innerHTML = '';

    const nodes = window.AgroDataEngine.getAllNodes();
    nodes.forEach(node => {
      const opt = document.createElement('option');
      opt.value = node.id;
      const statusIcon = node.status === 'connected' ? '🟢' : '⚪ (Offline)';
      opt.textContent = `${statusIcon} ${node.id} - ${node.name}`;
      if (node.id === state.selectedNodeId) {
        opt.selected = true;
      }
      elements.nodeSelect.appendChild(opt);
    });
  }

  // Update Top Fleet Badges
  function updateFleetSummaryUI() {
    const summary = window.AgroDataEngine.getFleetSummary();
    if (elements.badgeFleetCount) elements.badgeFleetCount.textContent = `${summary.total} Nodes`;
    if (elements.badgeOnlineCount) elements.badgeOnlineCount.textContent = `${summary.connected} Online`;
    if (elements.badgeOfflineCount) elements.badgeOfflineCount.textContent = `${summary.disconnected} Disconnected`;
    if (elements.badgeAvgBattery) elements.badgeAvgBattery.textContent = `Avg Batt: ${summary.avgBattery}%`;
    if (elements.lastSyncTime) elements.lastSyncTime.textContent = summary.lastSync;
  }

  // Render Current Selected Node Telemetry & Charts
  function renderActiveNodeUI() {
    const node = window.AgroDataEngine.getNode(state.selectedNodeId);
    const series = window.AgroDataEngine.getNodeData(node.id, state.timeRangeDays);

    // Update Dropdown Selection if mismatched
    if (elements.nodeSelect && elements.nodeSelect.value !== node.id) {
      elements.nodeSelect.value = node.id;
    }

    // Disconnect Alert Banner Handling
    if (elements.disconnectBanner) {
      if (node.status === 'disconnected') {
        elements.disconnectBanner.style.display = 'flex';
        elements.disconnectBanner.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span style="font-size:1.3rem;">⚠️</span>
            <div>
              <strong>Node ${node.id} is currently disconnected (Greyed Out View)</strong>
              <div style="font-size:0.8rem; color:#b45309;">${node.lastSeen} &bull; Prior data collected: <strong>${node.dataPointsCollected.toLocaleString()} points (${node.storageSize})</strong></div>
              <div style="font-size:0.75rem; color:#78350f; margin-top:2px;">Diagnostic note: ${node.disconnectReason || 'Connection timeout'}</div>
            </div>
          </div>
          <button id="btn-reconnect-inline" class="btn-primary" style="background:#d97706; padding:0.35rem 0.75rem; font-size:0.8rem;">
            🔄 Simulate Reconnect
          </button>
        `;
        const btnRec = document.getElementById('btn-reconnect-inline');
        if (btnRec) {
          btnRec.onclick = () => {
            window.AgroDataEngine.toggleNodeStatus(node.id);
            populateNodeDropdown();
            updateFleetSummaryUI();
            renderActiveNodeUI();
            renderNodesMatrixTable();
            renderBatteryOverviewTable();
          };
        }
      } else {
        elements.disconnectBanner.style.display = 'none';
      }
    }

    // Update Metric Card Values & Styles
    updateCard(elements.cardTemp, node.temp, '°C', 'Air Temperature', node.status, 'temp');
    updateCard(elements.cardRH, node.rh, '%', 'Relative Humidity', node.status, 'rh');
    updateCard(elements.cardCO2, node.co2, 'ppm', 'CO₂', node.status, 'co2');
    updateCard(elements.cardCH4, node.ch4, 'ppm', 'CH₄', node.status, 'ch4');
    updateCard(elements.cardNH3, node.nh3, 'ppm', 'NH₃', node.status, 'nh3');
    updateCard(elements.cardBattery, `${node.batteryLevel}% (${node.batteryVoltage}V)`, '', `Battery: ${node.batteryHealth}`, node.status, 'battery');

    // Render Primary Chart
    window.AgroChartManager.renderMainChart('main-telemetry-chart', series, state.activeMetrics);

    // Update simulation toggle button text
    if (elements.btnSimToggleNode) {
      elements.btnSimToggleNode.textContent = node.status === 'connected' 
        ? `Disconnect ${node.id} (Simulate Offline)` 
        : `Reconnect ${node.id} (Simulate Online)`;
    }
  }

  function updateCard(cardEl, value, unit, label, status, metricKey) {
    if (!cardEl) return;
    if (status === 'disconnected') {
      cardEl.classList.add('grayed-out');
    } else {
      cardEl.classList.remove('grayed-out');
    }
    const valEl = cardEl.querySelector('.card-val-number');
    const unitEl = cardEl.querySelector('.card-unit');
    const labelEl = cardEl.querySelector('.card-label');
    if (valEl) valEl.textContent = value;
    if (unitEl) unitEl.textContent = unit;
    if (labelEl) labelEl.textContent = label;

    // Attach click for Quick Look
    cardEl.onclick = () => openQuickLook(metricKey);
  }

  // Open Quick Look Modal
  function openQuickLook(metricKey) {
    const node = window.AgroDataEngine.getNode(state.selectedNodeId);
    const series = window.AgroDataEngine.getNodeData(node.id, 14);

    if (elements.quickLookTitle) {
      elements.quickLookTitle.textContent = `Quick Look: ${node.id} - ${metricKey.toUpperCase()}`;
    }
    if (elements.quickLookSubtitle) {
      elements.quickLookSubtitle.textContent = `Location: ${node.field} | Hardware: ${node.hardware} | State: ${node.status.toUpperCase()}`;
    }

    if (elements.quickLookModal) {
      elements.quickLookModal.classList.add('active');
    }

    window.AgroChartManager.renderQuickLookChart('quicklook-canvas', node, metricKey, series);
  }

  function closeQuickLook() {
    if (elements.quickLookModal) {
      elements.quickLookModal.classList.remove('active');
    }
  }

  // Render Node Matrix Table
  function renderNodesMatrixTable() {
    if (!elements.nodesTableBody) return;
    elements.nodesTableBody.innerHTML = '';

    const nodes = window.AgroDataEngine.getAllNodes();
    const query = state.searchQuery.toLowerCase();

    nodes.filter(n => {
      const matchQuery = n.id.toLowerCase().includes(query) || n.name.toLowerCase().includes(query) || n.field.toLowerCase().includes(query);
      const matchStatus = state.statusFilter === 'ALL' || n.status === state.statusFilter;
      return matchQuery && matchStatus;
    }).forEach(node => {
      const tr = document.createElement('tr');
      if (node.status === 'disconnected') {
        tr.className = 'node-row-disconnected';
      }

      const battBarClass = node.batteryLevel > 70 ? 'high' : (node.batteryLevel > 25 ? 'medium' : 'low');

      tr.innerHTML = `
        <td>
          <div class="node-title" style="font-weight:600; cursor:pointer;" onclick="window.selectAndGo('${node.id}')">
            ${node.id} - ${node.name}
          </div>
          <div style="font-size:0.75rem; color:#64748b;">${node.field} &bull; ${node.hardware}</div>
        </td>
        <td>
          <span class="badge ${node.status === 'connected' ? 'online' : 'offline'}">
            ${node.status === 'connected' ? '● Online' : '○ Offline'}
          </span>
        </td>
        <td>
          <div style="font-weight:600;">${node.temp}°C / ${node.rh}%</div>
          <div style="font-size:0.75rem; color:#64748b;">CO₂: ${node.co2} ppm</div>
        </td>
        <td>
          <div class="battery-indicator">
            <div class="battery-bar-track">
              <div class="battery-bar-fill ${battBarClass}" style="width: ${node.batteryLevel}%"></div>
            </div>
            <span style="font-weight:600; font-size:0.8rem;">${node.batteryLevel}%</span>
          </div>
          <div style="font-size:0.7rem; color:#64748b;">${node.batteryVoltage}V (${node.batteryHealth})</div>
        </td>
        <td>
          <div style="font-size:0.8rem;"><strong>${node.dataPointsCollected.toLocaleString()}</strong> pts</div>
          <div style="font-size:0.7rem; color:#64748b;">${node.storageSize}</div>
        </td>
        <td>
          <div style="font-size:0.78rem;">${node.lastSeen}</div>
          ${node.status === 'disconnected' ? `<div style="font-size:0.7rem; color:#b91c1c;">${node.disconnectReason || ''}</div>` : ''}
        </td>
        <td style="text-align:right;">
          <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.selectAndGo('${node.id}')">
            View Plot
          </button>
          <button class="btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; margin-left:4px;" onclick="window.toggleNodeState('${node.id}')">
            ${node.status === 'connected' ? 'Disconnect' : 'Reconnect'}
          </button>
        </td>
      `;
      elements.nodesTableBody.appendChild(tr);
    });
  }

  // Render Battery Overview Table
  function renderBatteryOverviewTable() {
    if (!elements.batteryTableBody) return;
    elements.batteryTableBody.innerHTML = '';

    const nodes = window.AgroDataEngine.getAllNodes();
    nodes.forEach(node => {
      const tr = document.createElement('tr');
      const battClass = node.batteryLevel > 70 ? 'high' : (node.batteryLevel > 25 ? 'medium' : 'low');
      const healthBadge = node.batteryLevel < 20 ? 'critical' : (node.batteryLevel < 60 ? 'warning' : 'online');

      tr.innerHTML = `
        <td><strong>${node.id}</strong> (${node.name})</td>
        <td>${node.hardware}</td>
        <td>
          <div class="battery-indicator">
            <div class="battery-bar-track">
              <div class="battery-bar-fill ${battClass}" style="width: ${node.batteryLevel}%"></div>
            </div>
            <strong>${node.batteryLevel}%</strong>
          </div>
        </td>
        <td><strong>${node.batteryVoltage} V</strong></td>
        <td><span class="badge ${healthBadge}">${node.batteryHealth}</span></td>
        <td>${node.solarState}</td>
        <td>${node.estRuntime}</td>
      `;
      elements.batteryTableBody.appendChild(tr);
    });

    // Render Battery Trend Chart for selected node
    const selectedNode = window.AgroDataEngine.getNode(state.selectedNodeId);
    const series = window.AgroDataEngine.getNodeData(selectedNode.id, 14);
    window.AgroChartManager.renderBatteryTrendChart('battery-trend-canvas', series, selectedNode);
  }

  // Render Export History
  function renderExportHistoryTable() {
    if (!elements.exportHistoryBody) return;
    elements.exportHistoryBody.innerHTML = '';

    window.AgroDataEngine.exportLogs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color:#0284c7;">${log.name}</strong><br><small style="color:#64748b;">${log.id}</small></td>
        <td>${log.nodes}</td>
        <td>${log.range}</td>
        <td>${log.size}</td>
        <td>${log.created}</td>
        <td><span class="badge online">✓ ${log.status}</span></td>
        <td style="text-align:right;">
          <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.downloadSampleCSV('${log.name}')">
            ⬇ Download
          </button>
        </td>
      `;
      elements.exportHistoryBody.appendChild(tr);
    });
  }

  // Download Raw CSV Function
  function triggerCSVDownload() {
    const nodeRadios = document.querySelectorAll('input[name="export-node-choice"]:checked');
    const choice = nodeRadios.length ? nodeRadios[0].value : 'SELECTED';
    
    let targetNodes = [];
    if (choice === 'SELECTED') {
      targetNodes = [state.selectedNodeId];
    } else if (choice === 'CONNECTED') {
      targetNodes = window.AgroDataEngine.getConnectedNodes().map(n => n.id);
    } else {
      targetNodes = window.AgroDataEngine.getAllNodes().map(n => n.id);
    }

    const metricCheckboxes = document.querySelectorAll('.export-metric-check:checked');
    const selectedMetrics = Array.from(metricCheckboxes).map(cb => cb.value);

    const rangeSelect = document.getElementById('export-range-select');
    const days = rangeSelect ? parseInt(rangeSelect.value, 10) : 7;

    const csvContent = window.AgroDataEngine.generateCSVContent(targetNodes, selectedMetrics, days);
    
    // Create download blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `AdaptiveAgrotech_Export_${choice}_${days}Days_${new Date().toISOString().slice(0,10)}.csv`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Add to export queue
    window.AgroDataEngine.addExportLog(filename, targetNodes.length, `Last ${days} Days`, `${Math.round(blob.size / 1024)} KB`);
    renderExportHistoryTable();

    // Close modal if open
    if (elements.exportModal) {
      elements.exportModal.classList.remove('active');
    }
  }

  // Global helpers exposed to window for inline HTML onclick handlers
  window.selectAndGo = function(nodeId) {
    state.selectedNodeId = nodeId;
    switchTab('monitoring');
    populateNodeDropdown();
    renderActiveNodeUI();
    renderBatteryOverviewTable();
  };

  window.toggleNodeState = function(nodeId) {
    window.AgroDataEngine.toggleNodeStatus(nodeId);
    populateNodeDropdown();
    updateFleetSummaryUI();
    renderActiveNodeUI();
    renderNodesMatrixTable();
    renderBatteryOverviewTable();
  };

  window.downloadSampleCSV = function(name) {
    const csvContent = window.AgroDataEngine.generateCSVContent(['ALL'], ['temp', 'rh', 'co2', 'ch4', 'nh3', 'battery'], 7);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Switch Active Tab View
  function switchTab(tabId) {
    state.activeTab = tabId;
    elements.tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    elements.tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });

    if (tabId === 'battery-health') {
      renderBatteryOverviewTable();
    } else if (tabId === 'advanced-diagnostics') {
      const nodes = window.AgroDataEngine.getConnectedNodes().slice(0, 5);
      window.AgroChartManager.renderNodeComparisonChart('multi-node-diag-canvas', nodes, window.AgroDataEngine, 'temp');
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Navigation Tabs
    elements.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });

    // Node Dropdown Select
    if (elements.nodeSelect) {
      elements.nodeSelect.addEventListener('change', (e) => {
        state.selectedNodeId = e.target.value;
        renderActiveNodeUI();
      });
    }

    // Node Search & Filters in Matrix
    if (elements.nodeSearchInput) {
      elements.nodeSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderNodesMatrixTable();
      });
    }

    if (elements.btnFilterAll) {
      elements.btnFilterAll.onclick = () => { state.statusFilter = 'ALL'; renderNodesMatrixTable(); };
    }
    if (elements.btnFilterOnline) {
      elements.btnFilterOnline.onclick = () => { state.statusFilter = 'connected'; renderNodesMatrixTable(); };
    }
    if (elements.btnFilterOffline) {
      elements.btnFilterOffline.onclick = () => { state.statusFilter = 'disconnected'; renderNodesMatrixTable(); };
    }

    // Time Range Presets (24H, 7D, 30D)
    elements.timeRangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.timeRangeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.timeRangeDays = parseInt(btn.dataset.days, 10);
        renderActiveNodeUI();
      });
    });

    // Metric Toggle Toggles (Temperature, RH, CO₂, CH₄, NH₃)
    elements.metricToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const metric = btn.dataset.metric;
        if (state.activeMetrics.includes(metric)) {
          if (state.activeMetrics.length > 1) {
            state.activeMetrics = state.activeMetrics.filter(m => m !== metric);
            btn.classList.remove('active');
          }
        } else {
          state.activeMetrics.push(metric);
          btn.classList.add('active');
        }
        renderActiveNodeUI();
      });
    });

    // Modal Close
    if (elements.quickLookCloseBtn) {
      elements.quickLookCloseBtn.onclick = closeQuickLook;
    }
    if (elements.quickLookModal) {
      elements.quickLookModal.onclick = (e) => {
        if (e.target === elements.quickLookModal) closeQuickLook();
      };
    }

    // Export Modal Controls
    if (elements.btnOpenExport) {
      elements.btnOpenExport.onclick = () => elements.exportModal.classList.add('active');
    }
    if (elements.btnCloseExport) {
      elements.btnCloseExport.onclick = () => elements.exportModal.classList.remove('active');
    }
    if (elements.exportModal) {
      elements.exportModal.onclick = (e) => {
        if (e.target === elements.exportModal) elements.exportModal.classList.remove('active');
      };
    }
    if (elements.btnExecuteDownload) {
      elements.btnExecuteDownload.onclick = triggerCSVDownload;
    }

    // Interactive Sim Buttons
    if (elements.btnToggleSim) {
      elements.btnToggleSim.onclick = () => {
        state.simulationRunning = !state.simulationRunning;
        elements.btnToggleSim.textContent = state.simulationRunning ? '⏸ Pause Live Stream' : '▶ Resume Live Stream';
      };
    }

    if (elements.btnSimToggleNode) {
      elements.btnSimToggleNode.onclick = () => {
        window.AgroDataEngine.toggleNodeStatus(state.selectedNodeId);
        populateNodeDropdown();
        updateFleetSummaryUI();
        renderActiveNodeUI();
        renderNodesMatrixTable();
        renderBatteryOverviewTable();
      };
    }
  }

  // Simulation Timer Loop (every 3 seconds)
  function startSimulationLoop() {
    setInterval(() => {
      if (state.simulationRunning) {
        window.AgroDataEngine.tick();
        updateFleetSummaryUI();
        // Update metric values on current card smoothly without re-rendering full charts
        const node = window.AgroDataEngine.getNode(state.selectedNodeId);
        if (node.status === 'connected') {
          const valTemp = elements.cardTemp ? elements.cardTemp.querySelector('.card-val-number') : null;
          const valRH = elements.cardRH ? elements.cardRH.querySelector('.card-val-number') : null;
          const valCO2 = elements.cardCO2 ? elements.cardCO2.querySelector('.card-val-number') : null;
          if (valTemp) valTemp.textContent = node.temp;
          if (valRH) valRH.textContent = node.rh;
          if (valCO2) valCO2.textContent = node.co2;
          elements.cardCH4.querySelector('.card-val-number').textContent = node.ch4;
          elements.cardNH3.querySelector('.card-val-number').textContent = node.nh3;
        }
      }
    }, 3000);
  }

  // Start the application
  initApp();
});
