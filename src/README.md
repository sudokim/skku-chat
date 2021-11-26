# Firebase Functions

Javascript files in this directory contains functions that connects the app to Firebase.

Document created from JSDoc by `jsdoc2md`

## Table of Contents:

* <dt><a href="#firebase">firebase.js</a></dt>
* <dt><a href="#firebase-auth">firebase-auth.js</a></dt>
* <dt><a href="#firebase-rdb">firebase-rdb.js</a></dt>
* <dt><a href="#firebase-storage">firebase-storage.js</a></dt>

<a name="firebase"></a>

# `firebase.js`
## Constants

<dl>
<dt><a href="#firebaseConfig">firebaseConfig</a> : <code>Object</code></dt>
<dd><p>API Keys for Firebase Application</p>
</dd>
<dt><a href="#app">app</a> : <code>FirebaseApp</code></dt>
<dd><p>Application reference for accessing Firebase</p>
</dd>
</dl>

<a name="firebaseConfig"></a>

## firebaseConfig : <code>Object</code>
API Keys for Firebase Application

**Kind**: global constant
<a name="app"></a>

## app : <code>FirebaseApp</code>
Application reference for accessing Firebase

**Kind**: global constant

<a name="firebase-auth"></a>

# `firebase-auth.md`
## Functions

<dl>
<dt><a href="#authSignUp">authSignUp(app_, email_, password_)</a> ⇒ <code>Promise.&lt;(UserCredential|string)&gt;</code></dt>
<dd><p>Sign up for a new account</p>
</dd>
<dt><a href="#authSignIn">authSignIn(app_, email_, password_)</a> ⇒ <code>Promise.&lt;(UserCredential|string)&gt;</code></dt>
<dd><p>Sign in to an account</p>
</dd>
<dt><a href="#authSignInStatus">authSignInStatus(app_)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the user is currently signed in</p>
</dd>
<dt><a href="#authSignOut">authSignOut(app_)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Sign out from the app</p>
</dd>
<dt><a href="#authDeleteUser">authDeleteUser(app_)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Delete an user
Make sure to confirm the user again!</p>
</dd>
</dl>

<a name="authSignUp"></a>

## authSignUp(app_, email_, password_) ⇒ <code>Promise.&lt;(UserCredential\|string)&gt;</code>
Sign up for a new account

**Kind**: global function
**Returns**: <code>Promise.&lt;(UserCredential\|string)&gt;</code> - A promise of an UserCredential of the new account, or an error message

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| email_ | <code>string</code> | Email address of the user |
| password_ | <code>string</code> | Password of the user |

<a name="authSignIn"></a>

## authSignIn(app_, email_, password_) ⇒ <code>Promise.&lt;(UserCredential\|string)&gt;</code>
Sign in to an account

**Kind**: global function
**Returns**: <code>Promise.&lt;(UserCredential\|string)&gt;</code> - A promise of an UserCredential, or an error message

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| email_ | Email address |
| password_ | Password |

<a name="authSignInStatus"></a>

## authSignInStatus(app_) ⇒ <code>boolean</code>
Check if the user is currently signed in

**Kind**: global function
**Returns**: <code>boolean</code> - Boolean value of whether the user is signed in

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |

<a name="authSignOut"></a>

## authSignOut(app_) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Sign out from the app

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - A promise of the result, or an error message

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |

<a name="authDeleteUser"></a>

## authDeleteUser(app_) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Delete an user
Make sure to confirm the user again!

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - A promise for the result, or an error message

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |

<a name="firebase-rdb"></a>

# `firebase-rdb.js`
## Functions

