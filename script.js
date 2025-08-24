let expenses = [];
let totalIn = 0;
let totalOut = 0;

const CategorySelect = document.getElementById("category");
const Amt = document.getElementById("amt");
const Description = document.getElementById("des");
const DateInp = document.getElementById("date");
const cashInBtn = document.getElementById("cashInBtn");
const cashOutBtn = document.getElementById("cashOutBtn");
const expenseTableBody = document.getElementById("expense-table-body");
const totAmtCell = document.getElementById("totAmt");
const clearBtn = document.getElementById("clearBtn");

// Function to update totals
function updateTotals() {
  const netTotal = totalIn - totalOut;
  const netClass = netTotal > 0 ? "text-green-600" : "text-red-600";
  totAmtCell.innerHTML = `
    <div class="flex flex-row justify-between">
      <span class="text-green-600">Cash In: ₹${totalIn}</span>
      <span class="text-red-600">Cash Out: ₹${totalOut}</span>
      <span class="${netClass}">Net: ₹${netTotal}</span>
    </div>
  `;
}

// Add entry function
function addEntry(type) {
  const today = new Date().toISOString().split("T")[0];
  let category = CategorySelect.value || "Other";
  const amount = Number(Amt.value);
  const date = DateInp.value || today;
  const description = Description.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const expense = { category, amount, description, date, type };
  expenses.push(expense);

  if (type === "in") {
    totalIn += amount;
  } else {
    totalOut += amount;
  }
  updateTotals();

  // Create row
  const newRow = expenseTableBody.insertRow();
  newRow.className = "divide-y divide-gray-200 hover:bg-gray-50";

  const categoryCell = newRow.insertCell();
  const amountCell = newRow.insertCell();
  const desCell = newRow.insertCell();
  const dateCell = newRow.insertCell();
  const actionCell = newRow.insertCell();
  actionCell.className = "flex gap-30";

  [categoryCell, amountCell, desCell, dateCell, actionCell].forEach((cell) => {
    cell.className = "px-4 py-3 text-lg bg-[#fbfbff] text-gray-700";
  });

  categoryCell.textContent = expense.category;
  amountCell.textContent = (type === "in" ? "+" : "-") + expense.amount;
  amountCell.classList.add(
    type === "in" ? "text-green-600" : "text-red-600",
    "font-bold"
  );
  desCell.textContent = expense.description;
  dateCell.textContent = expense.date;

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className =
    "bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transform transition duration-200 hover:scale-105";

  editBtn.addEventListener("click", function () {
    // Fill inputs with current values
    CategorySelect.value = expense.category;
    Amt.value = expense.amount;
    Description.value = expense.description;
    DateInp.value = expense.date;

    // Remove from table and totals until re-added
    expenses.splice(expenses.indexOf(expense), 1);
    if (expense.type === "in") {
      totalIn -= expense.amount;
    } else {
      totalOut -= expense.amount;
    }
    updateTotals();
    expenseTableBody.removeChild(newRow);
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className =
    "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transform transition duration-200 hover:scale-105";

  deleteBtn.addEventListener("click", function () {
    expenses.splice(expenses.indexOf(expense), 1);
    if (expense.type === "in") {
      totalIn -= expense.amount;
    } else {
      totalOut -= expense.amount;
    }
    updateTotals();
    expenseTableBody.removeChild(newRow);
  });

  actionCell.appendChild(editBtn);
  actionCell.appendChild(deleteBtn);

  // Clear inputs after adding
  Amt.value = "";
  Description.value = "";
  DateInp.value = today;
  CategorySelect.value = "";
}

// Event listeners
cashInBtn.addEventListener("click", () => addEntry("in"));
cashOutBtn.addEventListener("click", () => addEntry("out"));

clearBtn.addEventListener("click", function () {
  expenses = [];
  totalIn = 0;
  totalOut = 0;
  updateTotals();

  while (expenseTableBody.firstChild) {
    expenseTableBody.removeChild(expenseTableBody.firstChild);
  }
});

// Initialize totals
updateTotals();
