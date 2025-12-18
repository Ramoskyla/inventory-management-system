let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let editIndex = null;

/* SIDEBAR */
function toggleSidebar(){
  document.getElementById("sidebar").classList.toggle("show");
}

/* REGISTER */
function registerUser(){
  if(!regName.value || !regEmail.value || !regPassword.value){
    alert("Fill all fields");
    return;
  }
  if(users.find(u=>u.email===regEmail.value)){
    alert("Email already exists");
    return;
  }
  users.push({name:regName.value,email:regEmail.value,password:regPassword.value});
  localStorage.setItem("users",JSON.stringify(users));
  alert("Registered successfully!");
}

/* LOGIN */
function loginUser(){
  const user = users.find(
    u=>u.email===loginEmail.value && u.password===loginPassword.value
  );
  if(!user){ alert("Invalid login"); return; }

  currentUser=user;
  localStorage.setItem("currentUser",JSON.stringify(user));

  authSection.style.display="none";
  mainSection.style.display="block";
  profileSidebar.style.display="block";
  profileName.innerText=user.name;
  profileEmail.innerText=user.email;
  updateCounts();
}

/* LOGOUT */
function logoutUser(){
  localStorage.removeItem("currentUser");
  location.reload();
}

/* SECTIONS */
function showSection(id){
  mainSection.style.display="none";
  inventorySection.style.display="none";
  document.getElementById(id).style.display="block";
  toggleSidebar();
}

/* INVENTORY */
function renderInventory(){
  inventoryTable.innerHTML="";
  inventory.forEach((item,i)=>{
    inventoryTable.innerHTML+=`
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.category}</td>
        <td>
          <button onclick="editItem(${i})">Edit</button>
          <button onclick="deleteItem(${i})">Delete</button>
        </td>
      </tr>`;
  });
  updateCounts();
}

function updateCounts(){
  totalItems.innerText = inventory.length;
  lowStockCount.innerText = inventory.filter(i=>i.qty<5).length;
}

function openModal(item=null){
  itemModal.style.display="flex";
  if(item){
    itemName.value=item.name;
    itemQty.value=item.qty;
    itemCategory.value=item.category;
  }else{
    itemName.value=itemQty.value=itemCategory.value="";
  }
}

function closeModal(){
  itemModal.style.display="none";
}

function saveItem(){
  const item={name:itemName.value,qty:+itemQty.value,category:itemCategory.value};
  if(editIndex!==null){
    inventory[editIndex]=item;
    editIndex=null;
  }else{
    inventory.push(item);
  }
  save();
  closeModal();
}

function editItem(i){
  editIndex=i;
  openModal(inventory[i]);
}

function deleteItem(i){
  inventory.splice(i,1);
  save();
}

function save(){
  localStorage.setItem("inventory",JSON.stringify(inventory));
  renderInventory();
}

/* EXPORT */
function exportCSV(){
  let csv="Name,Qty,Category\n";
  inventory.forEach(i=>csv+=`${i.name},${i.qty},${i.category}\n`);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv]));
  a.download="inventory.csv";
  a.click();
}

/* AUTO LOGIN */
if(currentUser){
  authSection.style.display="none";
  mainSection.style.display="block";
  profileSidebar.style.display="block";
  profileName.innerText=currentUser.name;
  profileEmail.innerText=currentUser.email;
  updateCounts();
}
