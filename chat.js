import { app } from "./firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const auth = getAuth(app);
const db = getFirestore(app);

const chatContainer = document.getElementById("modals");
const chatUserName = document.getElementById("UserName");   


export async function loadAllChatUsers() {
    if (!chatContainer) return;

    chatContainer.innerHTML = "";
    chatContainer.style.display = "flex";
    chatContainer.style.gap = "10px";
    chatContainer.style.overflowX = "auto";
    chatContainer.style.padding = "10px";
    chatContainer.style.border = "1px solid #ddd";

    try {
        const snapshot = await getDocs(collection(db, "userData"));
        snapshot.forEach((docSnap) => {
            const user = docSnap.data();
            const img = document.createElement("img");
            img.src = user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png" ; 
            img.style.width = "45px";
            img.style.height = "45px";
            img.style.borderRadius = "50%";
            img.style.objectFit = "cover";
            img.style.cursor = "pointer";
            img.title = user.name || "User";
            chatContainer.appendChild(img);
        });
    } catch (err) {
        console.error("Error loading chat users:", err);
    }
}

onAuthStateChanged(auth, (user) => {
    if (!user) return;
    if (chatUserName) {
        chatUserName.innerText = user.displayName || "User";
    }
    loadAllChatUsers();
});

export const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
if (messagesDiv) {
    messagesDiv.style.overflowY = "auto";
    messagesDiv.style.maxHeight = "350px";
    messagesDiv.style.padding = "10px";
}

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (!user) return;

    currentUser = user;
    listenToGroupMessages();
});


if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

async function sendMessage() {
    if (!messageInput.value.trim() || !currentUser) return;

    await addDoc(
        collection(db, "groups", "global", "messages"),
        {
            text: messageInput.value.trim(),
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "User",
            senderPhoto: currentUser.photoURL || "",
            createdAt: serverTimestamp()
        }
    );

    messageInput.value = "";
}

function listenToGroupMessages() {
    const q = query(
        collection(db, "groups", "global", "messages"),
        orderBy("createdAt")
    );
    
    onSnapshot(q, (snapshot) => {
        const messagesDiv = document.getElementById("messages");
        messagesDiv.textContent = "";
        snapshot.forEach((doc) => {
            const msg = doc.data();
            renderMessage(msg);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

function renderMessage(messg) {
    const isMyAccount = messg.senderId === currentUser.uid;

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = isMyAccount ? "flex-end" : "flex-start";
    wrapper.style.marginBottom = "8px";

    const msgDiv = document.createElement("div");
    msgDiv.style.display = "flex";
    msgDiv.style.alignItems = "center";
    msgDiv.style.gap = "8px";
    msgDiv.style.maxWidth = "70%";
    msgDiv.style.padding = "8px 12px";
    msgDiv.style.borderRadius = "12px";
    msgDiv.style.background = isMyAccount ? "#d1e7ff" : "#f1f1f1";

    msgDiv.innerHTML = isMyAccount
        ? `
          <span>${messg.text}</span>
          <img src="${messg.senderPhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}"
               style="width:32px;height:32px;border-radius:50%" />
        `
        : `
          <img src="${messg.senderPhoto || 'https://via.placeholder.com/32'}"
               style="width:32px;height:32px;border-radius:50%" />
          <span>${messg.text}</span>
        `;

    wrapper.appendChild(msgDiv);
    messagesDiv.appendChild(wrapper);
}


