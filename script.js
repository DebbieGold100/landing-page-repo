/* ============================================================
   Spendly — Expense Tracker
   Author: Deborah Gold
   Plain JavaScript · no frameworks
   ============================================================ */

/* ----- Category definitions ----- */
const CATEGORIES = {
  food: { label: "Food & Dining", emoji: "🍽️", color: "#f59e0b" },
  transport: { label: "Transport", emoji: "🚗", color: "#38bdf8" },
  shopping: { label: "Shopping", emoji: "🛍️", color: "#ec4899" },
  bills: { label: "Bills & Utilities", emoji: "⚡", color: "#f43f5e" },
  housing: { label: "Housing", emoji: "🏠", color: "#22c55e" },
  fun: { label: "Entertainment", emoji: "🎮", color: "#a78bfa" },
  salary: { label: "Salary", emoji: "💼", color: "#34d399" },
  gift: { label: "Gifts", emoji: "🎁", color: "#fb7185" },
  other: { label: "Other", emoji: "•••", color: "#94a3b8" },
};

const EXPENSE_CATS = ["food", "transport", "shopping", "bills", "housing", "fun", "other"];
const INCOME_CATS = ["salary", "gift", "other"];

const STORAGE_KEY = "spendly_transactions_v1";

/* ----- Helper: date offset from today (yyyy-mm-dd) ----- */
function iso(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/* ----- Sample / demo data ----- */
const SEED = [
  { id: "s1", title: "Monthly Salary", amount: 320000, type: "income", category: "salary", date: iso(-2) },
  { id: "s2", title: "Groceries", amount: 24500, type: "expense", category: "food", date: iso(-2) },
  { id: "s3", title: "Bus & Ride Fares", amount: 8000, type: "expense", category: "transport", date: iso(-4) },
  { id: "s4", title: "Electricity Bill", amount: 15000, type: "expense", category: "bills", date: iso(-5) },
  { id: "s5", title: "New Headphones", amount: 32000, type: "expense", category: "shopping", date: iso(-7) },
  { id: "s6", title: "Freelance Project", amount: 90000, type: "income", category: "gift", date: iso(-8) },
  { id: "s7", title: "Movie Night", amount: 6500, type: "expense", category: "fun", date: iso(-9) },
];

/* ----- State ----- */
let transactions = loadTransactions();
let currentType = "expense";
let currentFilter = "all";
let searchTerm = "";

/* ----- DOM references ----- */
const el = (id) => document.getElementById(id);
const balanceValue = el("balanceValue");
const incomeValue = el("incomeValue");
const expenseValue = el("expenseValue");
const countValue = el("countValue");
const categorySelect = el("category");
const txnList = el("txnList");
const breakdownArea = el("breakdownArea");
const formError = el("formError");

/* ============================================================
   Formatting helpers
   ============================================================ */
function formatMoney(n) {
  return "₦" + Math.abs(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });
}

function formatDate(s) {
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

/* ============================================================
   Storage
   ============================================================ */
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  return SEED.slice();
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    /* ignore */
  }
}

/* ============================================================
   Rendering
   ============================================================ */
function render() {
  renderSummary();
  renderBreakdown();
  renderList();
  saveTransactions();
}

function renderSummary() {
  let income = 0;
  let expense = 0;
  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });
  const balance = income - expense;

  balanceValue.textContent = (balance < 0 ? "-" : "") + formatMoney(balance);
  balanceValue.classList.toggle("negative", balance < 0);
  incomeValue.textContent = formatMoney(income);
  expenseValue.textContent = formatMoney(expense);
  countValue.textContent = transactions.length + " transactions recorded";
}

