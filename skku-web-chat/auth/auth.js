import {app} from '../src/firebase'
import * as auth from '../src/firebase-auth'

// Listeners
// Sign up
document.getElementById('signup-btn').addEventListener('click', () => auth.authSignUp(
    app, document.getElementById('signup-email').value, document.getElementById('signup-pw').value
))

// Sign in
document.getElementById('signin-btn').addEventListener('click', () => auth.authSignIn(
    app, document.getElementById('signin-email').value, document.getElementById('signin-pw').value
))

// Login status
document.getElementById('login-status').addEventListener('click', () => auth.authSignInStatus(app))

// Log out
document.getElementById('sign-out').addEventListener('click', () => auth.authSignOut(app))

// Delete user
document.getElementById('delete-user').addEventListener('click', () => auth.authDeleteUser(app))
