import { get, getDatabase, onChildAdded, onChildChanged, onChildRemoved, ref, set, update } from 'firebase/database';

/**
 * Send a new message
 * @param app_ Firebase application reference
 * @param userID {string} User ID
 * @param roomID {number} ID of the room
 * @param messageType {string} Type of the message (for example, message, image)
 * @param content {string} Content of the message (text, URL)
 */
export async function rdbSendMessage(app_, userID, roomID, messageType, content) {
    const db = getDatabase(app_);
    const roomRef = ref(db, "chats/rooms/" + roomID + "/"); // Reference to chats/room/roomID

    // Get the ID of the last message
    return new Promise((resolve, reject) => {
        get(roomRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const lastMessageID = snapshot.val()["last_message"];

                    // ID of the new message
                    const newMessageIndex = parseInt(lastMessageID.slice(1), 10) + 1;

                    let newMessageObject = {
                        message_index: newMessageIndex,
                        user: userID,
                        time: new Date().valueOf(),
                    };
                    newMessageObject[messageType] = content;

                    // Add a new child to chats/messages/roomID/newMessageID with chat contents
                    set(ref(db, "chats/messages/" + roomID + "/m" + newMessageIndex), newMessageObject).catch((err) => {
                        alert("Error while adding new message\n(" + err.code + ") " + err.message);
                    });

                    // Update last-message of room
                    update(roomRef, {
                        last_message: "m" + newMessageIndex,
                    })
                        .then(resolve)
                        .catch(reject);
                } else {
                    // New chat room with no message
                    // TODO: Create new room
                    reject("Create new room not supported yet");
                }
            })
            .catch(reject);
    });
}

/**
 * Delete (Mark as deleted) a sent message
 *
 * @param app_ Firebase application reference
 * @param userID{string} Current user ID
 * @param roomID{string} Room ID
 * @param chatID{number} Chat ID to delete
 */
export async function rdbDeleteMessage(app_, userID, roomID, chatID) {
    const db = getDatabase(app_);
    const chatRef = ref(db, "chats/messages/" + roomID + "/m" + chatID + "/");

    // Mark message as deleted
    return update(chatRef, { deleted: true });
}

/**
 * Execute a function whenever the a new child is appended (a new chat is updated)
 *
 * Note that chat ID and data is passed as first and second arguments to func
 *
 * Usage: rdbExecuteNewChat(updateButton, document.getElementById('update-button')
 * executes updateButton(ID, chat data, document.getElementById('update-button'))
 * whenever the database is updated
 * @param app_ Firebase application reference
 * @param func{function} Function to execute
 * @param roomID{string} Room ID
 * @param args Arguments to pass
 * @returns function Function to cancel listening
 */
export function rdbExecuteNewChat(app_, func, roomID, ...args) {
    const db = getDatabase(app_);
    const messagesRef = ref(db, "chats/messages/" + roomID + "/");

    // New chat added
    return onChildAdded(
        messagesRef,
        (snapshot) => func(snapshot.val().message_index, snapshot.val(), ...args),
        (err) => alert(err.message)
    );
}

/**
 * Execute a function whenever the a new child is modified
 *
 * Note that chat ID and data is passed as first and second arguments to func
 *
 * Usage: rdbExecuteDeleteChat(updateButton, document.getElementById('remove-id')
 * executes updateButton(ID, chat data, document.getElementById('remove-id'))
 * whenever the database is updated
 * @param app_ Firebase application reference
 * @param func{function} Function to execute
 * @param roomID{string} Room ID
 * @param args Arguments to pass
 * @returns function Function to cancel listening
 */
export function rdbExecuteDeleteChat(app_, func, roomID, ...args) {
    const db = getDatabase(app_);
    const messagesRef = ref(db, "chats/messages/" + roomID + "/");

    // Chat deleted -> new property 'deleted' is added to previous chat object
    return onChildChanged(
        messagesRef,
        (snapshot) => {
            func(snapshot.val().message_index, snapshot.val(), ...args);
        },
        (err) => alert(err.message)
    );
}

/**
 * Execute a function whenever a new member joined
 *
 * Note that the first argument of 'func' will be the ID of the member
 *
 * @param app_ Firebase application reference
 * @param func{function} Function to execute
 * @param roomID Room ID
 * @param args Arguments to pass
 * @return function Function to cancel listening
 */
