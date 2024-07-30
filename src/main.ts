const cards = document.querySelector<HTMLDivElement>(".cards");
const cartItemsElement = document.querySelector<HTMLDivElement>(".cart-items");
const totalAmount = document.querySelector<HTMLHeadingElement>(".total-amount");

type Item = {
  id: number;
  imageSrc: string;
  name: string;
  price: number;
  count: number;
};

const shopItems: Item[] = [
  {
    id: 1,
    imageSrc: "/src/assets/1.webp",
    name: "Nike 1",
    price: 100,
    count: 1,
  },
  {
    id: 2,
    imageSrc: "/src/assets/1.webp",
    name: "Nike 2",
    price: 500,
    count: 1,
  },
  {
    id: 3,
    imageSrc: "/src/assets/1.webp",
    name: "Nike 3",
    price: 1500,
    count: 1,
  },
];

const cartItems: Item[] = loadCartItems();
cartItems.forEach(createCartElement);
shopItems.forEach(createshopCardItem);
updateTotalAmount();

function createshopCardItem(item: Item) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  const cardImg = document.createElement("img");
  cardImg.src = item.imageSrc;
  const cardName = document.createElement("h3");
  cardName.textContent = item.name;
  const cardPrice = document.createElement("h4");
  cardPrice.textContent = `${item.price}`;
  const addToCartBtn = document.createElement("button");
  addToCartBtn.className = "add-to-cart-btn";
  addToCartBtn.textContent = "Add to cart";
  addToCartBtn.dataset.id = `${item.id}`;
  addToCartBtn.addEventListener("click", () => {
    addToCart(item.id);
  });
  cardDiv.append(cardImg, cardName, cardPrice, addToCartBtn);
  cards?.append(cardDiv);
}

function saveItem(item: Item, op?: string) {
  const lsCartItems = loadCartItems();
  const existingItemIndex = lsCartItems.findIndex((i) => i.id === item.id);
  if (existingItemIndex !== -1) {
    op === "add"
      ? (lsCartItems[existingItemIndex].count += 1)
      : op === "minus"
      ? (lsCartItems[existingItemIndex].count -= 1)
      : (lsCartItems[existingItemIndex].count = 1);
  } else {
    lsCartItems.push(item);
  }
  localStorage.setItem("CartItems", JSON.stringify(lsCartItems));
  loadCartItems();
}

function findItem(array: Item[], id: number) {
  const itemToAdd = array.find((item) => item.id === id);
  return itemToAdd;
}

function addToCart(id: number) {
  const itemToAdd = findItem(shopItems, id);
  if (itemToAdd) {
    const lsItem = findItem(loadCartItems(), itemToAdd?.id);
    if (lsItem) {
      alert("already exist");
    } else {
      itemToAdd.count = 1;
      saveItem(itemToAdd);
      createCartElement(itemToAdd);
      updateTotalAmount();
    }
  }
}

function removeCartItem(id: number, itemToRemove: HTMLDivElement) {
  let selectedItem = findItem(loadCartItems(), id);
  if (selectedItem) {
    const updateLSArray: Item[] = loadCartItems().filter(
      (item) => item.id !== selectedItem.id
    );
    localStorage.setItem("CartItems", JSON.stringify(updateLSArray));
    cartItemsElement?.removeChild(itemToRemove);
    updateTotalAmount();
  }
}

function createCartElement(item: Item) {
  const cartItemDiv = document.createElement("div");
  cartItemDiv.className = "cart-item";

  const itemImg = document.createElement("img");
  itemImg.className = "cart-item-image";
  itemImg.src = item.imageSrc;
  itemImg.alt = "item-image";

  const itemName = document.createElement("p");
  itemName.className = "cart-item-name";
  itemName.textContent = item.name;

  const itemPrice = document.createElement("p");
  itemPrice.className = "cart-item-price";
  itemPrice.textContent = `${item.price}$`;

  const itemCounter = document.createElement("div");
  itemCounter.className = "cart-item-counter";

  let countNumber: number = item.count;

  const decreaseCountBtn = document.createElement("button");
  decreaseCountBtn.addEventListener("click", () => {
    let selectedItem = findItem(cartItems, item.id);
    if (selectedItem && selectedItem.count > 1) {
      saveItem(selectedItem, "minus");
      countNumber -= 1;
      count.textContent = `${countNumber}`;
      updateTotalAmount();
    }
  });
  decreaseCountBtn.textContent = "-";

  const increaseCountBtn = document.createElement("button");
  increaseCountBtn.addEventListener("click", () => {
    let itemToAdd = findItem(loadCartItems(), item.id);
    if (itemToAdd) {
      saveItem(itemToAdd, "add");
      countNumber += 1;
      count.textContent = `${countNumber}`;
      updateTotalAmount();
    }
  });
  increaseCountBtn.textContent = "+";

  const removeBtn = document.createElement("button");
  removeBtn.addEventListener("click", () => {
    removeCartItem(item.id, cartItemDiv);
  });
  removeBtn.textContent = "Remove";

  const count = document.createElement("p");
  count.textContent = `${item.count}`;

  itemCounter.append(increaseCountBtn, count, decreaseCountBtn, removeBtn);
  cartItemDiv.append(itemImg, itemName, itemPrice, itemCounter);
  cartItemsElement?.append(cartItemDiv);
}

function loadCartItems(): Item[] {
  const cartItemJson = localStorage.getItem("CartItems");
  if (cartItemJson === null) return [];
  return JSON.parse(cartItemJson);
}

function updateTotalAmount() {
  let total = 0;
  loadCartItems().forEach((item) => {
    total += item.price * item.count;
  });
  if (totalAmount) {
    if (total === 0) {
      totalAmount.textContent = "Your cart is empty";
    } else {
      totalAmount.textContent = `Total Amount : ${total.toString()}$`;
    }
  }
}
