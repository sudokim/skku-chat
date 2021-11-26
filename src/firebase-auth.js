import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
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

    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email_, password_)
            .then((uc) => {
                alert("Signed in as " + uc.user.email);
                resolve(uc);
            })
            .catch((err) => reject(err.message));
    });
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

    return new Promise((resolve, reject) => {
        if (user) {
            // User signed in
            signOut(auth)
                .then(resolve)
                .catch((err) => reject(err.message));
        } else {
            reject("User not signed in");
        }
    });
}

/**
 * Delete an user
 * Make sure to confirm the user again!
 *
 * @param app_ Firebase application reference
 * @returns {Promise<void | string>} A promise for the result, or an error message
 */
export async function authDeleteUser(app_) {
    const auth = getAuth(app_);
    const user = auth.currentUser;

    return new Promise((resolve, reject) => {
        if (user) {
            deleteUser(user)
                .then(resolve)
                .catch((err) => reject(err.message));
        } else {
            reject("User not signed in");
        }
    });
}

/**
 * Sign up for a new account
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
