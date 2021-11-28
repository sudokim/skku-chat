import { deleteObject, getDownloadURL, getStorage, list, ref, uploadBytes } from 'firebase/storage';

/**
 * Upload a file to the storage
 *
 * Usage: `storageUpload(app, File, "images/room_1/img_1.jpg").then((r) => alert("File uploaded to: " + r))`
 *
 * @param app_ Firebase application reference
 * @param src {File} Source path of the file
 * @param dest {string} Destination path of the file
 * @returns {Promise<string>}
 * Returns a promise for the path of the uploaded file of whether the upload was successful,
 * or an error message if not successful
 */
export async function storageUpload(app_, src, dest) {
  // Storage and reference
  const storage = getStorage(app_);
  const uploadRef = ref(storage, dest);

  return new Promise((resolve, reject) => {
    uploadBytes(uploadRef, src)
      .then((r) => resolve(r.ref.fullPath))
      .catch(reject);
  });
}

/**
 * Delete a file from the storage
 *
 * Usage: `storageDelete(app, "images/room_1/img_1.jpg").then(() => alert("File deleted"))`
 *
 * @param app_ Firebase application reference
 * @param file Path of the file to be deleted
 * @returns {Promise<void | string>} Returns a promise of whether deleting the file was successful,
 * or an error message if not successful
 */
export async function storageDelete(app_, file) {
  // Storage and reference
  const storage = getStorage(app_);
  const fileRef = ref(storage, file);

  return new Promise((resolve, reject) => {
    deleteObject(fileRef)
      .then(resolve)
      .catch((err) => reject(err.message));
  });
}

/**
 * View a list of files from the directory
 *
 * Usage: `storageView(app, "images/room_1/").then((files) => files.forEach((file) => addFileListView(file))`
 *
 * @param app_ Firebase application reference
 * @param dir Path of the directory
 * @returns {Promise<string>} A promise of a string representation of the list of the files if the directory exists,
 * or an error message if not successful
 */
export async function storageView(app_, dir) {
  // Storage and reference
  const storage = getStorage(app_);
  const dirRef = ref(storage, dir);

  return new Promise((resolve, reject) => {
    list(dirRef)
      .then((r) => resolve(r.items))
      .catch((err) => reject(err.message));
  });
}

/**
 * Get an URL for the file
 *
 * Usage: `storageGetURL(app, "images/room_1/cat.jpg").then((img) => image.src = img)`
 *
 * @param app_ Firebase application reference
 * @param file Path to file
 * @returns {Promise<string>} A promise of an URL
 */
export async function storageGetURL(app_, file) {
  // Storage and reference
  const storage = getStorage(app_);
  const fileRef = ref(storage, file);

  return new Promise((resolve, reject) => {
    getDownloadURL(fileRef)
      .then(resolve)
      .catch((err) => reject(err.message));
  });
}
