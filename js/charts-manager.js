/**
 * Adaptive AgroTech Chart Manager
 * Handles responsive, interactive time-series visualizations using Chart.js
 */

(function(window) {
  'use strict';

  class ChartManager {
    constructor() {
      this.mainChart = null;
      this.quickLookChart = null;
      this.batteryTrendChart = null;
      this.diagnosticsChart = null;
    }

    // Color palette inspired by clean scientific dashboard aesthetics
    getColors() {
      return {
        temp: { border: '#0284c7', fill: 'rgba(2, 132, 199, 0.08)', name: 'Air Temp (°C)' },
        rh: { border: '#0d9488', fill: 'rgba(13, 148, 136, 0.08)', name: 'Rel Humidity (%)' },
        dewPoint: { border: '#6366f1', fill: 'rgba(99, 102, 241, 0.08)', name: 'Dew Point (°C)' },
        soil: { border: '#d97706', fill: 'rgba(217, 119, 6, 0.08)', name: 'Soil Moisture (%)' },
        solar: { border: '#eab308', fill: 'rgba(234, 179, 8, 0.08)', name: 'Solar Rad (W/m²)' },
        battVolt: { border: '#10b981', fill: 'rgba(16, 185, 129, 0.08)', name: 'Battery (V)' },
        rssi: { border: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.08)', name: 'RSSI (dBm)' },
        offline: { border: '#94a3b8', fill: 'rgba(148, 163, 184, 0.1)' }
      };
    }

    // Render the Primary Multi-Parameter Time-Series Chart
    renderMainChart(canvasId, timeSeriesData, activeMetrics = ['temp', 'rh', 'dewPoint']) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const colors = this.getColors();
      const labels = timeSeriesData.map(d => d.timeLabel);

      const datasets = [];

      if (activeMetrics.includes('temp')) {
        datasets.push({
          label: 'Air Temperature (°C)',
          data: timeSeriesData.map(d => d.temp),
          borderColor: colors.temp.border,
          backgroundColor: colors.temp.fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          yAxisID: 'yTemp',
          tension: 0.3,
          fill: true
        });
      }

      if (activeMetrics.includes('rh')) {
        datasets.push({
          label: 'Relative Humidity (%)',
          data: timeSeriesData.map(d => d.rh),
          borderColor: colors.rh.border,
          backgroundColor: colors.rh.fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          yAxisID: 'yRH',
          tension: 0.3,
          fill: true
        });
      }

      if (activeMetrics.includes('dewPoint')) {
        datasets.push({
          label: 'Dew Point (°C)',
          data: timeSeriesData.map(d => d.dewPoint),
          borderColor: colors.dewPoint.border,
          backgroundColor: 'transparent',
          borderWidth: 1.8,
          borderDash: [5, 4],
          pointRadius: 0,
          pointHoverRadius: 5,
          yAxisID: 'yTemp',
          tension: 0.3
        });
      }

      if (activeMetrics.includes('soil')) {
        datasets.push({
          label: 'Soil Moisture (%)',
          data: timeSeriesData.map(d => d.soil),
          borderColor: colors.soil.border,
          backgroundColor: colors.soil.fill,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          yAxisID: 'yRH',
          tension: 0.2
        });
      }

      if (activeMetrics.includes('solar')) {
        datasets.push({
          label: 'Solar Radiation (W/m²)',
          data: timeSeriesData.map(d => d.solar),
          borderColor: colors.solar.border,
          backgroundColor: colors.solar.fill,
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          yAxisID: 'ySolar',
          tension: 0.2
        });
      }

      if (this.mainChart) {
        this.mainChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      this.mainChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 14,
                boxHeight: 4,
                usePointStyle: true,
                font: { family: 'Inter, system-ui, sans-serif', size: 12, weight: '500' }
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { size: 12, weight: '600' },
              bodyFont: { size: 12 },
              padding: 10,
              cornerRadius: 6
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { maxTicksLimit: 8, font: { size: 11 } }
            },
            yTemp: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'Temperature & Dew Point (°C)', font: { size: 11, weight: '600' } },
              grid: { color: 'rgba(226, 232, 240, 0.8)' }
            },
            yRH: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Humidity & Soil (%)', font: { size: 11, weight: '600' } },
              grid: { display: false },
              min: 0,
              max: 100
            },
            ySolar: {
              type: 'linear',
              position: 'right',
              display: activeMetrics.includes('solar'),
              title: { display: true, text: 'Solar (W/m²)', font: { size: 11, weight: '600' } },
              grid: { display: false },
              min: 0
            }
          }
        }
      });
    }

    // Render LI-COR style Quick Look modal chart for a single parameter
    renderQuickLookChart(canvasId, node, metricKey, timeSeriesData) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const colors = this.getColors();
      const labels = timeSeriesData.map(d => d.timeLabel);
      
      let data = [];
      let label = '';
      let color = colors.temp.border;
      let unit = '';

      switch (metricKey) {
        case 'temp':
          data = timeSeriesData.map(d => d.temp);
          label = `${node.id} - Air Temperature`;
          color = colors.temp.border;
          unit = '°C';
          break;
        case 'rh':
          data = timeSeriesData.map(d => d.rh);
          label = `${node.id} - Relative Humidity`;
          color = colors.rh.border;
          unit = '%';
          break;
        case 'dewPoint':
          data = timeSeriesData.map(d => d.dewPoint);
          label = `${node.id} - Dew Point`;
          color = colors.dewPoint.border;
          unit = '°C';
          break;
        case 'soil':
          data = timeSeriesData.map(d => d.soil);
          label = `${node.id} - Soil Moisture`;
          color = colors.soil.border;
          unit = '%';
          break;
        case 'solar':
          data = timeSeriesData.map(d => d.solar);
          label = `${node.id} - Solar Radiation`;
          color = colors.solar.border;
          unit = 'W/m²';
          break;
        case 'battery':
          data = timeSeriesData.map(d => d.battVolt);
          label = `${node.id} - Battery Voltage`;
          color = colors.battVolt.border;
          unit = 'V';
          break;
        default:
          data = timeSeriesData.map(d => d.temp);
          label = `${node.id} - Value`;
          unit = '';
      }

      if (this.quickLookChart) {
        this.quickLookChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      this.quickLookChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${label} (${unit})`,
            data,
            borderColor: color,
            backgroundColor: 'rgba(2, 132, 199, 0.06)',
            borderWidth: 2,
            pointRadius: 1,
            pointHoverRadius: 6,
            tension: 0.25,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.y} ${unit}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { maxTicksLimit: 8 }
            },
            y: {
              title: { display: true, text: `${label} (${unit})` },
              grid: { color: 'rgba(226, 232, 240, 0.8)' }
            }
          }
        }
      });
    }

    // Render Battery Health Telemetry & Degradation Chart
    renderBatteryTrendChart(canvasId, timeSeriesData, node) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const labels = timeSeriesData.map(d => d.timeLabel);
      const voltData = timeSeriesData.map(d => d.battVolt);
      const solarData = timeSeriesData.map(d => d.solar);

      if (this.batteryTrendChart) {
        this.batteryTrendChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      this.batteryTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Battery Voltage (V)',
              data: voltData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              yAxisID: 'yVolt',
              tension: 0.2,
              fill: true
            },
            {
              label: 'Solar Harvest (W/m²)',
              data: solarData,
              borderColor: '#f59e0b',
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderDash: [3, 3],
              pointRadius: 0,
              yAxisID: 'ySolar',
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: { boxWidth: 12, usePointStyle: true }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } },
            yVolt: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'Battery Voltage (V)' },
              min: 2.8,
              max: 4.3,
              grid: { color: 'rgba(226, 232, 240, 0.7)' }
            },
            ySolar: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Solar Irradiance (W/m²)' },
              grid: { display: false },
              min: 0
            }
          }
        }
      });
    }

    // Render Multi-node Comparison chart
    renderNodeComparisonChart(canvasId, nodesList, dataEngine, metricKey = 'temp') {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const palette = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
      const datasets = [];
      let commonLabels = [];

      nodesList.forEach((node, idx) => {
        const series = dataEngine.getNodeData(node.id, 7);
        if (commonLabels.length === 0) {
          commonLabels = series.map(d => d.timeLabel);
        }

        const color = palette[idx % palette.length];
        let values = [];
        let unit = '°C';

        if (metricKey === 'temp') { values = series.map(d => d.temp); unit = '°C'; }
        else if (metricKey === 'rh') { values = series.map(d => d.rh); unit = '%'; }
        else if (metricKey === 'soil') { values = series.map(d => d.soil); unit = '%'; }
        else if (metricKey === 'battery') { values = series.map(d => d.battVolt); unit = 'V'; }

        datasets.push({
          label: `${node.id} (${node.name})`,
          data: values,
          borderColor: node.status === 'connected' ? color : '#94a3b8',
          borderDash: node.status === 'connected' ? [] : [4, 4],
          backgroundColor: 'transparent',
          borderWidth: node.status === 'connected' ? 2 : 1.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.25
        });
      });

      if (this.diagnosticsChart) {
        this.diagnosticsChart.destroy();
      }

      const ctx = canvas.getContext('2d');
      this.diagnosticsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: commonLabels,
          datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } },
            tooltip: { mode: 'index', intersect: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
            y: { grid: { color: 'rgba(226, 232, 240, 0.8)' } }
          }
        }
      });
    }
  }

  window.AgroChartManager = new ChartManager();

})(window);
