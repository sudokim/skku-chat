import {
    createUserWithEmailAndPassword,
    deleteUser,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export function authSignUp(app_, email_, password_) {
    // Email validity check
    const skku_domain = ["skku.edu", "g.skku.edu", "o365.skku.edu"];
    const re =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.exec(
            email_
        );

    if (re !== null && skku_domain.includes(re[0].split("@")[1])) {
        // Valid email used, proceed with sign up
        const auth = getAuth(app_);

        createUserWithEmailAndPassword(auth, email_, password_)
            .then((uc) => {
                alert("User created\n" + uc.user.email);
                // TODO: Email verification
            })
            .catch((err) => {
                alert("Error during user creation\n(" + err.code + ") " + err.message);
            });
    } else {
        // Invalid email used
        alert("Invalid email");
    }
}

export async function authSignIn(app_, email_, password_) {
    const auth = getAuth(app_);
    let success;
    await signInWithEmailAndPassword(auth, email_, password_)
        .then((uc) => {
            alert("Signed in\n" + uc.user.email);
            success = true;
        })
        .catch((err) => {
            alert("Error during sign in\n(" + err.code + ") " + err.message);
            success = false;
        });
    return success;
}

export function authSignInStatus(app_) {
    const auth = getAuth(app_);
    const user = auth.currentUser;

    if (user) {
        // User logged in
        alert("User " + user.email + "\nwith UID " + user.uid + "\nis logged in");
        return true;
    } else {
        // User not logged in
        alert("User not logged in");
        return false;
    }
}

export function authSignOut(app_) {
    const auth = getAuth(app_);
    const user = auth.currentUser;

    if (user) {
        // User logged in -> sign out
        signOut(auth)
            .then(() => {
                alert("Sign out successful");
            })
            .catch((err) => {
                alert("Error during sign out\n(" + err.code + ") " + err.message);
            });
    } else {
        // User not logged in
        alert("User not logged in");
    }
}

export function authDeleteUser(app_) {
    const auth = getAuth(app_);
    const user = auth.currentUser;

    if (user) {
        // User logged in -> delete
        deleteUser(user)
            .then(() => {
                alert("User delete successful");
            })
            .catch((err) => {
                alert("Error during user deletion\n(" + err.code + ") " + err.message);
            });
    } else {
        // User not logged in
        alert("User not logged in");
    }
}
