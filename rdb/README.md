# Realtime Database Structure

> Refer to  [Structure Your Database | Firebase Documentation](https://firebase.google.com/docs/database/web/structure-data)  for more information.

Firebase Realtime Database is a JSON-based cloud database. Data is automatically stored and synced to clients as JSON.

## Structure

User information and chat rooms are stored in Realtime Database.

```json
{
    "chats": {
    },
    "users": {
    }
}
```

### User Information

Users are stored as a separate entry under `"users"`.

```json
{
    "users": {
        "ID": {
            "email": "email address",
            "name": "display name",
            "joined_rooms": {
                "room_one": "room_one",
                "room_two": "room_two"
            },
            "profile_image": "URL to image or Base64 encoded image",
            "status_message": "status message for profile display"
        }
    }
}
```

### Chat Room Data

Chat room data is stored under `"chats"`. A new chat room will be given a unique ID when the room is created.

`"chats"` is divided into three parts: `"members"`, `"messages"`, and `"rooms"`.

* `"members"` store the members in each chat room. The key and value corresponds to user ID and `true` respectively.
* `"messages"` store chat messages in each chat room. Each message is given an ordered ID such as `m1`, `m105`.
    * Text message is stored in a key-value pair, with key as `message` and the message as the value.
    * Image is stored in a key-value pair, with key as `image` and the reference to the image or Base64-encoded image as
      the value.
    * Both text and image messages have two common properties; `time` and `user`. `time` is the UNIX timestamp,
      and `user` is the ID of the user that sent the message.
    * If the message has property named `deleted` with `true` as its value, the message will be displayed
      as `'Deleted message'` without showing its contents.
* `"rooms"` store the name, the ID of the last message sent (in `"messages"`).

```json
 {
    "chats": {
        "rooms": {
            "_comment": "Information for each chat room",
            "room-one": {
                "title": "Test Chat Room",
                "last_message": "m2"
            }
        },
        "members": {
            "_comment": "Members of each chat room",
            "room-id-1": {
                "hyunsoo": "hyunsoo",
                "damdin": "damdin"
            }
        },
        "messages": {
            "room-one": {
                "m1": {
                    "user": "hyunsoo",
                    "message": "This works!",
                    "time": 123123
                },
                "m2": {
                    "user": "damdin",
                    "image": "URL or Base64-encoded image",
                    "time": 123124,
                    "deleted": true
                }
            }
        }
    }
}
```

## Access

### Read

#### Read Data Once

More information
on [Read data one with get()](https://firebase.google.com/docs/database/web/read-and-write#read_data_once_with_get)

For data that are not updated frequently, such as user information or a friend's profile data, use `get()` to get a
snapshot of the database.

#### Read Data Constantly

More information
on [Listen for value events](https://firebase.google.com/docs/database/web/read-and-write#web_value_events)

For data that are updated constantly, such as chat messages, use `on()` or `once()` methods
of `firebase.database.Reference`.
`value` event is triggered each time the data, including that of its children, is updated.

### Write

More information on [Basic write operations](https://firebase.google.com/docs/database/web/read-and-write#basic_write)
