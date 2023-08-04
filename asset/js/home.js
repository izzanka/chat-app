let url = new URL(window.location.href);
let user_id = sessionStorage.getItem("id") || "";
let friend_id = url.searchParams.get("friend_id");
let username = sessionStorage.getItem("username");
let fullname = sessionStorage.getItem("fullname");
let avatar = document.getElementById("avatar");
let avatar_name = document.getElementById("avatar_name");
let friend_avatar = document.getElementById("friend_avatar");
let friend_avatar_name = document.getElementById("friend_avatar_name");
let btnLogout = document.getElementById("btnLogout");
let oldPassword = document.getElementById("oldPassword");
let newPassword = document.getElementById("newPassword");
let friendUsername = document.getElementById("friendUsername");
let btnChangePassword = document.getElementById("btnChangePassword");
let btnAddFriend = document.getElementById("btnAddFriend");
let chatRoom = document.getElementById("chatRoom");
let listFriends = document.getElementById("listFriends");
let myPw = null;

if (user_id == "") {
  window.location.href = "/auth/signin";
}

if (friend_id == null || friend_id == undefined) {
  chatRoom.hidden = true;
}

avatar.src = "https://ui-avatars.com/api/?name=" + username;

avatar_name.innerHTML = `<b>${fullname}</b>`;

btnLogout.addEventListener("click", async (e) => {
  e.preventDefault();

  sessionStorage.clear();

  window.location.href = "/auth/signin";
});

//get user by id
async function getUserById() {
  try {
    if (user_id == "") {
      return;
    }
    const res = await fetch("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        user_id: user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status != 200) {
      alert(data.message);
    } else {
      let result = data.data;
      myPw = result.password;

      let dataStore = "";

      result.friends.forEach((element) => {
        dataStore += `
            <a href="home?friend_id=${element.user_id}" class="text-decoration-none">
            <div>
                <img src="https://ui-avatars.com/api/?name=${element.username}" class="rounded-pill text-start" height="40">
                <span class="ms-4 text-black">
                    <b>${element.username}</b>
                </span>
            </div>
            </a>
            <hr>
            `;
      });

      document.getElementById("listFreinds").innerHTML = dataStore;
    }
  } catch (err) {
    alert("Something wrong. please try again later!");
    console.log(err.message);
  }
}

async function getFriendById() {
  try {
    if (user_id == "") {
      return;
    }
    if (friend_id == null || friend_id == undefined) {
      return;
    }
    const res = await fetch("http://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        user_id: friend_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status != 200) {
      alert(data.message);
    } else {
      let result = data.data;

      let username = result.username;

      friend_avatar.src = "https://ui-avatars.com/api/?name=" + username;
      friend_avatar_name.innerHTML = `<b>${username}</b>`;
    }
  } catch (err) {
    alert("Something wrong. please try again later!");
    console.log(err.message);
  }
}

getUserById();

getFriendById();

