/**
 * MOHAMMED ALA EDDINE BENHAMMOU - PORTFOLIO INTERACTIVE CONTROLLER
 * Features: Code Sandbox Tabs, 599+ Module Live Directory, Hardware & IoT Lab Demo
 */

document.addEventListener('DOMContentLoaded', () => {
  initTerminalTabs();
  initModuleDirectory();
  initHardwareLab();
  initNavScroll();
  initStatCounters();
});

/* ==========================================================================
   1. HERO TERMINAL CODE TABS
   ========================================================================== */
const codeSnippets = {
  model: `<span class="code-comment"># Odoo 18 Enterprise - Student Ledger & Kiosk Model</span>
<span class="code-keyword">from</span> odoo <span class="code-keyword">import</span> models, fields, api, _
<span class="code-keyword">from</span> odoo.exceptions <span class="code-keyword">import</span> ValidationError

<span class="code-keyword">class</span> <span class="code-class">StudentTuitionPayment</span>(models.Model):
    _name = <span class="code-str">'lu.student.tuition.payment'</span>
    _inherit = [<span class="code-str">'mail.thread'</span>, <span class="code-str">'mail.activity.mixin'</span>]
    _description = <span class="code-str">'Lusail Campus Automated Kiosk Payment'</span>

    student_id = fields.Many2one(<span class="code-str">'lu.student'</span>, string=<span class="code-str">'Student'</span>, required=<span class="code-keyword">True</span>, index=<span class="code-keyword">True</span>)
    kiosk_id = fields.Char(string=<span class="code-str">'Terminal Hardware ID'</span>, readonly=<span class="code-keyword">True</span>)
    amount_paid = fields.Monetary(string=<span class="code-str">'Amount (QAR)'</span>, currency_field=<span class="code-str">'currency_id'</span>)
    currency_id = fields.Many2one(<span class="code-str">'res.currency'</span>, default=<span class="code-keyword">lambda</span> self: self.env.company.currency_id)
    payment_method = fields.Selection([
        (<span class="code-str">'qpay'</span>, <span class="code-str">'Qatar Debit Card'</span>),
        (<span class="code-str">'apple_pay'</span>, <span class="code-str">'NFC Contactless'</span>)
    ], required=<span class="code-keyword">True</span>)
    state = fields.Selection([
        (<span class="code-str">'draft'</span>, <span class="code-str">'Initiated'</span>),
        (<span class="code-str">'authorized'</span>, <span class="code-str">'Gateway Validated'</span>),
        (<span class="code-str">'posted'</span>, <span class="code-str">'Ledger Synchronized'</span>)
    ], default=<span class="code-str">'draft'</span>, tracking=<span class="code-keyword">True</span>)

    <span class="code-keyword">@api.model</span>
    <span class="code-keyword">def</span> <span class="code-fn">process_kiosk_transaction</span>(self, payload):
        <span class="code-str">"""Atomic RPC endpoint invoked by campus payment kiosks"""</span>
        student = self.env[<span class="code-str">'lu.student'</span>].search([
            (<span class="code-str">'national_id'</span>, <span class="code-str">'='</span>, payload.get(<span class="code-str">'national_id'</span>))
        ], limit=<span class="code-num">1</span>)
        <span class="code-keyword">if</span> <span class="code-keyword">not</span> student:
            <span class="code-keyword">raise</span> ValidationError(_(<span class="code-str">"Student profile not registered."</span>))
        
        record = self.create({
            <span class="code-str">'student_id'</span>: student.id,
            <span class="code-str">'kiosk_id'</span>: payload.get(<span class="code-str">'kiosk_mac'</span>),
            <span class="code-str">'amount_paid'</span>: payload.get(<span class="code-str">'amount'</span>),
            <span class="code-str">'payment_method'</span>: payload.get(<span class="code-str">'method'</span>),
            <span class="code-str">'state'</span>: <span class="code-str">'posted'</span>
        })
        <span class="code-comment"># Synchronize with Ellucian Banner SIS ledger</span>
        record.action_sync_banner_ledger()
        <span class="code-keyword">return</span> {<span class="code-str">'status'</span>: <span class="code-str">'success'</span>, <span class="code-str">'ref'</span>: record.id, <span class="code-str">'new_balance'</span>: student.balance}`,

  kiosk: `<span class="code-comment"># Python Hardware Daemon: BOCA Thermal Ticket & Kiosk Server</span>
<span class="code-keyword">import</span> socket
<span class="code-keyword">import</span> requests
<span class="code-keyword">import</span> logging

ODOO_RPC_ENDPOINT = <span class="code-str">"https://erp.qatarcinema.qa/jsonrpc"</span>
BOCA_PRINTER_IP = <span class="code-str">"192.168.10.45"</span>
BOCA_PRINTER_PORT = <span class="code-num">9100</span>

<span class="code-keyword">class</span> <span class="code-class">CinemaHardwareBridge</span>:
    <span class="code-keyword">def</span> <span class="code-fn">__init__</span>(self, venue_id):
        self.venue_id = venue_id
        logging.info(<span class="code-str">f"Initialized Hardware Bridge for Venue: {venue_id}"</span>)

    <span class="code-keyword">def</span> <span class="code-fn">send_fgl_ticket</span>(self, ticket_data):
        <span class="code-str">"""Transmit native FGL bytecode directly to BOCA thermal printer"""</span>
        fgl_payload = (
            <span class="code-str">b"&lt;F3&gt;&lt;HW1,1&gt;QATAR CINEMAS&lt;NL&gt;"</span>
            <span class="code-str">b"&lt;F2&gt;&lt;NR&gt;HALL 4 | SEAT F-12&lt;NL&gt;"</span>
            <span class="code-str">f"&lt;F1&gt;Price: {ticket_data['price']} QAR&lt;NL&gt;"</span>.encode() +
            <span class="code-str">f"&lt;BC128&gt;{ticket_data['barcode']}&lt;NL&gt;&lt;P&gt;"</span>.encode()
        )
        <span class="code-keyword">with</span> socket.socket(socket.AF_INET, socket.SOCK_STREAM) <span class="code-keyword">as</span> s:
            s.connect((BOCA_PRINTER_IP, BOCA_PRINTER_PORT))
            s.sendall(fgl_payload)
        logging.info(<span class="code-str">"BOCA Thermal Ticket Cut Signal Dispatched."</span>)

    <span class="code-keyword">def</span> <span class="code-fn">notify_odoo_pos</span>(self, order_id):
        <span class="code-comment"># Inform Odoo backend that ticket printed successfully</span>
        requests.post(ODOO_RPC_ENDPOINT, json={
            <span class="code-str">"jsonrpc"</span>: <span class="code-str">"2.0"</span>,
            <span class="code-str">"method"</span>: <span class="code-str">"call"</span>,
            <span class="code-str">"params"</span>: {<span class="code-str">"model"</span>: <span class="code-str">"pos.order"</span>, <span class="code-str">"method"</span>: <span class="code-str">"mark_printed"</span>, <span class="code-str">"args"</span>: [order_id]}
        })`,

  owl: `<span class="code-comment">/** @odoo-module **/</span>
<span class="code-keyword">import</span> { Component, useState } <span class="code-keyword">from</span> <span class="code-str">"@odoo/owl"</span>;
<span class="code-keyword">import</span> { useService } <span class="code-keyword">from</span> <span class="code-str">"@web/core/utils/hooks"</span>;

<span class="code-keyword">export class</span> <span class="code-class">CinemaSeatSelector</span> <span class="code-keyword">extends</span> Component {
    <span class="code-keyword">static</span> template = <span class="code-str">"cinema_pos.CinemaSeatSelector"</span>;

    <span class="code-fn">setup</span>() {
        <span class="code-keyword">this</span>.orm = useService(<span class="code-str">"orm"</span>);
        <span class="code-keyword">this</span>.notification = useService(<span class="code-str">"notification"</span>);
        <span class="code-keyword">this</span>.state = useState({
            selectedSeats: [],
            totalAmount: <span class="code-num">0</span>,
            isPrinting: <span class="code-keyword">false</span>
        });
    }

    <span class="code-keyword">async</span> <span class="code-fn">onSeatClick</span>(seat) {
        <span class="code-keyword">if</span> (seat.is_reserved) <span class="code-keyword">return</span>;
        <span class="code-keyword">this</span>.state.selectedSeats.push(seat.id);
        <span class="code-keyword">this</span>.state.totalAmount += seat.price;
    }

    <span class="code-keyword">async</span> <span class="code-fn">checkoutToKiosk</span>() {
        <span class="code-keyword">this</span>.state.isPrinting = <span class="code-keyword">true</span>;
        <span class="code-keyword">const</span> order = <span class="code-keyword">await this</span>.orm.call(
            <span class="code-str">"cinema.booking"</span>,
            <span class="code-str">"create_and_dispatch_boca"</span>,
            [<span class="code-keyword">this</span>.state.selectedSeats]
        );
        <span class="code-keyword">this</span>.notification.add(<span class="code-str">"Order dispatched to venue thermal printer"</span>, {
            type: <span class="code-str">"success"</span>
        });
        <span class="code-keyword">this</span>.state.isPrinting = <span class="code-keyword">false</span>;
    }
}`
};

