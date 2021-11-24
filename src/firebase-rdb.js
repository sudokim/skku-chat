import {getDatabase, ref, set, onValue, get, update} from 'firebase/database'

/**
 * Send a new message
 * @param app_ Firebase application reference
 * @param userID {string} User ID
 * @param roomID {string} ID of the room
 * @param type {string} Type of the message (for example, message, image)
 * @param content {string} Content of the message (text, URL)
 */
export function rdbAddNewMessage(app_, userID, roomID, type, content) {
    const db = getDatabase(app_)
    const roomRef = ref(db, 'chats/rooms/' + roomID)  // Reference to chats/room/roomID

    // Get the ID of the last message
    let lastMessageID = null
    get(roomRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                lastMessageID = snapshot.val()['last-message']
            } else {
                // New chat room with no message
                alert('Room ID ' + roomID + ' does not exist')
            }
        })
        .catch((err) => {
            alert('Error while getting message ID\n(' + err.code + ') ' + err.message)
        })

    // ID of the new message
    const newMessageID = 'm' + (parseInt(lastMessageID.slice(1), 10) + 1)

    let newMessageObject = {
        user: userID,
        time: new Date().valueOf()
    }
    newMessageObject[type] = content

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
 * @returns {Promise<Array<string>>} Array of room IDs, or null if error occurred
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
    }))
}
