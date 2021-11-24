import {getDatabase, ref, set, onValue, get, update} from 'firebase/database'

/**
 * Send a new message
 * @param app_ Firebase application reference
 * @param userID {string} User ID
 * @param roomID {string} ID of the room
 * @param messageType {string} Type of the message (for example, message, image)
 * @param content {string} Content of the message (text, URL)
 */
export function rdbSendMessage(app_, userID, roomID, messageType, content) {
    const db = getDatabase(app_)
    const roomRef = ref(db, 'chats/rooms/' + roomID + '/')  // Reference to chats/room/roomID

    // Get the ID of the last message
    get(roomRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const lastMessageID = snapshot.val()['last_message']

                // ID of the new message
                const newMessageID = 'm' + (parseInt(lastMessageID.slice(1), 10) + 1)

                let newMessageObject = {
                    user: userID,
                    time: new Date().valueOf()
                }
                newMessageObject[messageType] = content

                // Add a new child to chats/messages/roomID/newMessageID with chat contents
                set(ref(db, 'chats/messages/' + roomID + '/' + newMessageID), newMessageObject)
                    .catch((err) => {
                        alert('Error while adding new message\n(' + err.code + ') ' + err.message)
                    })

                // Update last-message of room
                update(roomRef, {
                    'last-message': newMessageID
                })
                    .then(() => alert('Successfully added new message'))
                    .catch((err) => {
                        alert('Error while updating last sent message\n(' + err.code + ') ' + err.message)
                    })

            } else {
                // New chat room with no message
                alert('Room ID ' + roomID + ' does not exist')
            }
        })
        .catch((err) => {
            alert('Error while getting message ID\n(' + err.code + ') ' + err.message)
        })
}

export const rdbUpdateType = Object.freeze({
    NEW_CHAT: 0,
    USER_JOINED: 1,
    USER_LEFT: 2
})

/**
 * Execute a function whenever the database at the given path and its children is updated
 *
 * Note that the snapshot of the database and rdbUpdateType is passed to the function as the first and second argument
 *
 * Usage: rdbExecuteWhenUpdated(updateButton, document.getElementById('update-button')
 * executes updateButton(snapshot, NEW_CHAT, document.getElementById('update-button'))
 * whenever the database is updated
 * @param app_ Firebase application reference
 * @param func Function to execute
 * @param roomID {string} Room ID
 * @param args Arguments to pass
 */
export function rdbExecuteWhenUpdated(app_, func, roomID, ...args) {
    const db = getDatabase(app_)


}

/**
 * Get an array of room IDs the user joined
 * @param app_ Firebase application reference
 * @param userID {string} User ID
 * @returns {Promise<Array<string>>} Promise of array of string of room IDs
 */
export async function rdbGetUserJoinedChatRooms(app_, userID) {
    const db = getDatabase(app_)
    const userRef = ref(db, 'users/' + userID + '/')

    return new Promise(((resolve, reject) => {
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // User exists
                    const joinedRoomsArray = snapshot.val()['joined_rooms']

                    if (joinedRoomsArray === undefined) {
                        // User exists but has not joined any room
                        resolve([])
                    } else {
                        resolve(snapshot.val()['joined_rooms'])
                    }

                } else {
                    // User does not exist
                    reject('User does not exist')
                }
            })
            .catch((err) => {
                reject(err.message)
            })
    }))
}

/**
 * Get an object of all messages from the given chat room
 * @param app_ Firebase application reference
 * @param roomID{string} Room ID
 * @returns {Promise<object>} Promise of an object
 */
export async function rdbGetChatFromChatRoom(app_, roomID) {
    const db = getDatabase(app_)
    const chatRoomMessagesRef = ref(db, 'chats/messages/' + roomID + '/')

    return new Promise(((resolve, reject) => {
        get(chatRoomMessagesRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Chat room exists
                    resolve(snapshot.val())
                } else {
                    // Chat room does not exist
                    reject('Chat room does not exist')
                }
            })
            .catch((err) => {
                reject(err.message)
            })
    }))
}

/**
 * Get an array of all members in a chat room
 * @param app_ Firebase application reference
 * @param roomID Room ID
 * @returns {Promise<array>} Promise of an array
 */
export async function rdbGetMembersFromChatRoom(app_, roomID) {
    const db = getDatabase(app_)
    const chatRoomMembersRef = ref(db, 'chats/members/' + roomID + '/')

    return new Promise(((resolve, reject) => {
        get(chatRoomMembersRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Room exists
                    resolve(Object.keys(snapshot.val()))
                } else {
                    // Chat room does not exist
                    reject('Chat room does not exist')
                }
            })
            .catch((err) => {
                reject(err.message)
            })
    }))
}
