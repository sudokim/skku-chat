import { app } from '../src/firebase';
import * as auth from '../src/firebase-auth';
import * as rdb from '../src/firebase-rdb';
import { get, getDatabase, ref } from 'firebase/database';

// Functions to unsubscribe from DB update listener
let unsubscribeNewChat;
let unsubscribeModifiedChat;
let unsubscribeUserJoined;
let unsubscribeUserLeft;

// Sign in
document.getElementById('rdb-signin-btn').addEventListener('click', () => {
    auth.authSignIn(
        app,
        document.getElementById('rdb-signin-email').value,
        document.getElementById('rdb-signin-pw').value
    ).then(() => {
        // Update users
        get(ref(getDatabase(app), 'users/')).then((snapshot) => {
            const userDropdown = document.getElementById('rdb-input-id');

            Object.keys(snapshot.val()).forEach((user) => {
                let newOption = document.createElement('option');

                newOption.value = user;
                newOption.innerHTML = user;

                userDropdown.appendChild(newOption);
            });
        });
    });
});

// Sign out
document.getElementById('rdb-signout-btn').addEventListener('click', () => auth.authSignOut(app));

// Select ID
document.getElementById('rdb-select-id').addEventListener('click', () => {
    // Update dropdown menu
    rdb.rdbGetUserJoinedChatRooms(app, document.getElementById('rdb-input-id').value)
       .then((arr) => {
           if (arr.length === 0) {
               alert('User has not joined any room');
           } else {
               const select = document.getElementById('rdb-room-dropdown');

               arr.forEach((room) => {
                   let newOption = document.createElement('option');

                   newOption.value = room;
                   newOption.innerHTML = room;

                   select.appendChild(newOption);
               });
           }
       })
       .catch((err) => {
           alert('Error while fetching rooms\n' + err.message);
       });
});

// Join chatroom
document.getElementById('rdb-select-room').addEventListener('click', () => {
    const roomID = document.getElementById('rdb-room-dropdown').value;

    // Unsubscribe previous listener if exists
    if (unsubscribeNewChat !== undefined) unsubscribeNewChat();
    if (unsubscribeModifiedChat !== undefined) unsubscribeModifiedChat();
    if (unsubscribeUserJoined !== undefined) unsubscribeUserJoined();
    if (unsubscribeUserLeft !== undefined) unsubscribeUserLeft();

    // Update chat members
    const memberDiv = document.getElementById('members');
    memberDiv.innerHTML = '';
    unsubscribeUserJoined = rdb.rdbExecuteUserJoined(app, userJoined, roomID);
    unsubscribeUserLeft = rdb.rdbExecuteUserLeft(app, userLeft, roomID);

    // Add listeners
    document.getElementById('chats').innerHTML = '';
    unsubscribeNewChat = rdb.rdbExecuteNewChat(app, chatAdded, document.getElementById('rdb-room-dropdown').value);
    unsubscribeModifiedChat = rdb.rdbExecuteDeleteChat(
        app,
        chatDeleted,
        document.getElementById('rdb-room-dropdown').value
    );
});

// Send message
document.getElementById('rdb-send-new-message').addEventListener('click', () => {
    const userID = document.getElementById('rdb-input-id').value;
    const roomID = document.getElementById('rdb-room-dropdown').value;
    // TODO: Change messageType to 'image' if an image is uploaded
    const messageType = 'message';
    const content = document.getElementById('rdb-new-message').value;

    rdb.rdbSendMessage(app, userID, roomID, messageType, content)
       .then(() => alert('Message sent!'))
       .catch((err) => alert(err));
});

// Delete message
document.getElementById('rdb-delete-message-btn').addEventListener('click', () => {
    rdb.rdbDeleteMessage(
        app,
        document.getElementById('rdb-select-id').value,
        document.getElementById('rdb-room-dropdown').value,
        document.getElementById('rdb-delete-message-id').value
    )
       .then(() => alert('Message successfully deleted'))
       .catch((err) => alert(err));
});

// User join
document.getElementById('rdb-join-user-btn').addEventListener('click', () => {
    rdb.rdbChatRoomJoinUser(
        app,
        document.getElementById('rdb-join-user').value,
        document.getElementById('rdb-room-dropdown').value
    )
       .then(() => alert('User join successful'))
       .catch((err) => alert(err));
});

// User leave
document.getElementById('rdb-leave-user-btn').addEventListener('click', () => {
    rdb.rdbChatRoomLeaveUser(
        app,
        document.getElementById('rdb-leave-user').value,
        document.getElementById('rdb-room-dropdown').value
    )
       .then(() => alert('User left successfully'))
       .catch((err) => alert(err));
});

/**
 * Add a chat bubble
 * @param chatID ID of the chat
 * @param chatData Contents of the chat
 */
function chatAdded(chatID, chatData) {
    const chatsDiv = document.getElementById('chats');
    let newChatBubble = document.createElement('p'); // New 'p' element

    // New chat bubble's ID
    // ex. 'chat-bubble-m12'
    newChatBubble.id = 'chat-bubble-' + chatID;

    if (document.getElementById('rdb-input-id').value === chatData.user) {
        // Current user sent the chat
        newChatBubble.classList.add('chat-bubble-self');
    } else {
        // Other users sent the chat
        newChatBubble.classList.add('chat-bubble');
    }

    // User name
    newChatBubble.innerHTML += '<strong>' + chatData.user + '</strong><br>';

    // Mark deleted chat
    if (chatData.deleted) {
        newChatBubble.innerHTML += '<i>(Deleted Message)</i><br>';
    } else {
        if (chatData.image === undefined) {
            // Text chat
            newChatBubble.innerHTML += chatData.message + '<br>';
        } else {
            // TODO: Add image
        }
    }

    // Add time
    // TODO: Convert UNIX timestamp to readable time
    newChatBubble.innerHTML += '<small>' + chatData.time + '</small>';

    chatsDiv.appendChild(newChatBubble);
}

/**
 * Mark deleted chat
 * @param chatID ID of the chat
 * @param chatData Contents of the chat
 */
function chatDeleted(chatID, chatData) {
    let chatBubble = document.getElementById('chat-bubble-' + chatID);

    chatBubble.innerHTML =
        '<strong>' +
        chatData.user +
        '</strong><br>' +
        '<i>(Deleted Message)</i><br><small>' +
        chatData.time +
        '</small>';
}

/**
 * Add joined user
 * @param userID{string} User ID
 */
function userJoined(userID) {
    const memberDiv = document.getElementById('members');
    let newMember = document.createElement('li');

    // TODO: Retrieve user name from ID
    newMember.id = userID;
    newMember.innerHTML = userID;

    memberDiv.appendChild(newMember);
}

/**
 * User left
 * @param userID{string} User ID
 */
function userLeft(userID) {
    const memberLi = document.getElementById(userID);

    memberLi.remove();
}