<dl>
<dt><a href="#rdbSendMessage">rdbSendMessage(app_, userID, roomID, messageType, content)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Send a new message</p>
<p>Usage:
Send a text message: <code>rdbSendMessage(app, &quot;hyunsoo&quot;, &quot;room_2&quot;, &quot;message&quot;, &quot;Meet me at 6!&quot;).then(() =&gt; alert(&quot;Message sent!&quot;)) Send an image: </code>rdbSendMessage(app, &quot;hyunsoo&quot;, &quot;room_1&quot;, &quot;image&quot;, &quot;path_to_file_in_firebase_storage&quot;).then(() =&gt; alert(&quot;Image sent!&quot;))
Note that you have to upload the image using <code>storageUpload()</code> to get a path of image on Firebase Storage before sending an image</p>
</dd>
<dt><a href="#rdbDeleteMessage">rdbDeleteMessage(app_, userID, roomID, chatID)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Delete (Mark as deleted) a sent message</p>
<p>Usage: `rdbDeleteMessage(app, &quot;hyunsoo&quot;, &quot;room_1&quot;, &quot;m13&quot;).then(() =&gt; alert(&quot;Message deleted!&quot;))</p>
</dd>
<dt><a href="#rdbExecuteNewChat">rdbExecuteNewChat(app_, func, roomID, args)</a> ⇒</dt>
<dd><p>Execute a function whenever the a new child is appended (a new chat is updated)
The function is also executed for every children when the listener is set up for the first time.</p>
<p>Note that chat ID and data is passed as first and second arguments to func</p>
<p>Usage: <code>unsubscriber = rdbExecuteNewChat(updateButton, document.getElementById(&#39;update-button&#39;)</code>
executes <code>updateButton(ID, chat data, document.getElementById(&#39;update-button&#39;))</code> whenever the database is updated,
and execute <code>unsubscriber()</code> to cancel listening</p>
</dd>
<dt><a href="#rdbExecuteDeleteChat">rdbExecuteDeleteChat(app_, func, roomID, args)</a> ⇒</dt>
<dd><p>Execute a function whenever the a new child is modified</p>
<p>Note that chat ID and data is passed as first and second arguments to func</p>
<p>Usage: <code>unsubscriber = rdbExecuteDeleteChat(updateButton, document.getElementById(&#39;remove-id&#39;)</code>
executes <code>updateButton(ID, chat data, document.getElementById(&#39;remove-id&#39;))</code> whenever the database is updated,
and execute <code>unsubscriber()</code> to cancel listening</p>
</dd>
<dt><a href="#rdbExecuteUserJoined">rdbExecuteUserJoined(app_, func, roomID, args)</a> ⇒</dt>
<dd><p>Execute a function whenever a new member joined
The function is also executed for every children when the listener is set up for the first time.</p>
<p>Note that the first argument of &#39;func&#39; will be the ID of the member</p>
<p>Usage: <code>unsubscriber = rdbExecuteUserJoined(updateUserList, document.getElementById(&#39;user-lists&#39;)</code>
executes <code>updateUserList(ID, document.getElementById(&#39;user-lists&#39;))</code> whenever the database is updated,
and execute <code>unsubscriber()</code> to cancel listening</p>
</dd>
<dt><a href="#rdbExecuteUserLeft">rdbExecuteUserLeft(app_, func, roomID, args)</a> ⇒</dt>
<dd><p>Execute a function whenever a member left</p>
<p>Note that the first argument of &#39;func&#39; will be the ID of the user that left</p>
<p>Usage: <code>unsubscriber = rdbExecuteUserLeft(updateLeftUser, document.getElementById(&#39;user-lists&#39;)</code>
executes <code>updateLeftUser(ID, document.getElementById(&#39;user-lists&#39;))</code> whenever the database is updated,
and execute <code>unsubscriber()</code> to cancel listening</p>
</dd>
<dt><a href="#rdbGetUserJoinedChatRooms">rdbGetUserJoinedChatRooms(app_, userID)</a> ⇒ <code>Promise.&lt;(Array.&lt;string&gt;|string)&gt;</code></dt>
<dd><p>Get an array of room IDs the user joined</p>
<p>Usage: <code>rdbGetUserJoinedChatRooms(app, &quot;hyunsoo&quot;).then((rooms) =&gt; rooms.forEach(updateChatRoomList))</code></p>
</dd>
<dt><a href="#rdbGetChatFromChatRoom">rdbGetChatFromChatRoom(app_, roomID)</a> ⇒ <code>Promise.&lt;(object|string)&gt;</code></dt>
<dd><p>Get an object of all messages from a chat room</p>
</dd>
<dt><a href="#rdbGetMembersFromChatRoom">rdbGetMembersFromChatRoom(app_, roomID)</a> ⇒ <code>Promise.&lt;(array|string)&gt;</code></dt>
<dd><p>Get an array of all members in a chat room</p>
</dd>
<dt><a href="#rdbChatRoomJoinUser">rdbChatRoomJoinUser(app_, userID, roomID)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Add user to a chat room</p>
<p>Usage: <code>rdbChatRoomJoinUser(app, &quot;hyunsoo&quot;, &quot;room_3&quot;).then(() =&gt; alert(&quot;User Joined!&quot;))</code></p>
</dd>
<dt><a href="#rdbChatRoomLeaveUser">rdbChatRoomLeaveUser(app_, userID, roomID)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Delete user from a chat room</p>
<p>Usage: <code>rdbChatRoomLeaveUser(app, &quot;hyunsoo&quot;, &quot;room_3&quot;).then(() =&gt; alert(&quot;User left!&quot;))</code></p>
</dd>
</dl>

<a name="rdbSendMessage"></a>

## rdbSendMessage(app_, userID, roomID, messageType, content) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Send a new message

Usage:
Send a text message: `rdbSendMessage(app, "hyunsoo", "room_2", "message", "Meet me at 6!").then(() => alert("Message sent!"))
Send an image: `rdbSendMessage(app, "hyunsoo", "room_1", "image", "path_to_file_in_firebase_storage").then(() => alert("Image sent!"))
Note that you have to upload the image using `storageUpload()` to get a path of image on Firebase Storage before sending an image

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - Promise of the result, or an error message

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| userID | <code>string</code> | User ID |
| roomID | <code>number</code> | ID of the room |
| messageType | <code>string</code> | Type of the message (for example, message, image) |
| content | <code>string</code> | Content of the message (text, Firebase Storage path) |

<a name="rdbDeleteMessage"></a>

## rdbDeleteMessage(app_, userID, roomID, chatID) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Delete (Mark as deleted) a sent message

Usage: `rdbDeleteMessage(app, "hyunsoo", "room_1", "m13").then(() => alert("Message deleted!"))

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - A promise of the result, or an error message

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| userID | <code>string</code> | Current user ID |
| roomID | <code>string</code> | Room ID |
| chatID | <code>number</code> | Chat ID to delete |

