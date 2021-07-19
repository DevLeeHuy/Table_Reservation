// var starters = JSON.parse(
//   "[" +
//     '{ "type":"separator", "description":"APPETIZERS" },' +
//     '{ "type":"food", "name":"CAESAR`S SALAD", "description":"Lettuce with fried baconstrips, croûtons, Grana Padano, egg and Caesar Dressing", "price":"16.00" } ]'
// );
// var mains = JSON.parse(
//   "[" +
//     '{ "type":"separator", "description":"PIZZA" },' +
//     '{ "type":"food", "name":"MARGHERITA", "description":"Tomato sauce, mozzarella, organic oregano", "price":"18.00" },' +
//     '{ "type":"food", "name":"PROSCIUTTO", "description":"Tomato sauce, mozzarella, ham, organic oregano", "price":"21.50" },' +
//     '{ "type":"food", "name":"RAVIOLI", "description":"filled with truffle-ricotta and hazelnuts butter", "price":"28.50" } ]'
// );
// var desserts = JSON.parse(
//   "[" +
//     '{ "type":"separator", "description":"SWEETS" },' +
//     '{ "type":"food", "name":"FRUIT SALAD", "description":"exotic fruits with tapioca pearls mango sorbet and homemade coconut liqueur", "price":"10.50" } ]'
// );
// var drinks = JSON.parse(
//   "[" +
//     '{ "type":"separator", "description":"WATER & SODA" },' +
//     '{ "type":"drink", "name":"SPARKLING WATER", "description":"5dl", "price":"4.50" },' +
//     '{ "type":"drink", "name":"TEA", "description":"", "price":"5.00" } ]'
// );
var menu = {};
if (document.querySelector("textarea").value !== "") {
  menu = JSON.parse(document.querySelector("textarea").value);
}
var starters = menu["starters"] === undefined ? [] : menu["starters"];
var mains = menu["mains"] === undefined ? [] : menu["mains"];
var desserts = menu["desserts"] === undefined ? [] : menu["desserts"];
var drinks = menu["drinks"] === undefined ? [] : menu["drinks"];
/////////////////////////////////////////////////////////////////
let sl = 0;

let startersbutton = document.getElementById("startersbutton");
let mainsbutton = document.getElementById("mainsbutton");
let dessertsbutton = document.getElementById("dessertsbutton");
let drinksbutton = document.getElementById("drinksbutton");

let ni1 = document.getElementById("ni1");
let ni2 = document.getElementById("ni2");
let ni3 = document.getElementById("ni3");
let ni4 = document.getElementById("ni4");

startersbutton.addEventListener("click", (e) => {
  setIndicator(0);
  populateItems(starters);
});
mainsbutton.addEventListener("click", (e) => {
  setIndicator(1);
  populateItems(mains);
});
dessertsbutton.addEventListener("click", (e) => {
  setIndicator(2);
  populateItems(desserts);
});
drinksbutton.addEventListener("click", (e) => {
  setIndicator(3);
  populateItems(drinks);
});

function populateItems(items) {
  let menu = document.querySelector(".menu");
  menu.innerHTML = "";
  for (i = 0; i < items.length; i++) {
    if (items[i].type === "separator") {
      let menuitem = document.createElement("div");
      menuitem.setAttribute("class", "menu-separator");
      menuitem.innerHTML = items[i].description;
      menu.appendChild(menuitem);
    }
    if (items[i].type === "food") {
      let menuitem = document.createElement("div");
      let menuitemname = document.createElement("div");
      let menuitemdesc = document.createElement("div");
      menuitem.setAttribute("class", "menu-item");
      menuitemname.setAttribute("class", "menu-item-name");
      menuitemdesc.setAttribute("class", "menu-item-description");

      menuitemname.innerHTML = items[i].name;
      menuitemdesc.innerHTML = items[i].description;

      menuitem.appendChild(menuitemname);
      menuitem.appendChild(menuitemdesc);
      addDeleteBtn(menuitem);
      menu.appendChild(menuitem);
    }
    if (items[i].type === "drink") {
      let drinkitem = document.createElement("div");
      let drinkitemname = document.createElement("div");
      let drinkitemdesc = document.createElement("div");
      drinkitem.setAttribute("class", "drink-item");
      drinkitemname.setAttribute("class", "drink-item-name");
      drinkitemdesc.setAttribute("class", "drink-item-description");

      drinkitemname.innerHTML = items[i].name;
      drinkitemdesc.innerHTML = items[i].description;

      drinkitem.appendChild(drinkitemname);
      drinkitem.appendChild(drinkitemdesc);
      addDeleteBtn(drinkitem);
      menu.appendChild(drinkitem);
    }
  }
  removeItem();
}
function setIndicator(sel) {
  sl = sel;
  let vp = "";
  if (window.innerWidth < 800) {
    vp = "60px";
  } else {
    vp = "85%";
  }
  let elems = [ni1, ni2, ni3, ni4];
  for (i = 0; i < elems.length; i++) {
    if (i === sel) {
      elems[i].style.width = vp;
      elems[i].style.boxShadow =
        "2px 2px 10px 2px var(--icolor" + (i + 1) + ")";
    } else {
      elems[i].style.width = "0";
      elems[i].style.boxShadow = "none";
    }
  }
}

window.addEventListener("resize", (e) => {
  setIndicator(sl);
});

//default runs
setIndicator(sl);
populateItems(starters);

//edit menu
document.getElementById("add-btn").addEventListener("click", () => {
  let type = document.getElementById("type").value;
  let name = document.getElementById("name").value;
  let description = document.getElementById("description").value;
  var menuItem = {
    type: type === "drink" ? "drink" : "food",
    name,
    description,
  };
  switch (type) {
    case "starter":
      starters.push(menuItem);
      populateItems(starters);
      break;
    case "main":
      mains.push(menuItem);
      populateItems(mains);
      break;
    case "drink":
      drinks.push(menuItem);
      populateItems(drinks);
      break;
    case "desert":
      desserts.push(menuItem);
      populateItems(desserts);
      break;
    default:
      break;
  }
});

document.querySelector(".saveForm").onsubmit = () => {
  saveData();
  return true;
};

function addDeleteBtn(ele) {
  if (document.querySelector("#role") === null)
    ele.innerHTML =
      ele.innerHTML +
      `<button class="btn btn-primary remove-btn" ><i class="fas fa-window-close"></i></button>`;
}

function removeItem() {
  var removeBtns = document.querySelectorAll(".remove-btn");
  removeBtns.forEach((e) => {
    e.addEventListener("click", () => {
      let item = e.parentElement;
      item.remove();
      let DishName =
        item.querySelector(".menu-item-name") === null
          ? item.querySelector(".drink-item-name").innerText
          : item.querySelector(".menu-item-name").innerText;
      starters = starters.filter((item) => item.name !== DishName);
      mains = mains.filter((item) => item.name !== DishName);
      desserts = desserts.filter((item) => item.name !== DishName);
      drinks = drinks.filter((item) => item.name !== DishName);
      console.log(drinks);
    });
  });
}

function saveData() {
  let data = {
    starters: starters,
    mains: mains,
    desserts: desserts,
    drinks: drinks,
  };
  document.getElementById("MenuData").value = JSON.stringify(data);
}
