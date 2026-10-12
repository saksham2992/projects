// 1. Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', function () {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});
nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});

// 2. Filter species by conservation status
const filterButtons = document.querySelectorAll('.filters button');
const cards = document.querySelectorAll('#speciesGrid .card');

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(function (card) {
      const show = filter === 'all' || card.dataset.status === filter;
      card.classList.toggle('hide', !show);
    });
  });
});

// 3. Depth gauge: shows a depth from 0 to 4,000 m as you scroll
const depth = document.getElementById('depth');
function updateDepth() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  depth.textContent = Math.round(progress * 4000).toLocaleString('en-US');
}
window.addEventListener('scroll', updateDepth);
window.addEventListener('resize', updateDepth);
updateDepth();

// 4. Pledge form: validate, then print the submitted information
const form = document.getElementById('pledgeForm');
const result = document.getElementById('result');
const formError = document.getElementById('formError');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = form.elements['Name'].value.trim();
  const email = form.elements['Email'].value.trim();
  const city = form.elements['City'].value.trim();
  const interest = form.elements['Interest'].value;
  const message = form.elements['Message'].value.trim();

  // Basic validation
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (name.length < 2 || !emailOk || city === '' || interest === '') {
    formError.textContent = 'Please enter your name, a valid email, your city and one area to help with.';
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  // Build the output with textContent so typed text is never run as HTML
  result.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'Thank you, ' + name + '! Your pledge is recorded.';
  const intro = document.createElement('p');
  intro.textContent = 'Here is the information you submitted:';
  const list = document.createElement('dl');

  const details = [
    ['Name', name],
    ['Email', email],
    ['City', city],
    ['Helping with', interest],
    ['Message', message || 'No message']
  ];
  details.forEach(function (item) {
    const dt = document.createElement('dt');
    dt.textContent = item[0];
    const dd = document.createElement('dd');
    dd.textContent = item[1];
    list.appendChild(dt);
    list.appendChild(dd);
  });

  result.appendChild(title);
  result.appendChild(intro);
  result.appendChild(list);
  result.hidden = false;
  result.focus();
  form.reset();
});

// 5. Footer year
document.getElementById('year').textContent = new Date().getFullYear();
