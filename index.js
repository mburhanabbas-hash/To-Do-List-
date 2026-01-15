import { app } from "./firebaseConfig.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { loadUserTasks } from "./todo.js";

const auth = getAuth(app);

const logOutBtn = document.getElementById('logout-btn');
const SignUpBtnUI = document.getElementById('sign-upbtn');
const LoginBtnUI = document.getElementById('login-btn');
const taskContainer = document.getElementById('bottom-section-adding');

const SignUpForm = document.querySelector("#signup");
const LoginForm = document.querySelector("#login-form");
const LogoutBtn = document.querySelector('#logout');

logOutBtn.style.display = "none";

document.addEventListener('DOMContentLoaded', function () {
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals, { dismissible: true });
});

const setupUI = (user) => {
  if (user) {
    taskContainer.style.display = "block";
    logOutBtn.style.display = "block";
    SignUpBtnUI.style.display = "none";
    LoginBtnUI.style.display = "none";
  } else {
    taskContainer.style.display = "none";
    taskContainer.innerHTML = "";
    logOutBtn.style.display = "none";
    SignUpBtnUI.style.display = "block";
    LoginBtnUI.style.display = "block";
  }
};

let tasksLoaded = true
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    tasksLoaded = false;
    setupUI(null);
    return;
  }

  console.log("Logged in:", user.email);
  setupUI(user);
  loadUserTasks()
});

SignUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = SignUpForm['signup-email'].value;
  const password = SignUpForm['signup-password'].value;
  const errorContainer = document.getElementById("signup-error")
  try {
    await createUserWithEmailAndPassword(auth, email, password);

    const modal = document.querySelector('#modal-signup');
    const instance = M.Modal.getInstance(modal);
    if (instance) instance.close();

    SignUpForm.reset();
  } catch (error) {
    console.error(error.message);
    errorContainer.style.display = "block"
  }
});

LoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = LoginForm['login-email'].value;
  const password = LoginForm['login-password'].value;
  const LoginError = document.getElementById('Error-Login')

  try {
    await signInWithEmailAndPassword(auth, email, password);

    const modal = document.querySelector('#modal-login');
    const instance = M.Modal.getInstance(modal);
    if (instance) instance.close();

    LoginForm.reset();
  } catch (error) {
    console.error("Invalid email or password");
    LoginError.style.display = "block"
  }
});

LogoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    await signOut(auth);

    document.querySelectorAll('.modal').forEach(modal => {
      const instance = M.Modal.getInstance(modal);
      if (instance) instance.close();
    });

    console.log("Logout successful");
  } catch (err) {
    console.error(err);
  }
});




// const checkbox = document.querySelector('.checkboxes')
// const checked  = false
// if(checkbox){
//     textSpan.style.textDecoration = "line-through dashed";
//     timeSpan.style.textDecoration = "line-through dashed";
// }