function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tabs .tab-btn');
  const codeContent = document.getElementById('terminal-code-content');
  if (!codeContent) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const snippetKey = tab.getAttribute('data-tab');
      if (codeSnippets[snippetKey]) {
        codeContent.innerHTML = codeSnippets[snippetKey];
      }
    });
  });
}

/* ==========================================================================
   2. 599+ MODULE LIVE DIRECTORY
   ========================================================================== */
let allModules = [];
let filteredModules = [];
let currentPage = 1;
const itemsPerPage = 9;

async function initModuleDirectory() {
  const grid = document.getElementById('modules-grid-container');
  const countBadge = document.getElementById('module-total-count');
  const searchInput = document.getElementById('module-search-input');
  const filterChips = document.querySelectorAll('.category-filter-chips .filter-chip');

  // Load modules data
  try {
    const res = await fetch('data/modules.json');
    allModules = await res.json();
  } catch (e) {
    console.warn('Direct fetch failed (possible file:// protocol), using embedded modules fallback.');
    allModules = getEmbeddedFallbackModules();
  }

  filteredModules = [...allModules];
  if (countBadge) countBadge.textContent = `${allModules.length} Modules Registered`;

  renderModules();

  // Search event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const activeChip = document.querySelector('.category-filter-chips .filter-chip.active');
      const category = activeChip ? activeChip.getAttribute('data-category') : 'all';

      applyFilter(q, category);
    });
  }

  // Filter chips event
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.getAttribute('data-category');
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

      applyFilter(q, category);
    });
  });

  // Pagination buttons
  const prevBtn = document.getElementById('page-prev');
  const nextBtn = document.getElementById('page-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderModules();
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxPages = Math.ceil(filteredModules.length / itemsPerPage);
      if (currentPage < maxPages) {
        currentPage++;
        renderModules();
      }
    });
  }
}

