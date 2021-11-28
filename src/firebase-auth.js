import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { get, getDatabase, ref, set } from 'firebase/database';

/**
 * Sign up for a new account
 *
 * @param app_ Firebase application reference
 * @param email_{string} Email address of the user
 * @param password_{string} Password of the user
 * @param name_{string} Name of the user
 * @param id_{string} ID of the user
 * @returns {Promise<UserCredential | string>} A promise of an UserCredential of the new account, or an error message
 */
export function authSignUp(app_, email_, password_, name_, id_) {
  // Email validity check
  const skku_domain = ['skku.edu', 'g.skku.edu', 'o365.skku.edu'];
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.exec(
      email_
    );

  return new Promise((resolve, reject) => {
    if (re !== null && skku_domain.includes(re[0].split('@')[1])) {
      // Valid email used, proceed with sign up
      const auth = getAuth(app_);

      // Check if id is unique
      const db = getDatabase(app_);
      const accountRef = ref(db, 'users/' + id_ + '/');
      let isUserIdValid = true;

      get(accountRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            reject('ID already in use');
            isUserIdValid = false;
          }

          if (isUserIdValid) {
            createUserWithEmailAndPassword(auth, email_, password_)
              .then((uc) => {
                // Update database structure
                // Object for new user
                let newUserUpdate = {
                  email: email_,
                  name: name_,
                  joined_rooms: {},
                  profile_image: '',
                  status_message: '',
                };

                const db = getDatabase(app_);
                const userRef = ref(db, 'users/' + id_ + '/');

                Promise.all([updateProfile(uc.user, { displayName: id_ }), set(userRef, newUserUpdate)]).then(() => {
                  resolve(uc);
                });
              })
              .catch((err) => reject(err.message));
          }
        })
        .catch((err) => alert(err.message));
    } else {
      // Invalid email used
      reject('Email address not valid');
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
      reject('User not signed in');
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
      reject('User not signed in');
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

  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email_)
      .then(resolve)
      .catch((err) => reject(err.message));
  });
}

/**
 * Get the uid of the user
 * @param app_ Firebase application reference
 * @returns {string} User's uid
 */
export function authGetUserUID(app_) {
  const auth = getAuth(app_);
  return auth.currentUser.displayName;
}
