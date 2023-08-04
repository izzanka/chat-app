let url = new URL(window.location.href);
let avatar = document.getElementById("avatar");
let avatar_name = document.getElementById("avatar_name");
let friend_id = url.searchParams.get("user_id");
let user_id = sessionStorage.getItem("id");

if (user_id == null) {
  window.location.href = "signin.html";
}

async function getUserById() {
  try {
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

      avatar.src = "https://ui-avatars.com/api/?name=" + username;
      avatar_name.innerHTML = `<b>${username}</b>`;
    }
  } catch (err) {
    alert("Something wrong. please try again later!");
    console.log(err.message);
  }
}

getUserById();

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

const userXID = user_id;
const userYID = friend_id;
const userXChatBox = document.getElementById("userXChatBox");
const txtUserXMessage = document.getElementById("txtUserXMessage");
const btnUserXSend = document.getElementById("btnUserXSend");

function displayXMessage(data) {
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

  userXChatBox.appendChild(messageElement);
}

const chatXCollection = collection(
  firestore,
  "chats",
  userXID + userYID,
  "messages"
);
const xq = query(chatXCollection, orderBy("last_message_time"));

function listenXChatBox() {
  onSnapshot(xq, (snapshot) => {
    userXChatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      displayXMessage(doc.data());
    });
  });
}

btnUserXSend.addEventListener("click", () => {
  let msg = txtUserXMessage.value;

  if (msg == null || msg == "") {
    return alert("Message cannot be empty.");
  }

  txtUserXMessage.value = "";

  const sender_id = userXID;
  const friend_id = userYID;
  const messageData = {
    last_message_time: Timestamp.now(),
    message: msg,
    sender_id: sender_id,
  };

  const batch = writeBatch(firestore);
  const newMessage1 = doc(
    collection(firestore, "chats", sender_id + friend_id, "messages")
  );
  batch.set(newMessage1, messageData);

  const newMessage2 = doc(
    collection(firestore, "chats", friend_id + sender_id, "messages")
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

listenXChatBox();
