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


export {onValue}