function applyFilter(query, category) {
  filteredModules = allModules.filter(m => {
    const matchesQuery = !query || 
      m.name.toLowerCase().includes(query) || 
      m.folder.toLowerCase().includes(query) ||
      m.repo.toLowerCase().includes(query) ||
      (m.summary && m.summary.toLowerCase().includes(query));

    const matchesCategory = category === 'all' || 
      m.category.toLowerCase().includes(category.toLowerCase());

    return matchesQuery && matchesCategory;
  });

  currentPage = 1;
  const countBadge = document.getElementById('module-total-count');
  if (countBadge) countBadge.textContent = `${filteredModules.length} Modules Found`;

  renderModules();
}

function renderModules() {
  const grid = document.getElementById('modules-grid-container');
  const pageIndicator = document.getElementById('page-indicator');
  const prevBtn = document.getElementById('page-prev');
  const nextBtn = document.getElementById('page-next');
  if (!grid) return;

  grid.innerHTML = '';
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage) || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredModules.slice(start, start + itemsPerPage);

  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 8px;">No matching modules found</p>
        <p style="font-size: 0.85rem; color: var(--text-dim);">Try searching for "payroll", "kiosk", "biotime", "cinema", or "accounting".</p>
      </div>
    `;
  } else {
    pageItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'module-card';
      card.innerHTML = `
        <div>
          <div class="module-card-header">
            <span class="module-category-pill">${escapeHtml(item.category || 'Module')}</span>
            <span class="module-version">v${escapeHtml(item.version || '18.0')}</span>
          </div>
          <h4 class="module-card-title">${escapeHtml(item.name || item.folder)}</h4>
          <p class="module-card-summary">${escapeHtml(item.summary || 'Enterprise workflow automation and Odoo ORM integration module.')}</p>
        </div>
        <div class="module-repo-source">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>
          ${escapeHtml(item.repo)}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  if (pageIndicator) pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==========================================================================
   3. HARDWARE & IOT LIVE LAB DEMO
   ========================================================================== */
