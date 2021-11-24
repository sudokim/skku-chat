import { app } from "../src/firebase";
import * as auth from "../src/firebase-auth";
import * as rdb from "../src/firebase-rdb";

let unsubscribeNewChat;
let unsubscribeModifiedChat;

// Sign in
document
    .getElementById("rdb-signin-btn")
    .addEventListener("click", () =>
        auth.authSignIn(
            app,
            document.getElementById("rdb-signin-email").value,
            document.getElementById("rdb-signin-pw").value
        )
    );
// Sign out
document.getElementById("rdb-signout-btn").addEventListener("click", () => auth.authSignOut(app));

// Select ID
document.getElementById("rdb-select-id").addEventListener("click", () => {
    // Update dropdown menu
    rdb.rdbGetUserJoinedChatRooms(app, document.getElementById("rdb-input-id").value)
        .then((arr) => {
            if (arr.length === 0) {
                alert("User has not joined any room");
            } else {
                const select = document.getElementById("rdb-room-dropdown");

                arr.forEach((room) => {
                    let newOption = document.createElement("option");

                    newOption.value = room;
                    newOption.innerHTML = room;

                    select.appendChild(newOption);
                });
            }
        })
        .catch((err) => {
            alert("Error while fetching rooms\n" + err.message);
        });
});

// Join chatroom
document.getElementById("rdb-select-room").addEventListener("click", () => {
    const roomID = document.getElementById("rdb-room-dropdown").value;

    // Unsubscribe previous listener if exists
    if (unsubscribeNewChat !== undefined) unsubscribeNewChat();
    if (unsubscribeModifiedChat !== undefined) unsubscribeModifiedChat();

    // Update chat members
    rdb.rdbGetMembersFromChatRoom(app, roomID).then((members) => {
        const memberDiv = document.getElementById("members");
        memberDiv.innerHTML = "";

        members.forEach((member) => (memberDiv.innerHTML += member + " "));
    });

    // Add listeners
    document.getElementById("chats").innerHTML = "";
    unsubscribeNewChat = rdb.rdbExecuteNewChat(app, chatAdded, document.getElementById("rdb-room-dropdown").value);
    unsubscribeModifiedChat = rdb.rdbExecuteDeleteChat(
        app,
        chatDeleted,
        document.getElementById("rdb-room-dropdown").value
    );
});

// Send message
document.getElementById("rdb-send-new-message").addEventListener("click", () => {
    const userID = document.getElementById("rdb-input-id").value;
    const roomID = document.getElementById("rdb-room-dropdown").value;
    // TODO: Change messageType to 'image' if an image is uploaded
    const messageType = "message";
    const content = document.getElementById("rdb-new-message").value;

    rdb.rdbSendMessage(app, userID, roomID, messageType, content);
});

// Delete message
document.getElementById("rdb-delete-message-btn").addEventListener("click", () => {
    rdb.rdbDeleteMessage(
        app,
        document.getElementById("rdb-select-id").value,
        document.getElementById("rdb-room-dropdown").value,
        document.getElementById("rdb-delete-message-id").value
    );
});

/**
 * Add a chat bubble
 * @param chatID ID of the chat
 * @param chatData Contents of the chat
 */
function chatAdded(chatID, chatData) {
    const chatsDiv = document.getElementById("chats");
    let newChatBubble = document.createElement("p"); // New 'p' element

    // New chat bubble's ID
    // ex. 'chat-bubble-m12'
    newChatBubble.id = "chat-bubble-" + chatID;

    if (document.getElementById("rdb-input-id").value === chatID) {
        // Current user sent the chat
        newChatBubble.classList.add("chat-bubble-self");
    } else {
        // Other users sent the chat
        newChatBubble.classList.add("chat-bubble");
    }

    // User name
    newChatBubble.innerHTML += "<strong>" + chatData.user + "</strong><br>";

    // Mark deleted chat
    if (chatData.deleted) {
        newChatBubble.innerHTML += "<i>(Deleted Message)</i><br>";
    } else {
        if (chatData.image === undefined) {
            // Text chat
            newChatBubble.innerHTML += chatData.message + "<br>";
        } else {
            // TODO: Add image
        }
    }

    // Add time
    // TODO: Convert UNIX timestamp to readable time
    newChatBubble.innerHTML += "<small>" + chatData.time + "</small>";

    chatsDiv.appendChild(newChatBubble);
}

/**
 * Mark deleted chat
 * @param chatID ID of the chat
 * @param chatData Contents of the chat
 */
function chatDeleted(chatID, chatData) {
    let chatBubble = document.getElementById("chat-bubble-" + chatID);

    chatBubble.innerHTML =
        "<strong>" + chatData.user + "</strong><br>" + "<i>(Deleted Message)</i><br><small>" + chatData.time + "</small>";
}
