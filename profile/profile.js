import { app } from '../src/firebase';
import * as auth from '../src/firebase-auth';
import * as rdb from '../src/firebase-rdb';

let currentUser;
let name;
const displayChatrooms = async (joinedRooms) => {
  document.getElementById('recent-chats').innerHTML = '';
  if (!joinedRooms.length) {
    document.getElementById('recent-chats').innerHTML = `<li class="list-group-item">
      <div class="contact-wrapper">
        <h3>You currently have no chats<h3>
      </div>
    </li>`;
  } else {
    for (let i = 0; i < joinedRooms.length; i++) {
      let room = joinedRooms[i];
      await rdb.rdbGetMembersFromChatRoom(app, room).then(async (resolve) => {
        let friendID;
        if (resolve[0] === currentUser.displayName) friendID = resolve[1];
        else friendID = resolve[0];
        let friendName;
        let lastMessage = {};
        let lastMessageUser;
        await rdb.rdbGetUserInfoFromID(app, friendID, 'name').then((resolve) => {
          friendName = resolve;
        });
        await rdb
          .rdbGetChatFromChatRoom(app, room)
          .then((resolve) => {
            lastMessage = resolve[resolve.length - 1];
          })
          .catch((error) => {
            console.log(error);
          });
        if (lastMessage.user) {
          await rdb.rdbGetUserInfoFromID(app, lastMessage.user, 'name').then((resolve) => {
            lastMessageUser = resolve;
          });
        }
        if (lastMessageUser && lastMessage.message) {
          document.getElementById('recent-chats').innerHTML += `<li class="list-group-item">
          <div class="contact-wrapper">
            <div class="contact-pic">
              <img
                src=""
                alt=""
                onerror="this.src='https://www.royalunibrew.com/wp-content/uploads/2021/07/blank-profile-picture-973460_640.png'"
              />
            </div>
            <div class="contact-content">
              <h3>${friendName}</h3>
              <p>${lastMessageUser}: ${lastMessage.message}</p>
            </div>
          </div>
        </li>`;
        } else if (lastMessageUser && lastMessage.image) {
          document.getElementById('recent-chats').innerHTML += `<li class="list-group-item">
          <div class="contact-wrapper">
            <div class="contact-pic">
              <img
                src=""
                alt=""
                onerror="this.src='https://www.royalunibrew.com/wp-content/uploads/2021/07/blank-profile-picture-973460_640.png'"
              />
            </div>
            <div class="contact-content">
              <h3>${friendName}</h3>
              <p>${lastMessageUser}: Sent an attachment.</p>
            </div>
          </div>
        </li>`;
        }
      });
    }
  }
};

const loadContents = async () => {
  currentUser = auth.refreshContents(app);
  const email = currentUser.email;
  const ID = currentUser.displayName;
  [document.getElementById('user-email-username').value, document.getElementById('user-email-domain').value] =
    email.split('@');

  document.getElementById('user-display-id').value = ID;

  await rdb.rdbGetUserInfoFromID(app, ID, 'name').then((resolve) => {
    name = resolve;
  });
  document.getElementById('user-display-name').value = name;
  document.getElementById('header-display-name').innerHTML = name;
  let joinedRooms;
  await rdb.rdbGetUserJoinedChatRooms(app, ID).then((resolve) => {
    joinedRooms = resolve;
  });
  displayChatrooms(joinedRooms);
};

const changeDisplayName = async () => {
  await rdb.rdbChangeName(app, currentUser.displayName, document.getElementById('user-display-name').value).then();
  loadContents();
};

const resetPassword = async () => {
  if (
    window.confirm('We will send a Password Reset link to ' + currentUser.email + '\nAre you sure you want to do this?')
  ) {
    if (await auth.authForgotPassword(app, currentUser.email)) window.alert('Password Reset link has been sent.');
  }
};

const goToChatroom = () => {
  document.location.href = '../chats/chats.html';
};

window.onload = function () {
  auth.checkSignin(app, loadContents);
};

document.getElementById('sign-out-btn').addEventListener('click', async () => {
  await auth.authSignOut(app);
});

document.getElementById('delete-account-btn').addEventListener('click', () => {
  if (window.confirm('Are you sure you want to permanently delete your account?')) {
    auth.authDeleteUser(app);
  }
});

document.getElementById('go-to-chatroom-btn').addEventListener('click', goToChatroom);
document.getElementById('change-display-name-btn').addEventListener('click', changeDisplayName);
document.getElementById('reset-password-btn').addEventListener('click', resetPassword);
