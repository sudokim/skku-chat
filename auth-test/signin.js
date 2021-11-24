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
        document.location.href = '../profile/profile.html';
      }
      signinBtn.innerHTML = 'Sign in';
    });
};
const signup = () => {
  const username = document.getElementById('username').value;
  const domain = document.getElementById('domain').value;
  const email = username + '@' + domain;

  auth.authSignUp(app, email, document.getElementById('signup-pw').value);
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
      document.querySelector('.sent-message').innerHTML = 'Password reset link has been sent.';
    }
  });
};

const clearForgotMessage = () => {
  const forgotMessage = document.getElementById('forgot-password-message');
  forgotMessage.innerHTML = '';
};

const clearPWlessMessage = () => {
  const PWlessMessage = document.getElementById('passwordless-message');
  const PWlessSentMessage = document.getElementById('passwordless-sent-message');

  PWlessMessage.innerHTML = '';
  PWlessSentMessage.innerHTML = '';
};

const pwlessSignIn = async () => {
  const username = document.getElementById('passwordless-username').value;
  const domain = document.getElementById('passwordless-domain').value;
  const pwlessMessage = document.getElementById('passwordless-message');
  const PWlessSentMessage = document.getElementById('passwordless-sent-message');
  if (!username || !domain) {
    pwlessMessage.innerHTML = 'Please enter a valid email address.';
    return;
  }
  const email = username + '@' + domain;
  auth.authPWLessSignIn(app, email).then((resolve) => {
    if (!resolve) {
      pwlessMessage.innerHTML = "This email doesn't exist.";
    } else {
      PWlessSentMessage.innerHTML = 'Sign-in link has been sent.';
    }
  });
};

document.getElementById('signin-btn').addEventListener('click', login);
document.getElementById('signup-btn').addEventListener('click', signup);
document.getElementById('forgot-password-btn').addEventListener('click', forgotPassword);
document.getElementById('forgot-password-username').addEventListener('input', clearForgotMessage);
document.getElementById('forgot-password-domain').addEventListener('change', clearForgotMessage);
document.getElementById('passwordless-btn').addEventListener('click', pwlessSignIn);
document.getElementById('passwordless-username').addEventListener('input', clearPWlessMessage);
document.getElementById('passwordless-domain').addEventListener('change', clearPWlessMessage);
