import { app } from "./firebaseConfig.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore, 
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { loadAllChatUsers } from "./chat.js ";

const auth = getAuth(app);
const db = getFirestore(app);


const logOutBtn = document.getElementById('logout-btn');
const SignUpBtnUI = document.getElementById('sign-upbtn');
const LoginBtnUI = document.getElementById('login-btn');
const taskContainer = document.getElementById('bottom-section-adding');
const SignUpForm = document.querySelector("#signup");
const LoginForm = document.querySelector("#login-form");
const LogoutBtn = document.querySelector('#logout');

logOutBtn.style.display = "none";



const modals = document.querySelectorAll('.modal');
document.addEventListener('DOMContentLoaded', function () {
  M.Modal.init(modals, { dismissible: true });
});

function closeAllModals() {
  modals.forEach(modalElement => {
    const instance = M.Modal.getInstance(modalElement);
    
    if (instance) {
      instance.close();
    } 
  });
}


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

onAuthStateChanged(auth, (user) => {
  // if (!user) return;
  setupUI(user)
  saveUserToFirestore(user);
  loadAllChatUsers();
    closeAllModals()
  const MessageIcon = document.getElementById("message-btn");
  if (MessageIcon) {
    MessageIcon.addEventListener("click", () => {
      window.location.href = "chat.html";
      console.log("kakak")
    });
  }

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
  StoringUserDetails(email, password)
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
  StoringUserDetails(email, password)

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

  UserEmailStoring.innerHTML = ""
  UserPasswordStoring.innerHTML = ""
});



// function for getting user email and password to store data in account details 
const UserEmailStoring = document.getElementById("UserEmail")
const UserPasswordStoring = document.getElementById('UserPassword')
function StoringUserDetails(UserEmail, UserPassword) {
  UserEmailStoring.innerHTML = UserEmail
  UserPasswordStoring.innerHTML = UserPassword

}



const provider = new GoogleAuthProvider();
auth.languageCode = 'en';
const GoogleBtn = document.getElementById('GoogleBtn')
GoogleBtn.addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      updateUserProfile(user)

      console.log(user)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

})

const UserProfileName = document.getElementById("username")
function updateUserProfile(user) {
  const UserName = user.displayName;
  const userEmail = user.email;

  const photoDp = document.getElementById("userProfilepicture").src = user.photoURL;
  console.log(photoDp);

  UserEmailStoring.textContent = userEmail;
  console.log(UserName);
  console.log(userEmail);

  const UserChattingData = {
    UserNameInchat: UserName,
    Profilepicture: photoDp
  }

  const ChatUserName = document.getElementById('UserName')
  ChatUserName.innerText = UserName;
  console.log(UserName)


}



async function saveUserToFirestore(user) {
  if (!user) return;

  
  await setDoc(
    doc(db, "userData", user.uid),
    {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email,
      photoURL: user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      lastSeen: serverTimestamp()
    },
    { merge: true }
  );
}