<a name="rdbExecuteNewChat"></a>

## rdbExecuteNewChat(app_, func, roomID, args) ⇒
Execute a function whenever the a new child is appended (a new chat is updated)
The function is also executed for every children when the listener is set up for the first time.

Note that chat ID and data is passed as first and second arguments to func

Usage: `unsubscriber = rdbExecuteNewChat(updateButton, document.getElementById('update-button')`
executes `updateButton(ID, chat data, document.getElementById('update-button'))` whenever the database is updated,
and execute `unsubscriber()` to cancel listening

**Kind**: global function
**Returns**: function A function to cancel listening

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| func | <code>function</code> | Function to execute |
| roomID | <code>string</code> | Room ID |
| args |  | Arguments to pass |

<a name="rdbExecuteDeleteChat"></a>

## rdbExecuteDeleteChat(app_, func, roomID, args) ⇒
Execute a function whenever the a new child is modified

Note that chat ID and data is passed as first and second arguments to func

Usage: `unsubscriber = rdbExecuteDeleteChat(updateButton, document.getElementById('remove-id')`
executes `updateButton(ID, chat data, document.getElementById('remove-id'))` whenever the database is updated,
and execute `unsubscriber()` to cancel listening

**Kind**: global function
**Returns**: function Function to cancel listening

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| func | <code>function</code> | Function to execute |
| roomID | <code>string</code> | Room ID |
| args |  | Arguments to pass |

<a name="rdbExecuteUserJoined"></a>

## rdbExecuteUserJoined(app_, func, roomID, args) ⇒
Execute a function whenever a new member joined
The function is also executed for every children when the listener is set up for the first time.

Note that the first argument of 'func' will be the ID of the member

Usage: `unsubscriber = rdbExecuteUserJoined(updateUserList, document.getElementById('user-lists')`
executes `updateUserList(ID, document.getElementById('user-lists'))` whenever the database is updated,
and execute `unsubscriber()` to cancel listening

**Kind**: global function
**Returns**: function Function to cancel listening

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| func | <code>function</code> | Function to execute |
| roomID |  | Room ID |
| args |  | Arguments to pass |

<a name="rdbExecuteUserLeft"></a>

## rdbExecuteUserLeft(app_, func, roomID, args) ⇒
Execute a function whenever a member left

Note that the first argument of 'func' will be the ID of the user that left

Usage: `unsubscriber = rdbExecuteUserLeft(updateLeftUser, document.getElementById('user-lists')`
executes `updateLeftUser(ID, document.getElementById('user-lists'))` whenever the database is updated,
and execute `unsubscriber()` to cancel listening

**Kind**: global function
**Returns**: function Function to cancel listening

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| func | <code>function</code> | Function to execute |
| roomID |  | Room ID |
| args |  | Arguments to pass |

<a name="rdbGetUserJoinedChatRooms"></a>

## rdbGetUserJoinedChatRooms(app_, userID) ⇒ <code>Promise.&lt;(Array.&lt;string&gt;\|string)&gt;</code>
Get an array of room IDs the user joined

Usage: `rdbGetUserJoinedChatRooms(app, "hyunsoo").then((rooms) => rooms.forEach(updateChatRoomList))`

**Kind**: global function
**Returns**: <code>Promise.&lt;(Array.&lt;string&gt;\|string)&gt;</code> - A promise of array of string of room IDs, or an error message

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| userID | <code>string</code> | User ID |

