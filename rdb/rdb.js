import {app} from '../src/firebase'
import * as auth from '../src/firebase-auth'
import * as rdb from '../src/firebase-rdb'

let userJoinedChatRoomsArray = []

// Sign in
document.getElementById('rdb-signin-btn').addEventListener('click', () => auth.authSignIn(
        app, document.getElementById('rdb-signin-email').value, document.getElementById('rdb-signin-pw').value
    )
)
// Sign out
document.getElementById('rdb-signout-btn').addEventListener('click', () => auth.authSignOut(app))

// Select ID
document.getElementById('rdb-select-id').addEventListener('click', () => {
    // Update dropdown menu
    rdb.rdbGetUserJoinedChatRooms(app, document.getElementById('rdb-input-id').value)
       .then((arr) => {
           if (arr.length === 0) {
               alert('User has not joined any room')
           } else {
               const select = document.getElementById('rdb-room-dropdown')

               arr.forEach((room) => {
                   let newOption = document.createElement('option')

                   newOption.value = room
                   newOption.innerHTML = room

                   select.appendChild(newOption)
               })

               userJoinedChatRoomsArray = arr
           }
       })
       .catch((err) => {
           alert('Error while fetching rooms\n' + err.message)
       })
})

// Join chatroom
document.getElementById('rdb-select-room').addEventListener('click', () => {
    // Fetch all chat items

    // Here, in this test, we add all chats to a textarea
    const textarea = document.getElementById('textarea-chats')
    textarea.value = ''

    rdb.rdbGetChatFromChatRoom(app, document.getElementById('rdb-room-dropdown').value)
       .then((chats) => {
           Object.values(chats).forEach((chat) => {
               textarea.value += chat.user + ': '

               if (chat.message === undefined) {
                   // An image is sent
                   // TODO: Get URL of the image from 'firebase-storage' and display the image
                   textarea.value += 'IMAGE: ' + chat.image
               } else {
                   // A message is sent
                   textarea.value += chat.message
               }

               // TODO: Convert UNIX timestamp to human-readable time
               textarea.value += ' at ' + chat.time + '\n'
           })
       })
       .catch((err) =>
           alert('Error occurred:\n' + err)
       )
})
