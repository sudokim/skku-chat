import {
    getStorage,
    ref,
    list,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'

export function storageUpload(app_, src, dest) {
    // Storage and reference
    const storage = getStorage(app_)
    const uploadRef = ref(storage, dest)

    uploadBytes(uploadRef, src)
        .then(r => {
            alert('Uploaded file to ' + r.ref.fullPath)
        })
        .catch(err => {
            alert('Error during uploading file\n(' + err.code + ') ' + err.message)
        })
}

export function storageDelete(app_, file) {
    // Storage and reference
    const storage = getStorage(app_)
    const fileRef = ref(storage, file)

    deleteObject(fileRef)
        .then(() => {
            alert('Deleted file at ' + file)
        })
        .catch(err => {
            alert('Error during deleting file\n(' + err.code + ') ' + err.message)
        })
}

export function storageView(app_, dir) {
    // Storage and reference
    const storage = getStorage(app_)
    const dirRef = ref(storage, dir)

    list(dirRef)
        .then(r => {
            alert(r.items.toString())
        })
        .catch(err => {
            alert('Error during list directory\n(' + err.code + ') ' + err.message)
        })
}

export function storageGetURL(app_, file) {
    // Storage and reference
    const storage = getStorage(app_)
    const fileRef = ref(storage, file)

    getDownloadURL(fileRef)
        .then(r => {
            alert(r)
        })
        .catch(err => {
            alert('Error during getting URL\n(' + err.code + ') ' + err.message)
        })
}