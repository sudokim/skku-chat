import { app } from '../src/firebase';
import * as auth from '../src/firebase-auth';

const login = () => {
  const signinBtn = document.getElementById('signin-btn');
  signinBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Signing in`;
  const log = document.querySelector('.login-message');
  log.innerHTML = '';
  auth
    .authSignIn(app, document.getElementById('signin-email').value, document.getElementById('signin-pw').value)
    .then((resolve) => {
      if (!resolve) {
        log.innerHTML = 'Either email address or username is wrong.';
      } else {
        document.location.href = '../chats/chats.html';
      }
      signinBtn.innerHTML = 'Sign in';
    })
    .catch(alert);
};
const signup = () => {
  const username = document.getElementById('username').value;
  const domain = document.getElementById('domain').value;
  const email = username + '@' + domain;

  auth
    .authSignUp(
      app,
      email,
      document.getElementById('signup-pw').value,
      document.getElementById('signup-name').value,
      document.getElementById('signup-id').value
    )
    .then((uc) => {
      document.location.href = '../profile/profile.html';
    })
    .catch(alert);
};

const forgotPassword = async () => {
  const username = document.getElementById('forgot-password-username').value;
  const domain = document.getElementById('forgot-password-domain').value;
  const forgotMessage = document.getElementById('forgot-password-message');
  if (!username || !domain) {
    forgotMessage.innerHTML = 'Please enter a valid email address.';
    return;
  }
  const email = username + '@' + domain;
  auth.authForgotPassword(app, email).then((resolve) => {
    if (!resolve) {
      forgotMessage.innerHTML = "This email doesn't exist.";
    } else {
      document.querySelector('.sent-message').innerHTML = 'Password reset link sent.';
    }
  });
};

const clearForgotMessage = () => {
  const forgotMessage = document.getElementById('forgot-password-message');
  forgotMessage.innerHTML = '';
};

document.getElementById('signin-btn').addEventListener('click', login);

document.getElementById('signup-btn').addEventListener('click', signup);

document.getElementById('forgot-password-btn').addEventListener('click', forgotPassword);

document.getElementById('forgot-password-username').addEventListener('input', clearForgotMessage);
document.getElementById('forgot-password-domain').addEventListener('change', clearForgotMessage);
