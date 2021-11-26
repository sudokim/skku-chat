import { app } from "../src/firebase";
import * as auth from "../src/firebase-auth";
import * as storage from "../src/firebase-storage";

document
    .getElementById("storage-signin-btn")
    .addEventListener("click", () =>
        auth.authSignIn(
            app,
            document.getElementById("storage-signin-email").value,
            document.getElementById("storage-signin-pw").value
        )
    );

document.getElementById("storage-signout-btn").addEventListener("click", () => auth.authSignOut(app));

document
    .getElementById("file-upload-btn")
    .addEventListener("click", () =>
        storage.storageUpload(
            app,
            document.getElementById("file-upload-selection").files[0],
            document.getElementById("file-upload-destination").value
        )
    );

document
    .getElementById("file-delete-btn")
    .addEventListener("click", () =>
        storage.storageDelete(app, document.getElementById("file-delete-selection").value)
    );

document
    .getElementById("directory-view-btn")
    .addEventListener("click", () =>
        storage.storageView(app, document.getElementById("directory-view-selection").value)
    );

document
    .getElementById("file-url-btn")
    .addEventListener("click", () => storage.storageGetURL(app, document.getElementById("file-url-selection").value));