const labScenarios = {
  kiosk: {
    title: "Lusail University Tuition Payment Kiosk",
    node1: { icon: "💳", title: "Touch Kiosk Terminal", desc: "NFC / QPay Debit Card Swipe" },
    node2: { icon: "⚡", title: "Python Kiosk Controller", desc: "Local Encrypted Peripheral Driver" },
    node3: { icon: "🏛️", title: "Odoo ERP & Ellucian SIS", desc: "Automated Ledger Sync & Clearing" },
    actionLabel: "Simulate NFC Student Card Tap (QAR 2,450.00)",
    logs: [
      { sender: "HARDWARE", msg: "[RFID-NFC] Contactless Card Read: Student ID #LU-982412 (Mohamed A.)" },
      { sender: "MIDDLEWARE", msg: "[KIOSK-DAEMON] Transmitting encrypted JSON-RPC to https://erp.lu.edu.qa" },
      { sender: "ODOO", msg: "[ORM] Validating tuition invoice balance: Due = 4,900 QAR. Authorizing partial settlement." },
      { sender: "SUCCESS", msg: "[CLEARING] Payment Ref #LU-PAY-0941 posted. Ellucian Banner SIS ledger synchronized." }
    ]
  },
  pos: {
    title: "Qatar Cinema Multi-Venue POS & BOCA Printing",
    node1: { icon: "🍿", title: "Venue POS Station", desc: "Cashier Touchscreen & Barcode Scanner" },
    node2: { icon: "🖨️", title: "BOCA Printer Daemon", desc: "Native FGL Bytecode Server (Port 9100)" },
    node3: { icon: "🎬", title: "Odoo POS Backend", desc: "Real-time Cinema API & Inventory Sync" },
    actionLabel: "Simulate Concession & Ticket Order #QC-4019",
    logs: [
      { sender: "HARDWARE", msg: "[POS-TERMINAL] Order Confirmed: 2x VIP Tickets + Popcorn Combo (180 QAR)" },
      { sender: "MIDDLEWARE", msg: "[BOCA-DAEMON] Compiling FGL binary stream: Hall 2, Row G, Seats 11-12" },
      { sender: "HARDWARE", msg: "[BOCA-TCP] Dispatched socket packet to 192.168.10.45:9100. Cutter engaged." },
      { sender: "SUCCESS", msg: "[ODOO-API] Seat reservation locked. Fiscal journal entry JRNL/2026/04/104 posted." }
    ]
  },
  biotime: {
    title: "ZKTeco BioTime Biometric Attendance & Payroll Sync",
    node1: { icon: "👆", title: "Biometric Device", desc: "Optical Fingerprint & Facial Recognition" },
    node2: { icon: "🔄", title: "BioTime Server API", desc: "Real-time REST Attendance Webhooks" },
    node3: { icon: "💼", title: "Odoo HR & Payroll", desc: "Automated Overtime & WPS Payroll Rules" },
    actionLabel: "Simulate Biometric Check-In Event",
    logs: [
      { sender: "HARDWARE", msg: "[ZK-DEVICE] Verified Fingerprint: Device ID #BIO-DOHA-01 (Timestamp: 08:00:14)" },
      { sender: "MIDDLEWARE", msg: "[BIOTIME-SYNC] Polling punch record #847291: Employee ID #EMP-104" },
      { sender: "ODOO", msg: "[HR_ATTENDANCE] Check-in registered. Computing shift schedule tolerances." },
      { sender: "SUCCESS", msg: "[PAYROLL] Normal shift logged. Qatar WPS compliance rules intact." }
    ]
  }
};

