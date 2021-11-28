import { app } from '../src/firebase';
import * as auth from '../src/firebase-auth';

// Sign in
function login() {
  const signinBtn = document.getElementById('signin-btn');
  signinBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Signing in';

  const log = document.querySelector('.login-message');
  log.innerHTML = '';

  // Call script
  auth
    .authSignIn(app, document.getElementById('signin-email').value, document.getElementById('signin-pw').value)
    .then((uc) => {
      // Valid email and password
      // Check if the user validated the email
      if (!uc.user.emailVerified) {
        if (
          confirm(
            'You have not verified your email address yet.\nCheck your inbox and click the link from the email to verify your account.\nDo you want to receive the verification email again?'
          )
        ) {
          // Resend email
          auth
            .authSendVerificationEmail(app)
            .then(alert)
            .catch(alert)
            .finally(() => {
              auth
                .authSignOut(app)
                .then(() => document.location.reload())
                .catch(alert);
            });
        } else {
          // Sign out
          auth
            .authSignOut(app)
            .then(() => document.location.reload())
            .catch(alert);
        }
      } else {
        // Valid email
        document.location.href = '../profile/profile.html';
        signinBtn.innerHTML = 'Sign in';
      }

      signinBtn.innerHTML = 'Sign in';
    })
    .catch(alert);
}

// Sign up
function signup() {
  const signupBtn = document.getElementById('signup-btn')
  const username = document.getElementById('username').value;
  const domain = document.getElementById('domain').value;
  const email = username + '@' + domain;

  signupBtn.innerHTML= '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Signing up...'

  auth
    .authSignUp(
      app,
      email,
      document.getElementById('signup-pw').value,
      document.getElementById('signup-name').value,
      document.getElementById('signup-id').value
    )
    .then((uc) => {
      // Verify email
      auth.authSendVerificationEmail(app).then((msg) => {
        alert(msg);
        auth.authSignOut(app).then(() => document.location.reload());
      });
    })
    .catch(alert);

  signupBtn.innerHTML = "Sign Up"
}

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
