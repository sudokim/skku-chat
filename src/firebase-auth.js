import {
    createUserWithEmailAndPassword,
    deleteUser,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'

/**
 * Sign up for a new account
 * @param app_ Firebase application reference
 * @param email_ Email address of the user
 * @param password_ Password of the user
 */
export function authSignUp(app_, email_, password_) {
    // Email validity check
    const skku_domain = ['skku.edu', 'g.skku.edu', 'o365.skku.edu']
    const re =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            .exec(email_)

    if (re !== null && skku_domain.includes(re[0].split('@')[1])) {
        // Valid email used, continue
        const auth = getAuth(app_)

        createUserWithEmailAndPassword(auth, email_, password_)
            .then((uc) => {
                alert('User created\n' + uc.user.email)
                // TODO: Email verification
            })
            .catch((err) => {
                alert('Error during user creation\n(' + err.code + ') ' + err.message)
            })
    } else {
        // Invalid email used
        alert('Invalid email')
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
    const auth = getAuth(app_)
    let success
    await signInWithEmailAndPassword(auth, email_, password_)
        .then((uc) => {
            alert('Signed in\n' + uc.user.email)
            success = true
        })
        .catch((err) => {
            alert('Error during sign in\n(' + err.code + ') ' + err.message)
            success = false
        })
    return success
}

/**
 * Check if the user is currently signed in
 * @param app_ Firebase application reference
 * @returns {boolean} Boolean value of whether the user is signed in
 */
export function authSignInStatus(app_) {
    const auth = getAuth(app_)
    const user = auth.currentUser

    if (user) {
        // User logged in
        alert('User ' + user.email + '\nwith UID ' + user.uid + '\nis logged in')
        return true
    } else {
        // User not logged in
        alert('User not logged in')
        return false
    }
}

/**
 * Sign out from the app
 * @param app_ Firebase application reference
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether the sign out was successful or not
 */
export async function authSignOut(app_) {
    const auth = getAuth(app_)
    const user = auth.currentUser

    if (user) {
        // User logged in -> sign out
        signOut(auth)
            .then(() => {
                alert('Sign out successful')
                return true
            })
            .catch((err) => {
                alert('Error during sign out\n(' + err.code + ') ' + err.message)
                return false
            })
    } else {
        // User not logged in
        alert('User not logged in')
        return false
    }
}

/**
 * Delete an user
 * @param app_ Firebase application reference
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether deleting the user was successful or not
 */
export async function authDeleteUser(app_) {
    const auth = getAuth(app_)
    const user = auth.currentUser

    if (user) {
        // User logged in -> delete
        deleteUser(user)
            .then(() => {
                alert('User delete successful')
                return true
            })
            .catch((err) => {
                alert('Error during user deletion\n(' + err.code + ') ' + err.message)
                return false
            })
    } else {
        // User not logged in
        alert('User not logged in')
        return false
    }
}