<a name="rdbGetChatFromChatRoom"></a>

## rdbGetChatFromChatRoom(app_, roomID) ⇒ <code>Promise.&lt;(object\|string)&gt;</code>
Get an object of all messages from a chat room

**Kind**: global function
**Returns**: <code>Promise.&lt;(object\|string)&gt;</code> - A promise of an object, or an error message

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| roomID | <code>string</code> | Room ID |

<a name="rdbGetMembersFromChatRoom"></a>

## rdbGetMembersFromChatRoom(app_, roomID) ⇒ <code>Promise.&lt;(array\|string)&gt;</code>
Get an array of all members in a chat room

**Kind**: global function
**Returns**: <code>Promise.&lt;(array\|string)&gt;</code> - A promise of an array, or an error message

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| roomID | Room ID |

<a name="rdbChatRoomJoinUser"></a>

## rdbChatRoomJoinUser(app_, userID, roomID) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Add user to a chat room

Usage: `rdbChatRoomJoinUser(app, "hyunsoo", "room_3").then(() => alert("User Joined!"))`

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - Promise of the result, or an error emssage

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| userID | <code>string</code> | User ID |
| roomID | <code>string</code> | Room ID |

<a name="rdbChatRoomLeaveUser"></a>

## rdbChatRoomLeaveUser(app_, userID, roomID) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Delete user from a chat room

Usage: `rdbChatRoomLeaveUser(app, "hyunsoo", "room_3").then(() => alert("User left!"))`

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - Promise of the result, or an error message

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| userID | <code>string</code> | User ID |
| roomID | <code>string</code> | Room ID |

<a name="firebase-storage"></a>

# `firebase-storage.js`
## Functions

<dl>
<dt><a href="#storageUpload">storageUpload(app_, src, dest)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Upload a file to the storage</p>
<p>Usage: <code>storageUpload(app, &quot;file://cat.jpg&quot;, &quot;images/room_1/img_1.jpg&quot;).then((r) =&gt; alert(&quot;File uploaded to: &quot; + r))</code></p>
</dd>
<dt><a href="#storageDelete">storageDelete(app_, file)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Delete a file from the storage</p>
<p>Usage: <code>storageDelete(app, &quot;images/room_1/img_1.jpg&quot;).then(() =&gt; alert(&quot;File deleted&quot;))</code></p>
</dd>
<dt><a href="#storageView">storageView(app_, dir)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>View a list of files from the directory</p>
<p>Usage: <code>storageView(app, &quot;images/room_1/&quot;).then((files) =&gt; files.forEach((file) =&gt; addFileListView(file))</code></p>
</dd>
<dt><a href="#storageGetURL">storageGetURL(app_, file)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Get an URL for the file</p>
<p>Usage: <code>storageGetURL(app, &quot;images/room_1/cat.jpg&quot;).then((img) =&gt; image.src = img)</code></p>
</dd>
</dl>

<a name="storageUpload"></a>

## storageUpload(app_, src, dest) ⇒ <code>Promise.&lt;string&gt;</code>
Upload a file to the storage

Usage: `storageUpload(app, "file://cat.jpg", "images/room_1/img_1.jpg").then((r) => alert("File uploaded to: " + r))`

**Kind**: global function
**Returns**: <code>Promise.&lt;string&gt;</code> - Returns a promise for the path of the uploaded file of whether the upload was successful,
or an error message if not successful

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| src | <code>string</code> | Source path of the file |
| dest | <code>string</code> | Destination path of the file |

<a name="storageDelete"></a>

## storageDelete(app_, file) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Delete a file from the storage

Usage: `storageDelete(app, "images/room_1/img_1.jpg").then(() => alert("File deleted"))`

**Kind**: global function
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - Returns a promise of whether deleting the file was successful,
or an error message if not successful

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| file | Path of the file to be deleted |

<a name="storageView"></a>

## storageView(app_, dir) ⇒ <code>Promise.&lt;string&gt;</code>
View a list of files from the directory

Usage: `storageView(app, "images/room_1/").then((files) => files.forEach((file) => addFileListView(file))`

**Kind**: global function
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise of a string representation of the list of the files if the directory exists,
or an error message if not successful

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| dir | Path of the directory |

<a name="storageGetURL"></a>

## storageGetURL(app_, file) ⇒ <code>Promise.&lt;string&gt;</code>
Get an URL for the file

Usage: `storageGetURL(app, "images/room_1/cat.jpg").then((img) => image.src = img)`

**Kind**: global function
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise of an URL

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| file | Path to file |