function renderBreakdown() {
  const map = {};
  transactions.forEach((t) => {
    if (t.type !== "expense") return;
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  const items = Object.keys(map)
    .map((cat) => ({ cat, value: map[cat] }))
    .sort((a, b) => b.value - a.value);
  const total = items.reduce((sum, it) => sum + it.value, 0);

  if (total === 0) {
    breakdownArea.innerHTML =
      '<p class="empty">No expenses yet. Add an expense to see your breakdown.</p>';
    return;
  }

  // Build conic-gradient string for the donut
  let acc = 0;
  const stops = items.map((it) => {
    const start = (acc / total) * 100;
    acc += it.value;
    const end = (acc / total) * 100;
    const color = CATEGORIES[it.cat].color;
    return `${color} ${start}% ${end}%`;
  });
  const conic = `conic-gradient(${stops.join(", ")})`;

  const legend = items
    .map((it) => {
      const meta = CATEGORIES[it.cat];
      const pct = ((it.value / total) * 100).toFixed(0);
      return `
        <li>
          <span class="dot" style="background:${meta.color}"></span>
          <span class="lg-name">${meta.label}</span>
          <span class="lg-val">${formatMoney(it.value)}</span>
          <span class="lg-pct">${pct}%</span>
        </li>`;
    })
    .join("");

  breakdownArea.innerHTML = `
    <div class="breakdown">
      <div class="donut" style="background:${conic}" role="img" aria-label="Expense breakdown chart">
        <div class="donut-hole">
          <small>Spent</small>
          <strong>${formatMoney(total)}</strong>
        </div>
      </div>
      <ul class="legend">${legend}</ul>
    </div>`;
}

function renderList() {
  let visible = transactions.slice();

  // filter by type
  if (currentFilter !== "all") {
    visible = visible.filter((t) => t.type === currentFilter);
  }

  // filter by search term
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    visible = visible.filter((t) => {
      const catLabel = CATEGORIES[t.category] ? CATEGORIES[t.category].label : "";
      return (t.title + " " + catLabel).toLowerCase().includes(q);
    });
  }

  // newest first
  visible.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  if (visible.length === 0) {
    txnList.innerHTML = '<li class="txn-empty">No transactions found.</li>';
    return;
  }

  txnList.innerHTML = visible
    .map((t) => {
      const meta = CATEGORIES[t.category] || CATEGORIES.other;
      const isIncome = t.type === "income";
      const sign = isIncome ? "+" : "-";
      return `
        <li class="txn">
          <span class="txn-icon" style="background:${meta.color}22;color:${meta.color}">${meta.emoji}</span>
          <div class="txn-info">
            <p class="t-title">${escapeHtml(t.title)}</p>
            <p class="t-meta">${meta.label} · ${formatDate(t.date)}</p>
          </div>
          <span class="txn-amount ${isIncome ? "income" : "expense"}">${sign}${formatMoney(t.amount)}</span>
          <button class="txn-delete" data-id="${t.id}" aria-label="Delete ${escapeHtml(t.title)}">🗑</button>
        </li>`;
    })
    .join("");
}

/* Basic HTML escaping to keep the list safe */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ============================================================
   Category dropdown
   ============================================================ */
function fillCategories() {
  const cats = currentType === "expense" ? EXPENSE_CATS : INCOME_CATS;
  categorySelect.innerHTML = cats
    .map((c) => `<option value="${c}">${CATEGORIES[c].label}</option>`)
    .join("");
}

/* ============================================================
   Event handlers
   ============================================================ */
function setType(type) {
  currentType = type;
  el("btnExpense").classList.toggle("active", type === "expense");
  el("btnIncome").classList.toggle("active", type === "income");
  fillCategories();
}

function handleSubmit(e) {
  e.preventDefault();
  formError.classList.remove("show");

  const title = el("title").value.trim();
  const amount = parseFloat(el("amount").value);
  const date = el("date").value || iso(0);
  const category = categorySelect.value;

  if (!title) return showError("Please enter a description.");
  if (!amount || amount <= 0) return showError("Please enter an amount greater than zero.");

  const txn = {
    id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
    title: title,
    amount: amount,
    type: currentType,
    category: category,
    date: date,
  };

  transactions.unshift(txn);
  render();

  // reset inputs
  el("title").value = "";
  el("amount").value = "";
  el("date").value = iso(0);
  el("title").focus();
}

function showError(msg) {
  formError.textContent = msg;
  formError.classList.add("show");
}

function handleListClick(e) {
  const btn = e.target.closest(".txn-delete");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  transactions = transactions.filter((t) => t.id !== id);
  render();
}

function resetDemo() {
  transactions = SEED.slice();
  render();
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  el("date").value = iso(0);
  fillCategories();
  render();

  // form
  el("txnForm").addEventListener("submit", handleSubmit);
  el("btnExpense").addEventListener("click", () => setType("expense"));
  el("btnIncome").addEventListener("click", () => setType("income"));

  // transaction list (event delegation for delete buttons)
  txnList.addEventListener("click", handleListClick);

  // search
  el("search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderList();
  });

  // filter buttons
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.addEventListener("click", () => {
      currentFilter = b.getAttribute("data-filter");
      document.querySelectorAll(".filter-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderList();
    });
  });

  // reset demo data
  el("resetBtn").addEventListener("click", resetDemo);
}

document.addEventListener("DOMContentLoaded", init);
