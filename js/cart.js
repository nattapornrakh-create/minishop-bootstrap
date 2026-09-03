let myCart = JSON.parse(localStorage.getItem('minishop_cart')) || [];
// addToCartFromCard(button)
// - Convenience helper used by product "Add to cart" buttons.
// - It receives the clicked button element, finds the nearest `.card-body .product-item`,
//   reads the product name and price from data attributes, validates them, and forwards
//   the values to addToCart(name, price).
function addToCartFromCard(btn) {
  // Use closest() to scope the search so cards can be nested safely.
  let cardBody = btn.closest('.card-body');
  if (!cardBody) {
    // Defensive: if structure changed, avoid JS errors and inform developer.
    console.warn('addToCartFromCard: could not find .card-body ancestor for button', btn);
    return;
  }
  // The .product-item is a tiny hidden element that stores the product metadata.
  let itemContainer = cardBody.querySelector('.product-item');
  if (!itemContainer) {
    console.warn('addToCartFromCard: missing .product-item element in card-body', cardBody);
    return;
  }
  // Read attributes. Attributes are strings so convert price to a number safely.
  let name = itemContainer.getAttribute('data-name') || 'ไม่ระบุชื่อสินค้า';
  // Convert price string to integer (support separators removed earlier in HTML: use plain digits)
  let priceRaw = itemContainer.getAttribute('data-price');
  let price = Number(priceRaw);

  // Validate price is a number; if not, default to 0 and warn for debugging.
  if (Number.isNaN(price)) {
    console.warn('addToCartFromCard: invalid price for product', { name, priceRaw });
    price = 0;
  }

  // Delegate to the core addToCart function which updates state and persistence.
  addToCart(name, price);
}

// addToCart(name, price)
// - Core routine that updates the in-memory cart, persists it to localStorage, and updates UI.
// - Keeps user informed via an alert (useful for learning). In production, consider replacing
//   alert() with a less-disruptive UI notification.
function addToCart(name, price) {
  // Push an object representing the item into the cart array.
  myCart.push({ name, price });

  // Persist updated cart into localStorage. localStorage only stores strings, so stringify.
  localStorage.setItem('minishop_cart', JSON.stringify(myCart));

  // Simple feedback to learner / user. For nicer UX, replace this with a toast component.
  alert('เพิ่ม "' + name + '" ลงตะกร้าแล้ว!');

  // Update any visible badge that shows the cart item count.
  updateBadge();
}

// updateBadge()
// - Finds the element with id 'cartCountBadge' and writes the current cart length into it.
// - Designed to be safe to call on any page — if the badge element is absent, the function
//   simply does nothing (no error thrown).
function updateBadge() {
  // Read the authoritative source (localStorage) so the badge is correct even when
  // other code (for example cart.html's removeFromCart) updates localStorage directly.
  let badge = document.getElementById('cartCountBadge');
  if (!badge) return;

  // Safely parse the cart from localStorage and compute its length.
  let persisted = JSON.parse(localStorage.getItem('minishop_cart')) || [];
  badge.innerText = String(persisted.length);

  // Also sync the in-memory myCart variable with the persisted value so future
  // operations that rely on myCart (e.g., addToCart) stay consistent.
  myCart = persisted;
}

// Ensure the badge is set once DOM is ready. This is important when index.html or cart.html
// loads this file: once the DOM content is available, updateBadge() will write the correct count.
// Using DOMContentLoaded is simple and reliable for this educational example.
document.addEventListener('DOMContentLoaded', updateBadge);

// Expose functions to the global scope explicitly (optional, but makes intent clear in a teaching context).
// In browser globals, function declarations are already globally accessible; the assignments below make that
// explicit so learners can see and call them from the console.
window.addToCartFromCard = addToCartFromCard;
window.addToCart = addToCart;
window.updateBadge = updateBadge;