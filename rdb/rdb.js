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

               arr.forEach((room, index) => {
                   let newOption = document.createElement('option')

                   newOption.value = index.toString()
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

})