let currentLabMode = 'kiosk';

function initHardwareLab() {
  const modeBtns = document.querySelectorAll('.lab-mode-btn');
  const actionBtn = document.getElementById('lab-action-btn');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLabMode = btn.getAttribute('data-mode');
      updateLabView();
    });
  });

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      runLabSimulation();
    });
  }

  updateLabView();
}

function updateLabView() {
  const scenario = labScenarios[currentLabMode];
  if (!scenario) return;

  const n1 = document.getElementById('node-1');
  const n2 = document.getElementById('node-2');
  const n3 = document.getElementById('node-3');
  const actionBtn = document.getElementById('lab-action-btn');
  const consoleLogs = document.getElementById('console-logs');

  if (n1) {
    n1.querySelector('.node-icon').textContent = scenario.node1.icon;
    n1.querySelector('.node-title').textContent = scenario.node1.title;
    n1.querySelector('.node-desc').textContent = scenario.node1.desc;
  }
  if (n2) {
    n2.querySelector('.node-icon').textContent = scenario.node2.icon;
    n2.querySelector('.node-title').textContent = scenario.node2.title;
    n2.querySelector('.node-desc').textContent = scenario.node2.desc;
  }
  if (n3) {
    n3.querySelector('.node-icon').textContent = scenario.node3.icon;
    n3.querySelector('.node-title').textContent = scenario.node3.title;
    n3.querySelector('.node-desc').textContent = scenario.node3.desc;
  }
  if (actionBtn) {
    actionBtn.textContent = scenario.actionLabel;
  }

  if (consoleLogs) {
    consoleLogs.innerHTML = `
      <div class="log-entry">
        <span class="log-time">[${getCurrentTime()}]</span>
        <span class="log-odoo">SYSTEM READY:</span> Scenario initialized: ${scenario.title}. Click the simulation button below to trigger event.
      </div>
    `;
  }
}

function runLabSimulation() {
  const scenario = labScenarios[currentLabMode];
  const consoleLogs = document.getElementById('console-logs');
  const actionBtn = document.getElementById('lab-action-btn');
  const n1 = document.getElementById('node-1');
  const n2 = document.getElementById('node-2');
  const n3 = document.getElementById('node-3');

  if (!actionBtn || !consoleLogs) return;

  actionBtn.disabled = true;
  actionBtn.textContent = "Processing Simulation Flow...";

  // Step 1: Node 1
  n1.classList.add('active-step');
  n2.classList.remove('active-step');
  n3.classList.remove('active-step');

  setTimeout(() => {
    appendLog(scenario.logs[0].sender, scenario.logs[0].msg);
    // Step 2: Node 2
    n1.classList.remove('active-step');
    n2.classList.add('active-step');
  }, 600);

  setTimeout(() => {
    appendLog(scenario.logs[1].sender, scenario.logs[1].msg);
    if (scenario.logs.length > 2) {
      appendLog(scenario.logs[2].sender, scenario.logs[2].msg);
    }
    // Step 3: Node 3
    n2.classList.remove('active-step');
    n3.classList.add('active-step');
  }, 1400);

  setTimeout(() => {
    appendLog(scenario.logs[scenario.logs.length - 1].sender, scenario.logs[scenario.logs.length - 1].msg);
    n3.classList.remove('active-step');
    actionBtn.disabled = false;
    actionBtn.textContent = scenario.actionLabel;
  }, 2200);
}