//edit user
btnChangePassword.addEventListener("click", async (e) => {
  e.preventDefault();

  if (oldPassword.value == null || newPassword.value == null) {
    return alert("All field mus be filled");
  }

  if (oldPassword.value == newPassword.value) {
    return alert("New password cannot be the same as the old password");
  }

  if (myPw != oldPassword.value) {
    return alert("Incorrect old password");
  }

  try {
    const res = await fetch("http://localhost:3000/api/user", {
      method: "PUT",
      body: JSON.stringify({
        user_id: user_id,
        password: newPassword.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status != 200) {
      alert(data.message);
    } else {
      e.preventDefault();

      sessionStorage.clear();

      alert("Password changed successfully. Please sign in again");
      window.location.href = "/auth/signin";
    }
  } catch (err) {
    alert("Something wrong. try again later!");
    console.log(err.message);
  }
});

//list users
btnAddFriend.addEventListener("click", async () => {
  try {
    const friendUname = friendUsername.value;
    if (friendUname == "") {
      return alert("Username must be filled");
    }

    if (friendUname == username) {
      return alert("You cant add your self");
    }

    const res = await fetch("http://localhost:3000/api/user/username", {
      method: "POST",
      body: JSON.stringify({
        username: friendUname,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (Object.keys(data.data).length == 0) {
      return alert("User not found");
    } else {
      let result = data.data[0];
      if (result.username == friendUname) {
        let friend_id = result.id;

        const res = await fetch("http://localhost:3000/api/user/friends/add", {
          method: "POST",
          body: JSON.stringify({
            user_id: user_id,
            friend_id: friend_id,
            user_fullname: fullname,
            user_username: username,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data.message);

        if (res.status == 200) {
          alert("Add friend request success");
        } else {
          alert(data.message);
          window.location.reload();
        }
      }
    }
  } catch (err) {
    alert("Something wrong. try again later!");
    console.log(err.message);
  }
});

//list friends
listFriends.addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/user/friends/req", {
      method: "POST",
      body: JSON.stringify({
        user_id: user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log(data);

    if (res.status != 200) {
      alert(data.message);
    } else {
      let result = data.data;

      if (result.length === 0) {
        document.getElementById("showFriends").innerHTML =
          '<div class="text-center">No friend requests</div>';
      } else {
        let dataStore = "";

        for (const element of result) {
          const res = await fetch("http://localhost:3000/api/user", {
            method: "POST",
            body: JSON.stringify({
              user_id: element.user_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();
          console.log(data);

          dataStore += `
          <div class="row">
            <div class="col-7">
              <img src="https://ui-avatars.com/api/?name=${element.username}" class="rounded-pill text-start" height="40"> 
              <span class="text-black ms-4">
                <b>${element.username}</b>
              </span>
            </div>
            <div class="col-5 text-end">
              <button class="btn btn-sm btn-success text-end mt-2 accept-button" onClick="javascript:window.location.href='/chatapp/home/acceptprocess?user_id=${user_id}&user_username=${username}&user_fullname=${fullname}&friend_id=${element.user_id}&friend_username=${element.username}&friend_fullname=${data.data.fullname}&friend_doc=${element.id}'">Accept</button>
            </div>
          </div>
          <hr>
        `;
        }

        document.getElementById("showFriends").innerHTML = dataStore;
      }
    }
  } catch (err) {
    alert("Something wrong. try again later!");
    console.log(err.message);
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  writeBatch,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNeZoO8FXUTrwyGqVdHWyZmhCzMslLWbk",
  authDomain: "simple-chat-app-d0ab8.firebaseapp.com",
  databaseURL: "https://simple-chat-app-d0ab8-default-rtdb.firebaseio.com",
  projectId: "simple-chat-app-d0ab8",
  storageBucket: "simple-chat-app-d0ab8.appspot.com",
  messagingSenderId: "97021474830",
  appId: "1:97021474830:web:c65e86ece40a2dd7dc645f",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const chatBox = document.getElementById("chatBox");
const txtMessage = document.getElementById("txtMessage");
const btnSend = document.getElementById("btnSend");

function displayMessage(data) {
  const { message, sender_id } = data;
  const messageElement = document.createElement("div");

  let style = "";
  let color = "";

  if (sender_id == user_id) {
    style = "text-end";
    color = "bg-primary";
  } else {
    style = "text-start";
    color = "bg-secondary";
  }

  messageElement.innerHTML = `<p class="text-white ${style}"><span class="small p-2 ms-3 mb-3 rounded-3 ${color}">${message}</span></p>`;

  chatBox.appendChild(messageElement);
}

function listenChatBox() {
  if (friend_id == null || friend_id == undefined) {
    return;
  }
  const chatCollection = collection(
    firestore,
    "chats",
    friend_id + user_id,
    "messages"
  );
  const chatQuery = query(chatCollection, orderBy("last_message_time"));
  onSnapshot(chatQuery, (snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      displayMessage(doc.data());
    });
  });
}

btnSend.addEventListener("click", () => {
  let msg = txtMessage.value;

  if (msg == null || msg == "") {
    return;
  }

  txtMessage.value = "";

  const messageData = {
    last_message_time: Timestamp.now(),
    message: msg,
    sender_id: user_id,
  };

  const batch = writeBatch(firestore);
  const newMessage1 = doc(
    collection(firestore, "chats", user_id + friend_id, "messages")
  );
  batch.set(newMessage1, messageData);

  const newMessage2 = doc(
    collection(firestore, "chats", friend_id + user_id, "messages")
  );
  batch.set(newMessage2, messageData);

  batch
    .commit()
    .then(() => {
      console.log("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
});

listenChatBox();

// document.getElementById('btnAddFriend').addEventListener('click', async(e) => {

// })
