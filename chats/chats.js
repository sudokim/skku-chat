import * as auth from '../src/firebase-auth';
import * as rdb from '../src/firebase-rdb';
import * as storage from '../src/firebase-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../src/firebase';

// Room ID of the chat room being displayed at chat-body
let activatedChatRoomID = null;
// Array of users in the activated chat room
let activatedChatRoomMembers = [];

// Unsubscribe functions - called when changing chat room
let unsubscribeNewChatListener;
let unsubscribeDeletedChatListener;
let unsubscribeUserJoinedListener;
let unsubscribeUserLeftListener;
let unsubscribeChatRoomUpdatedListener;

/**
 * Display chats of roomID to HTML
 *
 * @param roomID{string} Room ID
 */
function displayChats(roomID) {
  // Call unsubscribe functions
  [
    unsubscribeNewChatListener,
    unsubscribeDeletedChatListener,
    unsubscribeUserJoinedListener,
    unsubscribeUserLeftListener,
  ].forEach((f) => {
    if (f !== undefined) f();
  });

  // Clear members
  activatedChatRoomMembers = [];

  const chats = document.getElementById('chats');
  const chatName = document.getElementById('chats-header-room-title');
  const chatMembers = document.getElementById('chats-header-room-members');
  const chatBody = document.getElementById('chats-body');

  // Clear chat-body
  chatName.innerText = 'Loading...';
  chatMembers.innerText = 'Loading...';
  chatBody.innerHTML = '';

  // Get room name
  rdb.rdbGetRoomTitle(app, roomID).then((roomName) => (chatName.innerText = roomName));

  // Add members listener
  unsubscribeUserJoinedListener = rdb.rdbExecuteUserJoined(
    app,
    (newMemberID) => {
      // Update joined user
      activatedChatRoomMembers.push(newMemberID);
      chatMembers.innerText = activatedChatRoomMembers.join(', ');
    },
    roomID
  );

  unsubscribeUserLeftListener = rdb.rdbExecuteUserLeft(
    app,
    (leftMemberID) => {
      // Remove left user
      activatedChatRoomMembers = activatedChatRoomMembers.filter((member) => member !== leftMemberID);
      chatMembers.innerText = activatedChatRoomMembers.join(', ');
    },
    roomID
  );

  // Add chats listener
  unsubscribeNewChatListener = rdb.rdbExecuteNewChat(app, addNewChatBubble, roomID, chatBody);

  unsubscribeDeletedChatListener = rdb.rdbExecuteDeleteChat(
    app,
    (chatID, chatData) => {
      // Function to mark a chat bubble as deleted
      document.getElementById('chat-bubble-' + chatID).innerHTML =
        '<strong>' +
        chatData.user +
        '</strong><br>' +
        '<i>(Deleted Message)</i><br><small>' +
        chatData.time +
        '</small>';
    },
    roomID
  );
}

/**
 * Add a chat room list to HTML
 *
 * @param roomID{string} Room ID
 * @param roomTitle{string} Title of the room
 * @param roomMembers{Array<string>} Array of member names
 */
function addNewChatList(roomID, roomTitle, roomMembers) {
  // Create new div
  const newChatList = document.createElement('div');
  newChatList.id = 'chat-room-list-item-' + roomID;
  newChatList.classList.add('chat-room-item');

  // Create room title and members below new div
  // Edit tags here and CSS to change the look
  const newChatListTitle = document.createElement('strong');
  const newChatListMembers = document.createElement('i');

  newChatListTitle.innerText = roomTitle;
  newChatListMembers.innerText = roomMembers.join(', ');

  // Add new listener for clicking
  newChatList.addEventListener('click', () => {
    if (activatedChatRoomID === roomID) {
      // Clicked already activated item
      return;
    }

    if (activatedChatRoomID !== null)
      document.getElementById('chat-room-list-item-' + activatedChatRoomID).classList.remove('active');

    displayChats(roomID);
    newChatList.classList.add('active');
    activatedChatRoomID = roomID;
  });

  newChatList.append(newChatListTitle, document.createElement('br'), newChatListMembers);

  // Add to document
  document.getElementById('chat-room-list').appendChild(newChatList);
}

/**
 * Add a new chat bubble to HTML
 *
 * @param chatID{string} Room ID
 * @param chatData{object} Chat object
 * @param chatBody{HTMLElement} HTML Element
 */
