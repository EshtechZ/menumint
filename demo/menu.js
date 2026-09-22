document.querySelector('#order').addEventListener('click', () => {
  const message = encodeURIComponent('Hi The Corner Table! I would like to place an order.');
  window.location.href = `https://wa.me/?text=${message}`;
});
