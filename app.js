const form = document.querySelector('#lead-form');
const note = document.querySelector('#form-note');
const source = document.querySelector('#lead-source');

const ref = new URLSearchParams(window.location.search).get('ref');
if (ref && /^[a-z0-9-]{1,60}$/i.test(ref)) {
  source.value = ref;
}

document.querySelectorAll('a[href="demo/"]').forEach((link) => {
  link.addEventListener('click', () => {
    const events = JSON.parse(localStorage.getItem('menumint_demo_events') || '[]');
    events.push({ event: 'demo_opened', time: new Date().toISOString() });
    localStorage.setItem('menumint_demo_events', JSON.stringify(events));
  });
});