function addNewChatBubble(chatID, chatData, chatBody) {
  let newChatBubble = document.createElement('p'); // New 'p' element

  // New chat bubble's ID
  // ex. 'chat-bubble-12'
  newChatBubble.id = 'chat-bubble-' + chatID;

  // Check who sent the message
  const uid = auth.authGetUserUID(app);

  if (uid === chatData.user) {
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
      // Image chat
      const chatImageLoading = document.createElement('i');
      chatImageLoading.innerText = 'Loading image...';
      chatImageLoading.classList.add('loading_image');

      // Get image URL
      storage
        .storageGetURL(app, chatData.image)
        .then((imageURL) => {
          // Image loaded
          const chatImage = document.createElement('img');

          chatImage.classList.add('chat-image');
          chatImage.src = imageURL;
          chatImage.alt = 'Image';

          newChatBubble.replaceChild(chatImage, newChatBubble.getElementsByClassName('loading_image').item(0));
        })
        .catch((err) => {
          chatImageLoading.innerText = 'Error loading image';
          alert('Unable to load image\n' + err);
        });

      newChatBubble.append(chatImageLoading, document.createElement('br'));
    }
  }

  // Add time
  // TODO: Convert UNIX timestamp to readable time
  newChatBubble.innerHTML += '<small>' + chatData.time + '</small>';

  chatBody.appendChild(newChatBubble);
}

/**
 *  Send message
 */
function sendChat() {
  if (activatedChatRoomID === null) return;
  const messageInput = document.getElementById('chat-input-message');
  if (messageInput.value.length === 0) return;

  const uid = auth.authGetUserUID(app);

  // TODO: Change userID to uid
  rdb
    .rdbSendMessage(app, uid, activatedChatRoomID, 'message', messageInput.value)
    .then(() => (messageInput.value = ''))
    .catch(alert);
}

/**
 * Open a file dialog, and send image
 *
 * Image name -> '(Current UNIX Timestamp) + (random 13-digit integer).(file extension)'
 */
function sendImage() {
  if (activatedChatRoomID === null) return;

  let fileSelectDialog = document.createElement('input');

  const uid = auth.authGetUserUID(app);

  fileSelectDialog.type = 'file';
  fileSelectDialog.addEventListener('change', () => {
    const filePath = fileSelectDialog.value;
    const fileExtension = filePath.substring(filePath.lastIndexOf('.'));
    let randomFileName;
    do {
      randomFileName = (new Date().valueOf() + Math.floor(Math.random() * 10000000000000)).toString(10);
    } while (randomFileName.length !== 13);

    storage
      .storageUpload(
        app,
        fileSelectDialog.files[0],
        'images/' + activatedChatRoomID + '/' + randomFileName + fileExtension
      )
      .then((imageRef) => {
        rdb.rdbSendMessage(app, uid, activatedChatRoomID, 'image', imageRef).then(() => alert('Image uploaded!'));
      })
      .catch(alert);
  });
  fileSelectDialog.click();
}

function newRoom() {
  let otherUserID = window.prompt('Input the ID of the user to invite');

  if ((otherUserID !== null) && (otherUserID !== "")) {
    rdb
      .rdbCreateNewRoom(app, auth.authGetUserUID(app), otherUserID)
      .then(() => {
        alert('Created new chat room');
        window.location.reload()
      })
      .catch(alert);
  }
}

function loadDocument() {
  if (!auth.authSignInStatus(app)) {
    // User not signed in
    alert('Not logged in!');

    // TODO: Redirect to signin.html
  } else {
    const uid = auth.authGetUserUID(app);

    rdb
      .rdbGetUserJoinedChatRooms(app, uid)
      .then((rooms) => {
        // Clear loading rooms...
        document.getElementById('chat-room-list').innerHTML = '';

        // Iterate for rooms
        rooms.forEach((room) => {
          Promise.all([rdb.rdbGetRoomTitle(app, room), rdb.rdbGetMembersFromChatRoom(app, room)])
            .then((value) => {
              addNewChatList(room, ...value);
            })
            .catch(alert);
        });
      })
      .catch(alert);
  }
}

window.onload = function () {
  const auth = getAuth(app);

  onAuthStateChanged(auth, loadDocument);
};

document.getElementById('chat-send-image').addEventListener('click', sendImage);
document.getElementById('chat-send-message').addEventListener('click', sendChat);
document.getElementById('btn-create-new-room').addEventListener('click', newRoom);
