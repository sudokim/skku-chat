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
 *
 * @param app_ Firebase application reference
 * @param email_{string} Email address of the user
 * @param password_{string} Password of the user
 * @returns {Promise<UserCredential | string>} A promise of an UserCredential of the new account, or an error message
 */
export function authSignUp(app_, email_, password_) {
    // Email validity check
    const skku_domain = ["skku.edu", "g.skku.edu", "o365.skku.edu"];
    const re =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.exec(
            email_
        );

    return new Promise((resolve, reject) => {
        if (re !== null && skku_domain.includes(re[0].split("@")[1])) {
            // Valid email used, proceed with sign up
            const auth = getAuth(app_);

            createUserWithEmailAndPassword(auth, email_, password_)
                .then((uc) => {
                    alert("User created\n" + uc.user.email);
                    // TODO: Email verification
                    resolve(uc);
                })
                .catch((err) => reject(err.message));
        } else {
            // Invalid email used
            reject("Email address not valid");
        }
    });
}

/**
 * Sign in to an account
 *
 * @param app_ Firebase application reference
 * @param email_ Email address
 * @param password_ Password
 * @returns {Promise<UserCredential | string>} A promise of an UserCredential, or an error message
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
 *
 * @param app_ Firebase application reference
 * @returns {boolean} Boolean value of whether the user is signed in
 */
export function authSignInStatus(app_) {
    const auth = getAuth(app_);
    const user = auth.currentUser;

    return user !== null;
}

/**
 * Sign out from the app
 *
 * @param app_ Firebase application reference
 * @returns {Promise<void | string>} A promise of the result, or an error message
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
 * Make sure to confirm the user again!
 *
 * @param app_ Firebase application reference
 * @returns {Promise<void | string>} A promise for the result, or an error message
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