function appendLog(sender, text) {
  const consoleLogs = document.getElementById('console-logs');
  if (!consoleLogs) return;

  const entry = document.createElement('div');
  entry.className = 'log-entry';

  let senderClass = 'log-odoo';
  if (sender === 'HARDWARE') senderClass = 'log-hardware';
  if (sender === 'SUCCESS') senderClass = 'log-success';

  entry.innerHTML = `
    <span class="log-time">[${getCurrentTime()}]</span>
    <span class="${senderClass}">[${sender}]</span>
    ${escapeHtml(text)}
  `;

  consoleLogs.appendChild(entry);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
}

/* ==========================================================================
   4. NAVIGATION SCROLL & HIGHLIGHT
   ========================================================================== */
function initNavScroll() {
  const links = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. ANIMATED STAT COUNTERS
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.metric-item .count');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          animateCount(counter, target);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsStrip = document.querySelector('.metrics-strip');
  if (metricsStrip) observer.observe(metricsStrip);
}

function animateCount(elem, target) {
  let count = 0;
  const duration = 1500;
  const stepTime = 20;
  const totalSteps = duration / stepTime;
  const increment = target / totalSteps;

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      elem.textContent = target + (elem.getAttribute('data-suffix') || '');
      clearInterval(timer);
    } else {
      elem.textContent = Math.floor(count) + (elem.getAttribute('data-suffix') || '');
    }
  }, stepTime);
}

/* Fallback module sample for zero-dependency standalone opening */
function getEmbeddedFallbackModules() {
  return [
    { name: "Lusail Campus Accounts API", folder: "accounts_json_api", repo: "nextmove-lu-custom", version: "18.0", category: "Accounting", summary: "JSON-RPC endpoint engine for Ellucian Banner SIS and automated payment kiosk balance synchronization." },
    { name: "Multi-Venue Cinema POS Engine", folder: "cinema_pos", repo: "nextmove-qc-custom", version: "18.0", category: "Point of Sale", summary: "Centralized multi-hall box-office POS with seat map selection and native BOCA thermal ticket printer integration." },
    { name: "BioTime ZKTeco Attendance Gateway", folder: "biotime_server_integration", repo: "nextmove-qc-custom", version: "18.0", category: "Human Resources", summary: "Real-time webhook and TCP synchronization for biometric optical fingerprint and facial check-in devices." },
    { name: "Qatar Wage Protection System (WPS)", folder: "nm_l10n_qa_wps", repo: "nextmove-qc-custom", version: "18.0", category: "Localization", summary: "Compliant SIF banking file generator aligned with Qatar Central Bank and Ministry of Labour directives." },
    { name: "Multi-Level Payment Approval Hierarchy", folder: "account_payment_approval", repo: "nextmove-lu-custom", version: "18.0", category: "Accounting", summary: "Configurable multi-tier financial governance workflow for higher-education and campus requisitions." },
    { name: "Post-Dated Cheques (PDC) Register", folder: "pdc_register", repo: "nextmove-qc-custom", version: "18.0", category: "Accounting", summary: "Complete lifecycle management for vendor and customer cheques with clearance journal entries." },
    { name: "Automated Academic Faculty Payroll", folder: "base_payroll", repo: "nextmove-lu-custom", version: "18.0", category: "Human Resources", summary: "Dynamic salary rule structure parsing professorial tiers, contracts, and campus research allowances." },
    { name: "BOCA Thermal Printing Daemon", folder: "boca_ticket_server", repo: "nextmove-qc-custom", version: "18.0", category: "Hardware/IoT", summary: "Direct socket daemon generating FGL bytecodes and barcode 128 streams to high-speed thermal ticket printers." },
    { name: "Digital Document & Signature Manager", folder: "digital_signature", repo: "nextmove-lu-custom", version: "18.0", category: "Extra Tools", summary: "Cryptographic signature capture and audit trail watermarking for campus administrative agreements." }
  ];
}
