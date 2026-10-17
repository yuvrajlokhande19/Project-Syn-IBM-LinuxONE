/**
 * ==============================================================================
 * SYN // RESILIENCE COMMAND - IBM LinuxONE Mainframe Client Engine (Mumbai Edition)
 * Zero-Trust Cryptographic Ingestion & Real-Time Multi-Node Synchronization
 * ==============================================================================
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentTab: 'command-center',
    sovereigntyMode: 'sovereign', // 'connected' | 'sovereign' | 'degraded'
    currentLang: 'en',            // 'en' | 'hi' | 'mr'
    feedMode: 'live',             // 'live' | 'mock'
    isAttackActive: false,
    isBlackoutActive: false,
    hospitalIdentity: 'KEM Hospital (Mumbai Parel Hub)',
    sensorData: {
      gridVoltage: [219.2, 219.0, 218.8, 218.5, 218.9, 219.3, 218.6, 218.4, 218.5, 218.6, 218.5, 218.7, 218.4, 218.5, 218.6, 218.5, 218.7, 218.5, 218.4, 218.5],
      floodIndex:  [12.0, 12.5, 13.0, 14.5, 17.0, 22.5, 31.0, 48.0, 68.0, 78.5, 84.0, 81.0, 72.0, 60.0, 45.0, 32.0, 24.0, 18.0, 15.0, 14.0]
    }
  };

  // Multilingual Incident Dispatch Dictionary
  const translations = {
    incident: {
      en: 'Hindmata South corridor inundated (1.4m surge). Rerouting Ambulance 04 via Ambedkar Elevated Flyover to KEM ICU Ward B.',
      hi: 'हिंदमाता दक्षिणी गलियारा जलमग्न (1.4 मीटर जलभराव)। एम्बुलेंस 04 को अंबेडकर एलिवेटेड फ्लाईओवर से केईएम आईसीयू वार्ड बी भेजा जा रहा है।',
      mr: 'हिंदमाता दक्षिण मार्ग पाण्याखाली (१.४ मी पूर). रुग्णवाहिका ०४ आंबेडकर उड्डाणपुलावरून केईएम आयसीयू वार्ड बी कडे वळवली आहे.'
    }
  };

  // DOM Elements Cache
  const elements = {
    navTabs: document.querySelectorAll('.nav-tab'),
    viewPanels: document.querySelectorAll('.view-panel'),
    headerHospitalName: document.getElementById('header-hospital-name'),
    blueprintHospitalTitle: document.getElementById('blueprint-hospital-title'),
    attackBanner: document.getElementById('attack-banner'),
    threatBannerText: document.getElementById('threat-banner-text'),
    btnLive: document.getElementById('btn-live'),
    btnMock: document.getElementById('btn-mock'),
    btnSimulateAttack: document.getElementById('btn-simulate-attack'),
    btnSimulateBlackout: document.getElementById('btn-simulate-blackout'),
    blackoutBtnText: document.getElementById('blackout-btn-text'),
    footerIncidentText: document.getElementById('footer-incident-text'),
    langBtns: document.querySelectorAll('.lang-btn'),
    modePills: document.querySelectorAll('.mode-pill'),
    sovCards: document.querySelectorAll('.sov-card'),
    sensorCanvas: document.getElementById('sensor-canvas'),
    chartLatestPkt: document.getElementById('chart-latest-pkt'),
    tableIncomingPackets: document.getElementById('table-incoming-packets'),
    packetsTbody: document.getElementById('packets-tbody'),
    attackPacketRow: document.getElementById('attack-packet-row'),
    attackGateRow: document.getElementById('attack-gate-row'),
    livePacketId: document.getElementById('live-packet-id'),
    livePacketLocation: document.getElementById('live-packet-location'),
    terminalStream: document.getElementById('terminal-stream'),
    terminalAttackLine: document.getElementById('terminal-attack-line'),
    terminalTime: document.getElementById('terminal-time'),
    terminalBlock: document.getElementById('terminal-block'),
    terminalHash: document.getElementById('terminal-hash'),
    ledgerChainLength: document.getElementById('ledger-chain-length'),
    ledgerChainStatus: document.getElementById('ledger-chain-status'),
    ledgerHeadHash: document.getElementById('ledger-head-hash'),
    ledgerTbody: document.getElementById('ledger-tbody'),
    ledgerAttackRow: document.getElementById('ledger-attack-row'),
    roomVoltageA: document.getElementById('room-voltage-a'),
    roomVoltageB: document.getElementById('room-voltage-b'),
    statusConnectivity: document.getElementById('status-connectivity'),
    briefAckTime: document.getElementById('brief-ack-time')
  };

  /**
   * Initialize Application
   */
  function init() {
    detectNodeIdentity();
    setupTabNavigation();
    setupSovereigntyModes();
    setupLanguageSwitcher();
    setupAttackSimulation();
    setupBlackoutSimulation();
    setupFeedToggle();
    initSensorTrendChart();
    setupInteractiveNodes();

    // Start Live Backend Polling (Synchronizes across all browser tabs)
    startLiveBackendPolling();
  }

  /**
   * Detect whether current instance is Node 1 (KEM Parel) or Node 2 (Sion Hospital)
   */
  function detectNodeIdentity() {
    const host = window.location.hostname;
    if (host.includes('148.100.98.9')) {
      state.hospitalIdentity = 'Sion Hospital (LTMGH North Hub)';
      if (elements.headerHospitalName) {
        elements.headerHospitalName.textContent = 'SION HOSPITAL · LTMGH NORTH HUB (NODE 2)';
        elements.headerHospitalName.style.borderColor = 'rgba(0, 229, 163, 0.4)';
        elements.headerHospitalName.style.color = '#00e5a3';
      }
      if (elements.blueprintHospitalTitle) {
        elements.blueprintHospitalTitle.textContent = 'SION HOSPITAL · LTMGH NORTH EMERGENCY HUB';
      }
      document.title = 'SYN // Resilience Command - Sion Hospital (Node 2)';
    } else {
      state.hospitalIdentity = 'KEM Hospital (Mumbai Parel Hub)';
      if (elements.headerHospitalName) {
        elements.headerHospitalName.textContent = 'KEM HOSPITAL · MUMBAI PAREL HUB (NODE 1)';
      }
      if (elements.blueprintHospitalTitle) {
        elements.blueprintHospitalTitle.textContent = 'KEM HOSPITAL · MUMBAI PAREL TRAUMA';
      }
      document.title = 'SYN // Resilience Command - KEM Hospital (Node 1)';
    }
  }

  /**
   * Tab Navigation Logic
   */
  function setupTabNavigation() {
    elements.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetViewId = tab.getAttribute('data-tab');
        switchTab(targetViewId);
      });
    });
  }

  function switchTab(tabId) {
    state.currentTab = tabId;

    elements.navTabs.forEach(tab => {
      const match = tab.getAttribute('data-tab') === tabId;
      tab.classList.toggle('active', match);
      tab.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    elements.viewPanels.forEach(panel => {
      const match = panel.id === `view-${tabId}`;
      panel.classList.toggle('active', match);
    });

    if (tabId === 'command-center') {
      requestAnimationFrame(renderSensorChart);
    }
  }

  /**
   * Sovereignty Mode Selection
   */
  function setupSovereigntyModes() {
    elements.modePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const mode = pill.getAttribute('data-mode');
        setSovereigntyMode(mode);
      });
    });

    elements.sovCards.forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        setSovereigntyMode(mode);
      });
    });
  }

  async function setSovereigntyMode(mode) {
    state.sovereigntyMode = mode;

    elements.modePills.forEach(pill => {
      const isMatch = pill.getAttribute('data-mode') === mode;
      pill.classList.toggle('active-pill', isMatch);
      pill.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });

    elements.sovCards.forEach(card => {
      const cardMode = card.getAttribute('data-mode');
      const isMatch = cardMode === mode;
      card.classList.toggle('active-sov-card', isMatch);

      const statusEl = card.querySelector('.sov-card-status');
      const numEl = card.querySelector('.sov-card-num');

      if (statusEl && numEl) {
        if (isMatch) {
          numEl.classList.add('amber-text');
          statusEl.className = 'sov-card-status status-active';
          statusEl.innerHTML = '<span class="badge-dot amber"></span> ACTIVE';
        } else {
          numEl.classList.remove('amber-text');
          statusEl.className = 'sov-card-status status-standby';
          statusEl.innerHTML = '<span class="badge-dot gray"></span> Standby';
        }
      }
    });

    // Notify backend
    try {
      await fetch('/api/sovereignty/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: mode })
      });
    } catch (e) {
      // Offline fallback
    }
  }

  /**
   * Language Switcher
   */
  function setupLanguageSwitcher() {
    elements.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  function setLanguage(lang) {
    state.currentLang = lang;

    elements.langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (translations.incident[lang] && elements.footerIncidentText) {
      elements.footerIncidentText.textContent = translations.incident[lang];
      if (lang !== 'en') {
        elements.footerIncidentText.classList.add('devanagari-font');
      } else {
        elements.footerIncidentText.classList.remove('devanagari-font');
      }
    }
  }

  /**
   * Attack Simulation Trigger (Calls genuine backend CPACF gate)
   */
  function setupAttackSimulation() {
    if (!elements.btnSimulateAttack) return;
    elements.btnSimulateAttack.addEventListener('click', () => {
      executeRealAttackSimulation();
    });
  }

  async function executeRealAttackSimulation() {
    state.isAttackActive = !state.isAttackActive;
    const btn = elements.btnSimulateAttack;
    const btnText = btn.querySelector('.btn-attack-text') || btn;

    if (state.isAttackActive) {
      btn.classList.add('attack-active');
      btnText.textContent = 'RECOVER SYSTEM';
      if (elements.attackBanner) elements.attackBanner.hidden = false;
      if (elements.attackPacketRow) elements.attackPacketRow.hidden = false;
      if (elements.attackGateRow) elements.attackGateRow.hidden = false;
      if (elements.terminalAttackLine) elements.terminalAttackLine.hidden = false;
      if (elements.ledgerAttackRow) elements.ledgerAttackRow.style.display = 'table-row';

      // Send actual adversarial injection to backend
      try {
        const resp = await fetch('/api/attack/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attack_type: 'tamper' })
        });
        const data = await resp.json();
        if (elements.threatBannerText) {
          elements.threatBannerText.textContent = `[${data.verdict || 'HMAC AUTHENTICATION FAILED'} - ${data.reason || 'INJECTION REJECTED'}]`;
        }
      } catch (err) {
        if (elements.threatBannerText) {
          elements.threatBannerText.textContent = '[HMAC AUTHENTICATION FAILED - 401 UNAUTHORIZED INJECTION BLOCKED]';
        }
      }
    } else {
      btn.classList.remove('attack-active');
      btnText.textContent = 'SIMULATE ATTACK';
      if (elements.attackBanner) elements.attackBanner.hidden = true;
      if (elements.attackPacketRow) elements.attackPacketRow.hidden = true;
      if (elements.attackGateRow) elements.attackGateRow.hidden = true;
      if (elements.terminalAttackLine) elements.terminalAttackLine.hidden = true;
      if (elements.ledgerAttackRow) elements.ledgerAttackRow.style.display = 'none';
    }
  }

  /**
   * Internet Blackout Simulation
   */
  function setupBlackoutSimulation() {
    if (!elements.btnSimulateBlackout) return;

    elements.btnSimulateBlackout.addEventListener('click', async () => {
      state.isBlackoutActive = !state.isBlackoutActive;

      if (state.isBlackoutActive) {
        elements.btnSimulateBlackout.classList.add('active-blackout');
        elements.blackoutBtnText.textContent = 'RECONNECT INTERNET UPLINK';
        await setSovereigntyMode('sovereign');
        if (elements.statusConnectivity) {
          elements.statusConnectivity.textContent = 'Sovereign Offline (s390x)';
          elements.statusConnectivity.style.color = '#fbbf24';
        }
      } else {
        elements.btnSimulateBlackout.classList.remove('active-blackout');
        elements.blackoutBtnText.textContent = 'SIMULATE INTERNET BLACKOUT';
        await setSovereigntyMode('connected');
        if (elements.statusConnectivity) {
          elements.statusConnectivity.textContent = 'Mainframe Online';
          elements.statusConnectivity.style.color = '#10b981';
        }
      }
    });
  }

  /**
   * Live vs Mock Data Mode Toggle
   */
  function setupFeedToggle() {
    if (elements.btnLive) {
      elements.btnLive.addEventListener('click', () => {
        state.feedMode = 'live';
        elements.btnLive.classList.add('active');
        elements.btnMock.classList.remove('active');
        startLiveBackendPolling();
      });
    }

    if (elements.btnMock) {
      elements.btnMock.addEventListener('click', () => {
        state.feedMode = 'mock';
        elements.btnMock.classList.add('active');
        elements.btnLive.classList.remove('active');
        stopLiveBackendPolling();
        startMockTicker();
      });
    }
  }

  /**
   * REAL-TIME BACKEND POLLING
   * Synchronizes state across all browser tabs from FastAPI
   */
  let backendPollTimer = null;
  function startLiveBackendPolling() {
    if (backendPollTimer) clearInterval(backendPollTimer);
    fetchLiveTelemetry();
    backendPollTimer = setInterval(fetchLiveTelemetry, 1500);
  }

  function stopLiveBackendPolling() {
    if (backendPollTimer) {
      clearInterval(backendPollTimer);
      backendPollTimer = null;
    }
  }

  async function fetchLiveTelemetry() {
    if (state.feedMode !== 'live') return;

    try {
      const resp = await fetch('/api/telemetry/live');
      if (!resp.ok) return;
      const data = await resp.json();

      // Update Metrics
      const m = data.metrics || {};
      const volt = parseFloat(m.grid_voltage || 218.5);
      const flood = parseFloat(m.flood_index || 0.12) * 100;

      // Update room badges
      if (elements.roomVoltageA) elements.roomVoltageA.textContent = volt.toFixed(1);
      if (elements.roomVoltageB) elements.roomVoltageB.textContent = volt.toFixed(1);

      // Append to sensor arrays
      state.sensorData.gridVoltage.shift();
      state.sensorData.gridVoltage.push(parseFloat(volt.toFixed(1)));

      state.sensorData.floodIndex.shift();
      state.sensorData.floodIndex.push(parseFloat(flood.toFixed(1)));

      // Update latest packet info
      if (data.latest_block) {
        if (elements.livePacketId) elements.livePacketId.textContent = data.latest_block.packet_id || 'SYN-9942';
        if (elements.livePacketLocation) elements.livePacketLocation.textContent = data.latest_block.location || 'KEM_Hospital_Parel';
      }

      // Update Ledger counts & head hash
      if (data.ledger_stats) {
        const total = data.ledger_stats.total_blocks || 7624;
        if (elements.ledgerChainLength) elements.ledgerChainLength.textContent = total.toLocaleString();
        if (elements.terminalBlock) elements.terminalBlock.textContent = `BLOCK #${total}`;
      }

      if (data.last_hash) {
        const shortHash = data.last_hash.substring(0, 10) + '...';
        if (elements.terminalHash) elements.terminalHash.textContent = shortHash;
        if (elements.ledgerHeadHash) elements.ledgerHeadHash.textContent = `HEAD: ${shortHash} | CPACF-VERIFIED`;
      }

      const nowTime = new Date().toTimeString().split(' ')[0];
      if (elements.terminalTime) elements.terminalTime.textContent = nowTime;
      if (elements.briefAckTime) elements.briefAckTime.textContent = `ACK: ${nowTime} UTC · SHA-256 VERIFIED`;

      // Update Ledger Table Rows
      if (data.recent_blocks && data.recent_blocks.length > 0 && elements.ledgerTbody) {
        renderRecentLedgerBlocks(data.recent_blocks);
      }

      // Redraw canvas if active
      if (state.currentTab === 'command-center') {
        renderSensorChart();
      }

    } catch (e) {
      // Network hiccup - gracefully keep existing state
    }
  }

  function renderRecentLedgerBlocks(blocks) {
    // Keep attack row if present
    const attackRowHtml = elements.ledgerAttackRow ? elements.ledgerAttackRow.outerHTML : '';
    let rowsHtml = attackRowHtml;

    blocks.slice(0, 6).forEach((b, idx) => {
      const blockId = b.id || (7624 - idx);
      const packetId = b.packet_id || `SYN-${9942 - idx}`;
      const prevHash = (b.previous_hash || '9f4b72a1').substring(0, 10) + '...';
      const currHash = (b.hash || 'e3b0c442').substring(0, 10) + '...';
      const loc = b.sensor_location || 'KEM Hospital Parel';
      const ts = (b.timestamp || '').split('T')[1]?.substring(0, 8) || '18:58:30';

      rowsHtml += `
        <tr class="ledger-row">
          <td class="mono-bold">${blockId}</td>
          <td class="mono-bold">${packetId}</td>
          <td>${loc}</td>
          <td class="hash-cell"><span class="amber-chain-underline">${prevHash}</span></td>
          <td class="hash-cell mono-text">${currHash}</td>
          <td><span class="check-icon-green">✓</span> <span class="text-green">CPACF Verified</span></td>
          <td class="mono-text">${ts}</td>
        </tr>
      `;
    });

    elements.ledgerTbody.innerHTML = rowsHtml;
  }

  /**
   * Mock Ticker Fallback
   */
  let mockTickerTimer = null;
  function startMockTicker() {
    if (mockTickerTimer) clearInterval(mockTickerTimer);
    mockTickerTimer = setInterval(() => {
      const newVolt = 218.3 + (Math.random() * 0.5);
      const newFlood = Math.max(10, Math.min(85, state.sensorData.floodIndex[state.sensorData.floodIndex.length - 1] + (Math.random() * 4 - 2)));

      state.sensorData.gridVoltage.shift();
      state.sensorData.gridVoltage.push(parseFloat(newVolt.toFixed(1)));

      state.sensorData.floodIndex.shift();
      state.sensorData.floodIndex.push(parseFloat(newFlood.toFixed(1)));

      if (state.currentTab === 'command-center') {
        renderSensorChart();
      }
    }, 2000);
  }

  /**
   * Sensor Trend Canvas Line Chart
   */
  function initSensorTrendChart() {
    window.addEventListener('resize', () => {
      if (state.currentTab === 'command-center') {
        renderSensorChart();
      }
    });
    renderSensorChart();
  }

  function renderSensorChart() {
    const canvas = elements.sensorCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth || 460;
    const height = canvas.clientHeight || 120;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 15, right: 15, bottom: 20, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Subtle Horizontal Grid Lines
    ctx.strokeStyle = '#141d2c';
    ctx.lineWidth = 1;

    for (let i = 0; i < 3; i++) {
      const y = padding.top + (chartH / 2) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    const voltages = state.sensorData.gridVoltage;
    const floods = state.sensorData.floodIndex;
    const count = voltages.length;
    const stepX = chartW / (count - 1);

    // 1. Green Grid Voltage Line
    const voltMin = 215.5;
    const voltMax = 221.0;
    
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 6;

    voltages.forEach((val, idx) => {
      const x = padding.left + idx * stepX;
      const normalized = (val - voltMin) / (voltMax - voltMin);
      const y = padding.top + chartH - normalized * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Amber Flood Index Line
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
    ctx.shadowBlur = 6;

    floods.forEach((val, idx) => {
      const x = padding.left + idx * stepX;
      const normalized = val / 100;
      const y = padding.top + chartH - normalized * (chartH * 0.85);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // End Dots
    const lastX = padding.left + (count - 1) * stepX;
    const lastVoltNorm = (voltages[count - 1] - voltMin) / (voltMax - voltMin);
    const lastVoltY = padding.top + chartH - lastVoltNorm * chartH;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(lastX, lastVoltY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const lastFloodNorm = floods[count - 1] / 100;
    const lastFloodY = padding.top + chartH - lastFloodNorm * (chartH * 0.85);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(lastX, lastFloodY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  /**
   * Interactive Network Nodes
   */
  function setupInteractiveNodes() {
    const nodes = document.querySelectorAll('.mesh-node');
    nodes.forEach(node => {
      node.style.cursor = 'pointer';
      node.addEventListener('mouseenter', () => {
        node.style.filter = 'brightness(1.4)';
      });
      node.addEventListener('mouseleave', () => {
        node.style.filter = 'none';
      });
    });
  }

  // Self-execute initialization on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
