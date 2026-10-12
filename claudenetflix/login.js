// /* ============ DEMO AUTH (browser localStorage) ============
//    This is for the college demo only. Passwords are stored in the browser, which is NOT secure.
//    For real authentication, replace signIn() and signUp() below with Firebase Auth calls. */

// const $ = s => document.querySelector(s);
// const store = (k, v) => { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} };
// const read = k => { try { return localStorage.getItem(k); } catch { return null; } };

// const getUsers = () => { try { return JSON.parse(read('users')) || {}; } catch { return {}; } };
// if (!Object.keys(getUsers()).length) store('users', JSON.stringify({ 'demo@example.com': 'demo1234' })); // starter account

// let mode = 'signin';

// /* Background mosaic */
// const bg = $('#bg');
// for (let i = 0; i < 48; i++) {
//   const t = document.createElement('i');
//   const h = (i * 47) % 360;
//   t.style.background = `linear-gradient(160deg,hsl(${h},55%,30%),hsl(${h + 30},50%,10%))`;
//   bg.appendChild(t);
// }

// /* Validation */
// const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
// const isPhone = v => /^\+?[0-9\s-]{7,15}$/.test(v);

// function setErr(field, errEl, msg) {
//   $(field).classList.toggle('bad', !!msg);
//   $(errEl).textContent = msg || '';
// }
// function validate() {
//   const e = $('#email').value.trim(), p = $('#pass').value;
//   const eOk = isEmail(e) || isPhone(e);
//   const pOk = p.length >= 4 && p.length <= 60;
//   setErr('#emailField', '#emailErr', eOk ? '' : 'Please enter a valid email or phone number.');
//   setErr('#passField', '#passErr', pOk ? '' : 'Your password must contain between 4 and 60 characters.');
//   return eOk && pOk;
// }
// function showAlert(msg) { const a = $('#alert'); a.textContent = msg; a.hidden = !msg; }
// function toast(msg) {
//   const t = $('#toast'); t.textContent = msg; t.hidden = false;
//   clearTimeout(toast.id); toast.id = setTimeout(() => t.hidden = true, 2800);
// }

// /* Auth actions (swap these for Firebase later) */
// function signIn(id, pass) {
//   const users = getUsers();
//   if (!(id in users)) return 'Sorry, we can\'t find an account with this email or number. Please try again or create a new account.';
//   if (users[id] !== pass) return 'Incorrect password. Please try again or you can reset your password.';
//   return null;
// }
// function signUp(id, pass) {
//   const users = getUsers();
//   if (id in users) return 'An account with this email or number already exists. Try signing in instead.';
//   users[id] = pass; store('users', JSON.stringify(users));
//   return null;
// }

// /* Form submit */
// $('#form').addEventListener('submit', e => {
//   e.preventDefault();
//   showAlert('');
//   if (!validate()) return;
//   const id = $('#email').value.trim().toLowerCase(), pass = $('#pass').value;
//   const btn = $('#submit'); btn.disabled = true;
//   setTimeout(() => {                                   // small delay to feel like a real request
//     const error = mode === 'signin' ? signIn(id, pass) : signUp(id, pass);
//     if (error) { showAlert(error); btn.disabled = false; return; }
//     const session = JSON.stringify({ user: id, at: Date.now() });
//     if ($('#remember').checked) store('session', session);
//     else { try { sessionStorage.setItem('session', session); } catch {} }
//     location.href = 'index.html';
//   }, 600);
// });

// /* Live feedback: clear errors as the user fixes the field */
// ['#email', '#pass'].forEach(s => $(s).addEventListener('input', () => {
//   showAlert('');
//   if ($(s === '#email' ? '#emailField' : '#passField').classList.contains('bad')) validate();
// }));

// /* Show / hide password */
// $('#show').onclick = () => {
//   const p = $('#pass'), hidden = p.type === 'password';
//   p.type = hidden ? 'text' : 'password';
//   $('#show').textContent = hidden ? 'HIDE' : 'SHOW';
// };

// /* Toggle between Sign In and Sign Up */
// $('#switch').addEventListener('click', e => {
//   e.preventDefault();
//   mode = mode === 'signin' ? 'signup' : 'signin';
//   const up = mode === 'signup';
//   $('#title').textContent = up ? 'Sign Up' : 'Sign In';
//   $('#submit').textContent = up ? 'Create Account' : 'Sign In';
//   $('#switchText').textContent = up ? 'Already have an account?' : 'New to Netflix?';
//   $('#switch').textContent = up ? 'Sign in now.' : 'Sign up now.';
//   $('#pass').autocomplete = up ? 'new-password' : 'current-password';
//   document.querySelectorAll('.or,.code,.forgot').forEach(el => el.hidden = up);
//   showAlert(''); setErr('#emailField', '#emailErr', ''); setErr('#passField', '#passErr', '');
// });

// $('#code').onclick = () => toast('Sign-in codes need an SMS/email service. Not available in this demo.');
// $('#forgot').onclick = e => { e.preventDefault(); toast('Password reset needs a backend. Try Firebase Auth.'); };

// /* Coming from the landing page "Get Started" form? Open Sign Up with the email pre-filled */
// const qs = new URLSearchParams(location.search);
// if (qs.get('mode') === 'signup') $('#switch').click();
// if (qs.get('email')) { $('#email').value = qs.get('email'); $('#pass').focus(); }

// /* Already signed in? Skip the login page */
// if (read('session')) location.replace('index.html');
