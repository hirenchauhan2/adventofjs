const menuItems = [
  {
    id: 1,
    name: 'French Fries with Ketchup',
    price: 223,
    image: 'plate__french-fries.png',
    alt: 'French Fries',
    count: 0,
  },
  {
    id: 2,
    name: 'Salmon and Vegetables',
    price: 512,
    image: 'plate__salmon-vegetables.png',
    alt: 'Salmon and Vegetables',
    count: 0,
  },
  {
    id: 3,
    name: 'Spaghetti Meat Sauce',
    price: 782,
    image: 'plate__spaghetti-meat-sauce.png',
    alt: 'Spaghetti with Meat Sauce',
    count: 0,
  },
  {
    id: 4,
    name: 'Bacon, Eggs, and Toast',
    price: 599,
    image: 'plate__bacon-eggs.png',
    alt: 'Bacon, Eggs, and Toast',
    count: 0,
  },
  {
    id: 5,
    name: 'Chicken Salad with Parmesan',
    price: 698,
    image: 'plate__chicken-salad.png',
    alt: 'Chicken Salad with Parmesan',
    count: 0,
  },
  {
    id: 6,
    name: 'Fish Sticks and Fries',
    price: 634,
    image: 'plate__fish-sticks-fries.png',
    alt: 'Fish Sticks and Fries',
    count: 0,
  },
];

// much simpler way to store cart data
const cartItems = {};

/**
 * Currency formatting utility to amount in USD format.
 * Also, we need to make the price as expected from the give value. e.g. 223 => 2.23
 * hence, we're multiplying price with 0.01; which is equivalent to price / 100
 * @param {number} amount Amount to be formatted in USD
 * @returns {string} amount formatted in USD currency
 */
function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount * 0.01);
}

// check if item is in cart or not
function isItemInCart(itemId) {
  return !!cartItems[itemId];
}

/**
 * Get HTML for list item for menu
 * @param {any} menuItem Menu item
 * @returns {string} HTML string with menu item details
 */
function getMenuListItem(menuItem) {
  const itemInCart = isItemInCart(menuItem.id);
  const itemPrice = formatPrice(menuItem.price);

  const menuItemHTMLli = `
    <div class="plate">
        <img src="images/${menuItem.image}" alt="${menuItem.alt}" class="plate" />
    </div>
    <div class="content">
        <p class="menu-item">${menuItem.name}</p>
        <p class="price">${itemPrice}</p>
        ${
          itemInCart
            ? `
            <button class="in-cart">
                <img src="images/check.svg" alt="Check" />
                In Cart
            </button>
            `
            : `
            <button class="add" onclick="addToCart(${menuItem.id})">
                Add to Cart
            </button>
            `
        }
    </div>
    `;
  return menuItemHTMLli;
}

/**
 * Render the updated menu list.
 */
function renderMenuList() {
  const menuListContainer = document.querySelector('ul.menu');

  // reset list before rendering
  menuListContainer.innerHTML = null;

  menuItems.forEach((menuItem) => {
    const li = document.createElement('li');
    const liContent = getMenuListItem(menuItem);
    li.innerHTML = liContent;

    menuListContainer.appendChild(li);
  });
}

/**
 * Get HTML for cart item for list
 * @param {any} cartItem Cart item
 * @returns {string} HTML content with item details
 */
function getCartListItem(cartItem) {
  const count = cartItems[cartItem.id].count;
  const itemPrice = formatPrice(cartItem.price);
  const itemTotal = formatPrice(count * cartItem.price);
  const cartItemHTML = `
        <div class="plate">
            <img src="images/${cartItem.image}" alt="${cartItem.alt}" class="plate" />
            <div class="quantity">${count}</div>
          </div>
        <div class="content">
            <p class="menu-item">${cartItem.name}s</p>
            <p class="price">${itemPrice}</p>
        </div>
        <div class="quantity__wrapper">
            <button class="decrease" onclick="onDecreaseQuantityClick(${cartItem.id})">
              <img src="images/chevron.svg" />
            </button>
            <div class="quantity">${count}</div>
            <button class="increase" onclick="onIncreaseQuantityClick(${cartItem.id})">
              <img src="images/chevron.svg" />
            </button>
        </div>
        <div class="subtotal">
            ${itemTotal}
        </div>
    `;

  return cartItemHTML;
}

/**
 * Render updated cart information
 */
function renderCart() {
  const cartItemsList = Object.values(cartItems);

  const cartPanel = document.querySelector('.panel.cart');
  const cartSummaryContainer = cartPanel.querySelector('ul.cart-summary');

  if (cartItemsList.length === 0) {
    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.classList.add('empty');
    emptyCartMessage.innerText = `Your cart is empty.`;

    cartPanel.insertBefore(emptyCartMessage, cartSummaryContainer);
    // clear the cart items list
    cartSummaryContainer.innerHTML = null;
  } else {
    // remove the empty message
    const emptyCartMessage = cartPanel.querySelector('p.empty');
    if (emptyCartMessage) {
      cartPanel.removeChild(emptyCartMessage);
    }
  }

  let subtotal = 0;
  const taxRate = 0.098;

  // reset cart items first
  cartSummaryContainer.innerHTML = null;

  // render cart items
  cartItemsList.forEach((cartItem) => {
    const li = document.createElement('li');
    const itemContent = getCartListItem(cartItem);
    li.innerHTML = itemContent;
    cartSummaryContainer.appendChild(li);

    subtotal += cartItem.count * cartItem.price;
  });

  const taxPrice = subtotal * taxRate;
  const total = subtotal + taxPrice;

  // get billing element for subtotal, tax, total amount
  const amountSubtotalElement = cartPanel.querySelector('.amount.price.subtotal');
  const amountTaxPriceElement = cartPanel.querySelector('.amount.price.tax');
  const amountTotalElement = cartPanel.querySelector('.amount.price.total');

  // render billing amounts
  amountSubtotalElement.textContent = `${formatPrice(subtotal)}`;
  amountTaxPriceElement.textContent = `${formatPrice(taxPrice)}`;
  amountTotalElement.textContent = `${formatPrice(total)}`;
}

/**
 * Increase quantity of a particular item
 * @param {number} itemId Cart item id
 */
function onIncreaseQuantityClick(itemId) {
  const cartItem = cartItems[itemId];
  Object.assign(cartItems, {
    [itemId]: {
      ...cartItem,
      count: cartItem.count + 1,
    },
  });
  // re-render cart
  renderCart();
}

/**
 * Decrease quantity of a particular item
 * @param {number} itemId Cart item id
 */
function onDecreaseQuantityClick(itemId) {
  const cartItem = cartItems[itemId];

  // remove the item if count will go 0 else decrease the count
  if (cartItem.count === 1) {
    delete cartItems[itemId];
    // update menu list
    renderMenuList();
  } else {
    Object.assign(cartItems, {
      [itemId]: {
        ...cartItem,
        count: cartItem.count - 1,
      },
    });
  }

  // re-render cart
  renderCart();
}

/**
 * Add item to cart
 * @param {number} itemId Menu item id
 */
function addToCart(itemId) {
  const menuItem = menuItems.find((item) => item.id === itemId);

  // add count as 1 initially
  Object.assign(cartItems, {
    [itemId]: {
      ...menuItem,
      count: 1,
    },
  });

  // render updated menu and cart
  renderMenuList();
  renderCart();
}

// load menu items initially
renderMenuList();

// load cart items initially
renderCart();