export function rdbExecuteUserJoined(app_, func, roomID, ...args) {
    const db = getDatabase(app_);
    const roomRef = ref(db, "chats/members/" + roomID + "/");

    // New member
    return onChildAdded(
        roomRef,
        (snapshot) => func(snapshot.val(), ...args),
        (err) => alert(err.message)
    );
}

/**
 * Execute a function whenever a member left
 *
 * @param app_ Firebase application reference
 * @param func{function} Function to execute
 * @param roomID Room ID
 * @param args Arguments to pass
 * @return function Function to cancel listening
 */
export function rdbExecuteUserLeft(app_, func, roomID, ...args) {
    const db = getDatabase(app_);
    const roomRef = ref(db, "chats/members/" + roomID + "/");

    // Member left
    return onChildRemoved(
        roomRef,
        (snapshot) => func(snapshot.val(), ...args),
        (err) => alert(err.message)
    );
}

/**
 * Get an array of room IDs the user joined
 * @param app_ Firebase application reference
 * @param userID {string} User ID
 * @returns {Promise<Array<string>>} A promise of array of string of room IDs
 */
export async function rdbGetUserJoinedChatRooms(app_, userID) {
    const db = getDatabase(app_);
    const userRef = ref(db, "users/" + userID + "/");

    return new Promise((resolve, reject) => {
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // User exists
                    const joinedRoomsArray = snapshot.val()["joined_rooms"];

                    if (joinedRoomsArray === undefined) {
                        // User exists but has not joined any room
                        resolve([]);
                    } else {
                        resolve(Object.keys(snapshot.val()["joined_rooms"]));
                    }
                } else {
                    // User does not exist
                    reject("User does not exist");
                }
            })
            .catch((err) => {
                reject(err.message);
            });
    });
}

/**
 * Get an object of all messages from a chat room
 * @param app_ Firebase application reference
 * @param roomID{string} Room ID
 * @returns {Promise<object>} A promise of an object
 */
export async function rdbGetChatFromChatRoom(app_, roomID) {
    const db = getDatabase(app_);
    const chatRoomMessagesRef = ref(db, "chats/messages/" + roomID + "/");

    return new Promise((resolve, reject) => {
        get(chatRoomMessagesRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Chat room exists
                    resolve(snapshot.val());
                } else {
                    // Chat room does not exist
                    reject("Chat room does not exist");
                }
            })
            .catch((err) => {
                reject(err.message);
            });
    });
}

/**
 * Get an array of all members in a chat room
 * @param app_ Firebase application reference
 * @param roomID Room ID
 * @returns {Promise<array>} A promise of an array
 */
export async function rdbGetMembersFromChatRoom(app_, roomID) {
    const db = getDatabase(app_);
    const chatRoomMembersRef = ref(db, "chats/members/" + roomID + "/");

    return new Promise((resolve, reject) => {
        get(chatRoomMembersRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Room exists
                    resolve(Object.keys(snapshot.val()));
                } else {
                    // Chat room does not exist
                    reject("Chat room does not exist");
                }
            })
            .catch((err) => {
                reject(err.message);
            });
    });
}

/**
 * Add user to a chat room
 * @param app_ Firebase application reference
 * @param userID{string}
 * @param roomID{string}
 * @returns {Promise<void>}
 */
export async function rdbChatRoomJoinUser(app_, userID, roomID) {
    const db = getDatabase(app_);
    const rootRef = ref(db, "/");

    let updateObject = {};
    updateObject["/chats/members/" + roomID + "/" + userID] = userID;
    updateObject["/users/" + userID + "/joined_rooms/" + roomID] = roomID;

    return new Promise((resolve, reject) => {
        update(rootRef, updateObject)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
}

/**
 * Delete user from a chat room
 * @param app_ Firebase application reference
 * @param userID{string}
 * @param roomID{string}
 * @returns {Promise<void>}
 */
export async function rdbChatRoomLeaveUser(app_, userID, roomID) {
    const db = getDatabase(app_);
    const rootRef = ref(db, "/");

    let updateObject = {};
    updateObject["/chats/members/" + roomID + "/" + userID] = null;
    updateObject["/users/" + userID + "/joined_rooms/" + roomID] = null;

    return new Promise((resolve, reject) => {
        update(rootRef, updateObject)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
}
