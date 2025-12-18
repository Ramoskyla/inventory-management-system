let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
const table = document.getElementById("inventoryTable");
const form = document.getElementById("itemForm");

// Add Item
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const item = {
    name: document.getElementById("name").value,
    quantity: document.getElementById("quantity").value,
    category: document.getElementById("category").value
  };

  inventory.push(item);
  saveAndRender();
  form.reset();
});

// Render Inventory Table
function renderInventory() {
  table.innerHTML = "";

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.category}</td>
      <td class="actions">
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
}

// Delete Item
function deleteItem(index) {
  inventory.splice(index, 1);
  saveAndRender();
}

// Edit Item Inline
function editItem(index) {
  const item = inventory[index];
  const row = table.rows[index];

  row.innerHTML = `
    <td><input type="text" id="editName" value="${item.name}"></td>
    <td><input type="number" id="editQuantity" value="${item.quantity}"></td>
    <td><input type="text" id="editCategory" value="${item.category}"></td>
    <td>
      <button onclick="saveEdit(${index})">Save Changes</button>
      <button onclick="cancelEdit()">Cancel</button>
    </td>
  `;
}

// Save Edited Item
function saveEdit(index) {
  const editedName = document.getElementById("editName").value;
  const editedQty = document.getElementById("editQuantity").value;
  const editedCategory = document.getElementById("editCategory").value;

  inventory[index] = {
    name: editedName,
    quantity: editedQty,
    category: editedCategory
  };

  saveAndRender();
}

// Cancel Edit
function cancelEdit() {
  renderInventory();
}

// Save to localStorage and render
function saveAndRender() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  renderInventory();
}

// Initial render
renderInventory();
