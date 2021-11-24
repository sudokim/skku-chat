import { getStorage, ref, list, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload a file to the storage
 * @param app_ Firebase application reference
 * @param src {string} Source path of the file
 * @param dest {string} Destination path of the file
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether the upload was successful
 */
export async function storageUpload(app_, src, dest) {
  // Storage and reference
  const storage = getStorage(app_);
  const uploadRef = ref(storage, dest);

  uploadBytes(uploadRef, src)
    .then((r) => {
      alert('Uploaded file to ' + r.ref.fullPath);
      return true;
    })
    .catch((err) => {
      alert('Error during uploading file\n(' + err.code + ') ' + err.message);
      return false;
    });
}

/**
 * Delete a file from the storage
 * @param app_ Firebase application reference
 * @param file Path of the file to be deleted
 * @returns {Promise<boolean>} Returns a promise for a boolean value of whether deleting the file was successful
 */
export async function storageDelete(app_, file) {
  // Storage and reference
  const storage = getStorage(app_);
  const fileRef = ref(storage, file);

  deleteObject(fileRef)
    .then(() => {
      alert('Deleted file at ' + file);
      return true;
    })
    .catch((err) => {
      alert('Error during deleting file\n(' + err.code + ') ' + err.message);
      return false;
    });
}

/**
 * View a list of files from the directory
 * @param app_ Firebase application reference
 * @param dir Path of the directory
 * @returns {Promise<String> | null} A promise of a string representation of the list of the files if the directory exists, or null if the directory does not exist
 */
export async function storageView(app_, dir) {
  // Storage and reference
  const storage = getStorage(app_);
  const dirRef = ref(storage, dir);

  list(dirRef)
    .then((r) => {
      alert(r.items.toString());
      return r.items.toString();
    })
    .catch((err) => {
      alert('Error during list directory\n(' + err.code + ') ' + err.message);
      return null;
    });
}

/**
 * Get an URL for the file
 * @param app_ Firebase application reference
 * @param file Path to file
 * @returns {Promise<String>} A promise of an URL
 */
export async function storageGetURL(app_, file) {
  // Storage and reference
  const storage = getStorage(app_);
  const fileRef = ref(storage, file);

  getDownloadURL(fileRef)
    .then((r) => {
      alert(r);
      return r;
    })
    .catch((err) => {
      alert('Error during getting URL\n(' + err.code + ') ' + err.message);
    });
}
