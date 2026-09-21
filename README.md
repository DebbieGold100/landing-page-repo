# 💸 Spendly — Expense Tracker

A simple, responsive **frontend expense tracker** that organizes and displays financial records
clearly. Add income and expense transactions, watch your balance update in real time, and see
where your money goes with a visual spending breakdown. All data is saved in your browser using
`localStorage`, so it stays even after you refresh.

Built with plain **HTML, CSS and JavaScript** — no frameworks, no build tools.

> Featured project by **Deborah Gold** · Frontend Developer

---

## ✨ Features

- ➕ **Add transactions** — income or expense, with description, amount, date and category
- 💰 **Live summary cards** — Total Balance, Income and Expenses update instantly
- 📊 **Spending breakdown** — a donut chart (pure CSS `conic-gradient`) with a category legend
- 🔍 **Search** transactions by name or category
- 🗂️ **Filter** by All / Income / Expense
- 🗑️ **Delete** any transaction
- 💾 **Saves automatically** to your browser (`localStorage`)
- 🔄 **Reset demo data** button
- 📱 **Fully responsive** — works on desktop, tablet and mobile

---

## 📁 Project structure

```
expense-tracker/
├── index.html      # Page structure
├── style.css       # All styling (brand purple theme)
├── script.js       # App logic (add, delete, filter, chart, storage)
└── README.md       # This file
```

---

## 🚀 How to run it

No installation needed. Just:

1. Download or clone this folder.
2. Open **`index.html`** in any web browser.

That's it! 🎉

> 💡 Tip: In VS Code, install the **Live Server** extension, right-click `index.html`,
> and choose **"Open with Live Server"** for auto-refresh while you edit.

---

## 📤 How to push this to GitHub

Open a terminal inside the `expense-tracker` folder and run:

```bash
git init
git add .
git commit -m "Add Spendly expense tracker"
git branch -M main
git remote add origin https://github.com/DebbieGold100/expense-tracker.git
git push -u origin main
```

> First create an empty repository called **`expense-tracker`** on GitHub
> (without a README), then run the commands above.

### Want a live link? (GitHub Pages)

After pushing:

1. Go to your repo → **Settings** → **Pages**
2. Under **Branch**, choose `main` and `/root`, then **Save**
3. Your app goes live at:
   `https://DebbieGold100.github.io/expense-tracker/`

You can then paste that link back into your portfolio's **"View Project"** button. 🔗

---

## 🎨 Brand colors used

| Purpose        | Color     |
| -------------- | --------- |
| Primary Purple | `#7C3AED` |
| Deep Purple    | `#4C1D95` |
| Dark Background| `#0B0714` |
| Card Surface   | `#140D24` |
| Income (green) | `#34D399` |
| Expense (red)  | `#FB7185` |

---

## 🛠️ Built with

- HTML5
- CSS3
- JavaScript (ES6)

---

## 📄 License

Free to use and modify. Made with 💜 by Deborah Gold.

