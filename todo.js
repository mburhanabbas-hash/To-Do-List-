import { app } from "./firebaseConfig.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* -------------------- INIT -------------------- */
const db = getFirestore(app);
const auth = getAuth(app);

/* -------------------- DOM -------------------- */
const UserData = document.getElementById('user-data-typed');
const AddBtn = document.getElementById('add-btn');
const PrintingCloneContainer = document.getElementById('bottom-section-adding');
const NoTaskspan = document.getElementById('notaskspan');
const NumberofTasks = document.getElementById('NoofTasks');
const Topform = document.querySelector('form');

let currentUserUID = null;

/* -------------------- UI CLONE -------------------- */
function createCloneElement(tododata, key, checked = false) {
  const clone = document.createElement('div');
  clone.classList.add('bottom-card-inneritems');
  clone.dataset.key = key;

  const timingDiv = document.createElement('div');
  timingDiv.classList.add('timing-and-work');
  timingDiv.style.display = 'flex';
  timingDiv.style.gap = '10px';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkboxes');
  checkbox.checked = checked;

  const textTimeDiv = document.createElement('div');
  textTimeDiv.style.display = 'flex';
  textTimeDiv.style.flexDirection = 'column';

  const textSpan = document.createElement('span');
  textSpan.classList.add('usertyped-text');
  textSpan.innerText = tododata.text;
  textSpan.style.fontWeight = "700";

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('dateandtime');
  timeSpan.innerText = tododata.time;

  if (checked) {
    textSpan.style.textDecoration = "line-through dashed";
    timeSpan.style.textDecoration = "line-through dashed";
  }

  textTimeDiv.append(textSpan, timeSpan);
  timingDiv.append(checkbox, textTimeDiv);

  const btnDiv = document.createElement('div');
  btnDiv.style.display = 'flex';
  btnDiv.style.gap = '10px';

  /* -------- YOUR ORIGINAL EDIT ICON -------- */
  const editBtn = document.createElement('div');
  editBtn.classList.add('edit-icon');
  editBtn.innerHTML = `
    <svg id="edit-section" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="#fcfcfc"
        d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583z"
        stroke="#f1ebeb" stroke-width="0.5"/>
      <path fill="#fcfcfc"
        d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2"
        stroke="#f1ebeb" stroke-width="0.5"/>
    </svg>
  `;

  /* -------- YOUR ORIGINAL DELETE ICON -------- */
  const deleteBtn = document.createElement('div');
  deleteBtn.classList.add('trash-div');
  deleteBtn.innerHTML = `
    <svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
    </svg>
  `;

  btnDiv.append(editBtn, deleteBtn);
  clone.append(timingDiv, btnDiv);

  return clone;
}

/* -------------------- ADD TASK -------------------- */
async function AddingData() {
  if (!currentUserUID) return;

  const text = UserData.value.trim();
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value;

  if (!text || !day || !time) return;

  const taskData = {
    text,
    time: `${day} at ${time}`,
    checked: false,
    createdAt: Date.now()
  };

  const docRef = await addDoc(
    collection(db, "users", currentUserUID, "tasks"),
    taskData
  );

  const clone = createCloneElement(taskData, docRef.id, false);
  PrintingCloneContainer.appendChild(clone);

  UserData.value = "";
  updateTaskCount();
}

/* -------------------- LOAD TASKS -------------------- */
export async function loadUserTasks() {
  if (!currentUserUID) return;

  PrintingCloneContainer.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "users", currentUserUID, "tasks")
  );

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const clone = createCloneElement(data, docSnap.id, data.checked);
    PrintingCloneContainer.appendChild(clone);
  });

  updateTaskCount();
}

/* -------------------- AUTH LISTENER -------------------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    PrintingCloneContainer.innerHTML = "";
    updateTaskCount();
    return;
  }

  currentUserUID = user.uid;
  await loadUserTasks();
});

/* -------------------- EVENTS -------------------- */
AddBtn.addEventListener("click", (e) => {
  e.preventDefault();
  AddingData();
});

Topform.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    AddingData();
  }
});

PrintingCloneContainer.addEventListener("click", async (e) => {
  const item = e.target.closest('.bottom-card-inneritems');
  if (!item) return;

  const taskId = item.dataset.key;

  // DELETE
  if (e.target.closest('.trash-div')) {
    await deleteDoc(doc(db, "users", currentUserUID, "tasks", taskId));
    item.remove();
    updateTaskCount();
  }

  if (e.target.classList.contains('checkboxes')) {
    await updateDoc(
      doc(db, "users", currentUserUID, "tasks", taskId),
      { checked: e.target.checked }
    );
  }
});

function updateTaskCount() {
  const total = PrintingCloneContainer.children.length;
  NumberofTasks.innerText = total;
  NoTaskspan.style.display = total === 0 ? "flex" : "none";
}
