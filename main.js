let cart = document.querySelectorAll(".add-to-cart");

let icecreams = [
  {
    flavour: "Vanilla",
    tag: "vanilla",
    price: 1,
    inCart: 0
  },
  {
    flavour: "Chocolate",
    tag: "chocolate",
    price: 2,
    inCart: 0
  },
  {
    flavour: "Strawberry",
    tag: "strawberry",
    price: 1,
    inCart: 0
  },
  {
    flavour: "Coffee",
    tag: "coffee",
    price: 2,
    inCart: 0
  },
  {
    flavour: "Mint chocolate chip",
    tag: "mintchocolatechip",
    price: 3,
    inCart: 0
  },
  {
    flavour: "Cookies and Cream",
    tag: "cookiesandcream",
    price: 3,
    inCart: 0
  }
];

for (let i = 0; i < cart.length; i++) {
  cart[i].addEventListener("click", () => {
    cartNumbers(icecreams[i]);
    totalCost(icecreams[i]);
  });
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}

function cartNumbers(icecreams, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem("icecreamsInCart");
  cartItems = JSON.parse(cartItems);

  if (action == "decrease") {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart span").textContent = productNumbers - 1;
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }
  setItems(icecreams);
}

function setItems(icecreams) {
  let cartItems = localStorage.getItem("icecreamsInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems !== null) {
    if (cartItems[icecreams.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [icecreams.tag]: icecreams
      };
    }
    cartItems[icecreams.tag].inCart += 1;
  } else {
    icecreams.inCart = 1;

    cartItems = {
      [icecreams.tag]: icecreams
    };
  }

  localStorage.setItem("icecreamsInCart", JSON.stringify(cartItems));
}

function totalCost(icecreams, action) {
  let cartCost = localStorage.getItem("totalCost");

  if (action == "decrease") {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost - icecreams.price);
  } else if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + icecreams.price);
  } else {
    localStorage.setItem("totalCost", icecreams.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("icecreamsInCart");
  cartItems = JSON.parse(cartItems);
  let productsContainer = document.querySelector(".products");

  let cartCost = localStorage.getItem("totalCost");

  console.log(cartItems);

  if (cartItems && productsContainer) {
    productsContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productsContainer.innerHTML += `
    <div class="product">
   <ion-icon name="close-circle-outline"></ion-icon>
   <img src="images/${item.tag}.jpg">
  <span class="item-flavour">${item.flavour}</span>
  </div>


  <div class="price">£${item.price}.00</div>
    
    <div class="quantity">
    <ion-icon class="decrease" name="arrow-dropleft-circle"></ion-icon>
      <span>${item.inCart}</span>
      <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>
      </div>
    `;
    });

    productsContainer.innerHTML += `
  <div class="cartTotalContainer">
  <h4 class="cartTotalTitle">Total</h4>
  <h4 class="cartTotal">£${cartCost}.00</h4>
  `;
  }

  deleteButtons();
  manageQuantity();
}

function deleteButtons() {
  let deleteButtons = document.querySelectorAll(".product ion-icon");
  let productName;
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartItems = localStorage.getItem("icecreamsInCart");
  cartItems = JSON.parse(cartItems);
  let cartCost = localStorage.getItem("totalCost");

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      productName = deleteButtons[i].parentElement.textContent
        .trim()
        .toLowerCase()
        .replace(/ /g, "");
      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );

      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem("icecreamsInCart", JSON.stringify(cartItems));

      displayCart();
      onLoadCartNumbers();
    });
  }
}

function manageQuantity() {
  let decreaseButtons = document.querySelectorAll(".decrease");
  let increaseButtons = document.querySelectorAll(".increase");
  let cartItems = localStorage.getItem("icecreamsInCart");
  let currentQuantity = 0;

  cartItems = JSON.parse(cartItems);

  for (let i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener("click", () => {
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;

      currentProduct = decreaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector("span")
        .textContent.toLowerCase()
        .trim()
        .replace(/ /g, "");

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbers(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("icecreamsInCart", JSON.stringify(cartItems));
        displayCart();
      }
    });
  }

  for (let i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener("click", () => {
      currentQuantity = increaseButtons[i].parentElement.querySelector("span")
        .textContent;

      currentProduct = increaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector("span")
        .textContent.toLowerCase()
        .trim()
        .replace(/ /g, "");

      cartItems[currentProduct].inCart += 1;
      cartNumbers(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("icecreamsInCart", JSON.stringify(cartItems));
      displayCart();
    });
  }
}

onLoadCartNumbers();
displayCart();