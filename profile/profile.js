import { app } from '../src/firebase';
import * as auth from '../src/firebase-auth';

let currentUser;

const loadContents = () => {
  currentUser = auth.refreshContents(app);
  console.log(currentUser);
  const email = currentUser.email;
  const name = currentUser.displayName;
  [document.getElementById('user-email-username').value, document.getElementById('user-email-domain').value] =
    email.split('@');

  document.getElementById('user-display-name').value = name;
  if (!name) document.getElementById('header-display-name').innerHTML = '[No name provided]';
  else document.getElementById('header-display-name').innerHTML = name;
};

const changeDisplayName = async () => {
  if (document.getElementById('user-display-name').value === currentUser.displayName) return;
  await auth.changeDisplayName(app, document.getElementById('user-display-name').value);
  loadContents();
};

const resetPassword = async () => {
  if (
    window.confirm('We will send a Password Reset link to ' + currentUser.email + '\nAre you sure you want to do this?')
  ) {
    if (await auth.authForgotPassword(app, currentUser.email)) window.alert('Password Reset link has been sent.');
  }
};

window.onload = function () {
  auth.checkSignin(app, loadContents);
};

document.getElementById('sign-out-btn').addEventListener('click', async () => {
  await auth.authSignOut(app);
});

document.getElementById('delete-account-btn').addEventListener('click', () => {
  if (window.confirm('Are you sure you want to permanently delete your account?')) {
    auth.authDeleteUser(app);
  }
});

document.getElementById('change-display-name-btn').addEventListener('click', changeDisplayName);
document.getElementById('reset-password-btn').addEventListener('click', resetPassword);
