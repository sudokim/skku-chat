import { app } from '../src/firebase';
import * as auth from '../src/firebase-auth';

const login = () => {
  const signinBtn = document.getElementById('signin-btn');
  signinBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Signing in`;
  const log = document.querySelector('.login-message');
  log.innerHTML = '';
  auth
    .authSignIn(
      app,
      document.getElementById('signin-email').value,
      document.getElementById('signin-pw').value
    )
    .then((resolve) => {
      if (!resolve) {
        log.innerHTML = 'Either email address or username is wrong.';
      } else {
        document.location.href = '../profile/profile.html';
      }
      signinBtn.innerHTML = 'Sign in';
    });
};
const signup = () => {
  const username = document.getElementById('username').value;
  const domain = document.getElementById('domain').value;
  const email = username + '@' + domain;
  console.log(email);
  auth.authSignUp(app, email, document.getElementById('signup-pw').value);
};
document.getElementById('signin-btn').addEventListener('click', login);

document.getElementById('signup-btn').addEventListener('click', signup);
