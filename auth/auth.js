import {app} from "../src/firebase_init"
import {
    createUserWithEmailAndPassword,
    deleteUser,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth"

// Domain of SKKU emails
const skku_domain = ['skku.edu', 'g.skku.edu']

// Signup
document.getElementById('signup-btn').addEventListener("click", () => {
    // Email validity check
    const verify = verifyEmail(document.getElementById('signup-email').value)

    if (verify) {
        // Valid email used, proceed with sign up
        const auth = getAuth(app)

        createUserWithEmailAndPassword(auth, document.getElementById('signup-email').value, document.getElementById('signup-pw').value)
            .then(uc => {
                alert('User created\n' + uc.user.email)
                // TODO: Email verification
            })
            .catch(err => {
                alert('Error during user creation\n(' + err.code + ') ' + err.message)
            })

    } else {
        // Invalid email used
        alert('Invalid email')
    }
})

// Sign in
document.getElementById('signin-btn').addEventListener("click", () => {
    const auth = getAuth(app)

    signInWithEmailAndPassword(auth, document.getElementById('signin-email').value, document.getElementById('signin-pw').value)
        .then(uc => {
            alert('Signed in\n' + uc.user.email)
        })
        .catch(err => {
            alert('Error during sign in\n(' + err.code + ') ' + err.message)
        })
})

// Login status
document.getElementById('login-status').addEventListener("click", () => {
    const auth = getAuth(app)
    const user = auth.currentUser

    if (user) {
        // User logged in
        alert('User ' + user.email + '\nwith UID ' + user.uid + '\nis logged in')
    } else {
        // User not logged in
        alert('User not logged in')
    }
})

// Log out
document.getElementById('sign-out').addEventListener("click", () => {
    const auth = getAuth(app)
    const user = auth.currentUser

    if (user) {
        // User logged in -> sign out
        signOut(auth)
            .then(() => {
                alert('Sign out successful')
            })
            .catch(err => {
                alert('Error during sign out\n(' + err.code + ') ' + err.message)
            })
    } else {
        // User not logged in
        alert('User not logged in')
    }
})

// Delete user
document.getElementById('delete-user').addEventListener("click", () => {
    const auth = getAuth(app)
    const user = auth.currentUser

    if (user) {
        // User logged in -> delete
        deleteUser(user)
            .then(() => {
                alert('User delete successful')
            })
            .catch(err => {
                alert('Error during user deletion\n(' + err.code + ') ' + err.message)
            })
    } else {
        // User not logged in
        alert('User not logged in')
    }
})

/**
 * Verifies if the given email is valid and belongs to a SKKU student
 * @param {string} email Email address
 * @returns {boolean} false if email is invalid; true if email is a valid SKKU email
 */
function verifyEmail(email) {
    // Email validating regex from
    // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    const result = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        .exec(email)

    return (result !== null) && skku_domain.includes(result[0].split('@')[1])
}
