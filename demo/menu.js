const cart = new Map();
const cartBar = document.querySelector('#cart-bar');
const cartCount = document.querySelector('#cart-count');
const cartTotal = document.querySelector('#cart-total');
const sheetTotal = document.querySelector('#sheet-total');
const cartItems = document.querySelector('#cart-items');
const sheet = document.querySelector('#cart-sheet');

function money(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function render() {
  let count = 0;
  let total = 0;
  cart.forEach(item => { count += item.qty; total += item.price * item.qty; });

  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  sheetTotal.textContent = money(total);
  cartBar.hidden = count === 0;

  if (!count) {
    cartItems.innerHTML = '<p class="empty-cart">Your order is empty. Add something delicious from the menu.</p>';
    return;
  }

  cartItems.innerHTML = [...cart.values()].map(item => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><span>${money(item.price)} each</span></div>
      <div class="qty"><button type="button" data-action="minus" data-name="${item.name}">−</button><b>${item.qty}</b><button type="button" data-action="plus" data-name="${item.name}">+</button></div>
    </div>`).join('');
}

function add(name, price) {
  const existing = cart.get(name);
  cart.set(name, { name, price, qty: existing ? existing.qty + 1 : 1 });
  render();
  updateAddButtons();
}

function updateAddButtons() {
  document.querySelectorAll('.menu-card').forEach(card => {
    const button = card.querySelector('.add-btn');
    const item = cart.get(card.dataset.name);
    if (!button) return;
    if (item) {
      button.textContent = 'Added ' + item.qty + ' ✓';
      button.classList.add('added');
    } else {
      button.textContent = 'Add';
      button.classList.remove('added');
    }
  });
}

document.querySelectorAll('.add-btn').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.menu-card');
    add(card.dataset.name, Number(card.dataset.price));
    button.textContent = 'Added ✓'; button.classList.add('added');
    updateAddButtons();
  });
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = cart.get(button.dataset.name);
  if (!item) return;
  item.qty += button.dataset.action === 'plus' ? 1 : -1;
  if (item.qty <= 0) cart.delete(item.name);
  render();
  updateAddButtons();
});

function openCart() {
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');
}
function closeCart() {
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('locked');
}

document.querySelector('#view-cart').addEventListener('click', openCart);
document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('#close-cart-button').addEventListener('click', closeCart);

document.querySelector('#order').addEventListener('click', () => {
  if (!cart.size) return;
  const lines = [...cart.values()].map(item => `• ${item.name} × ${item.qty} — ${money(item.price * item.qty)}`);
  const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = [
    'Hi The Corner Table! I would like to place an order.',
    '',
    ...lines,
    '',
    `Total: ${money(total)}`,
    '',
    'Please confirm my order.'
  ].join('\n');
  window.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
});

document.querySelectorAll('.categories a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.categories a').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

render();