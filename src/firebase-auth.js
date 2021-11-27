import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailLink,
  isSignInWithEmailLink,
  updateProfile,
} from 'firebase/auth';

/**
 * Sign up for a new account
 * @param app_ Firebase application reference
 * @param email_ Email address of the user
 * @param password_ Password of the user
 */
export function authSignUp(app_, email_, password_) {
  // Email validity check
  const skku_domain = ['skku.edu', 'g.skku.edu', 'o365.skku.edu'];
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.exec(
      email_
    );

  if (re !== null && skku_domain.includes(re[0].split('@')[1])) {
    // Valid email used, continue
    const auth = getAuth(app_);

    createUserWithEmailAndPassword(auth, email_, password_)
      .then((uc) => {
        alert('User created\n' + uc.user.email);
        // TODO: Email verification
      })
      .catch((err) => {
        alert('Error during user creation\n(' + err.code + ') ' + err.message);
      });
  } else {
    // Invalid email used
    alert('Invalid email');
  }
}

/**
 * Sign in to an account
 * @param app_ Firebase application reference
 * @param email_ Email address
 * @param password_ Password
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether the sign in was successful or not
 */
export async function authSignIn(app_, email_, password_) {
  const auth = getAuth(app_);
  let success;
  await setPersistence(auth, browserLocalPersistence)
    .then(async () => {
      await signInWithEmailAndPassword(auth, email_, password_)
        .then((uc) => {
          // alert('Signed in\n' + uc.user.email);
          onAuthStateChanged(auth, (user) => {
            console.log(user);
          });
          success = true;
        })
        .catch((err) => {
          alert('Error during sign in\n(' + err.code + ') ' + err.message);
          success = false;
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Error during sign in\n(' + err.code + ') ' + err.message);
    });
  return success;
}

/**
 * Check if the user is currently signed in
 * @param app_ Firebase application reference
 * @returns {boolean} Boolean value of whether the user is signed in
 */
export async function authSignInStatus(app_) {
  const auth = getAuth(app_);
  const user = auth.currentUser;
  let success = true;
  if (user) {
    // User logged in
    alert('User ' + user.email + '\nwith UID ' + user.uid + '\nis logged in');
    success = true;
  } else {
    // User not logged in
    alert('User not logged in');
    success = false;
  }
  return false;
}

/**
 * Sign out from the app
 * @param app_ Firebase application reference
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether the sign out was successful or not
 */
export async function authSignOut(app_) {
  const auth = getAuth(app_);
  const user = auth.currentUser;

  if (user) {
    // User logged in -> sign out
    await signOut(auth)
      .then(() => {
        document.location.href = '../auth-test/signin.html';
      })
      .catch((err) => {
        alert('Error during sign out\n(' + err.code + ') ' + err.message);
      });
  } else {
    // User not logged in
    alert('User not logged in');
  }
}

/**
 * Delete an user
 * @param app_ Firebase application reference
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether deleting the user was successful or not
 */
export function authDeleteUser(app_) {
  const auth = getAuth(app_);
  const user = auth.currentUser;

  if (user) {
    // User logged in -> delete
    deleteUser(user)
      .then(() => {
        alert('Your account has been successfully deleted');
        document.location.href = '../auth-test/signin.html';
      })
      .catch((err) => {
        alert('Error during user deletion\n(' + err.code + ') ' + err.message);
      });
  } else {
    // User not logged in
    alert('User not logged in');
  }
}

/**
 * Send Password Reset Email
 * @param app_ Firebase application reference
 * @param email_ Email address of the user
 */

export async function authForgotPassword(app_, email_) {
  const auth = getAuth(app_);
  let success;
  await sendPasswordResetEmail(auth, email_)
    .then(() => {
      success = true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('errorCode: ' + errorCode + '\n errorMessage:' + errorMessage);
      success = false;
    });
  return success;
}

/**
 * Send Passwordless Sign-in Link
 * @param app_ Firebase application reference
 * @param email_ Email address of the user
 */

export async function authPWLessSignIn(app_, email_) {
  const actionCodeSettings = {
    url: 'http://localhost:5500/profile/profile.html',
    handleCodeInApp: true,
  };

  const auth = getAuth(app_);
  let success;

  await sendSignInLinkToEmail(auth, email_, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email_);
      success = true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('errorCode: ' + errorCode + '\n errorMessage:' + errorMessage);
      success = false;
    });
  return success;
}

/**
 * Check Sign-in status
 * @param app_ Firebase application reference
 * @param loadContents Page contents load reference
 */

export async function checkSignin(app_, loadContents) {
  const auth = getAuth(app_);

  await onAuthStateChanged(auth, async (user) => {
    if (user) {
      // alert('Hello ' + user.email);
      loadContents();
    } else {
      await isPasswordless(app_).then((resolve) => {
        if (resolve) {
        } else {
          document.location.href = '../auth-test/signin.html';
        }
      });
    }
  });
}

/**
 * Check if the user logged through Passwordless sign-in
 * @param app_ Firebase application reference
 */

export async function isPasswordless(app_) {
  const auth = getAuth(app_);
  let success;
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }

    await signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        console.log(result);

        window.localStorage.removeItem('emailForSignIn');
        onAuthStateChanged(auth, (user) => {
          console.log(user);
        });
        success = true;
      })
      .catch((error) => {
        console.log(error);
        success = false;
      });
  } else {
    success = false;
  }
  return success;
}

/**
 * Change display name of a user
 * @param app_ Firebase application reference
 * @param name_ Input name for name change
 */

export async function changeDisplayName(app_, name_) {
  const auth = getAuth(app_);
  await updateProfile(auth.currentUser, {
    displayName: name_,
  })
    .then(() => {
      console.log('displayName changed');
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * Refresh contents of the page upon change
 * @param app_ Firebase application reference
 */

export function refreshContents(app_) {
  const auth = getAuth(app_);
  return auth.currentUser;
}
