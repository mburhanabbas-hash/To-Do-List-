import { app } from "./firebaseConfig.js";
// Importing neccessary methods from fireStore
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getFirestore, collection, getDocs, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Importing Functions 
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { loadUserTasks } from "/todo.js"



// Data Stores In Constants
const auth = getAuth(app);
const db = getFirestore(app);
const logOutBtn = document.getElementById('logout-btn')
const SignUp = document.getElementById('sign-upbtn')
const LoginBtn = document.getElementById('login-btn')
logOutBtn.style.display = "none"
SignUp.style.display = "block"

// Setup User 
const setupUI = (user) => {
    const taskContainer = document.getElementById('bottom-section-adding');

    if (!taskContainer) return;

    if (user) {
        taskContainer.style.display = "block";
        logOutBtn.style.display = "block"
        SignUp.style.display = "none"
        LoginBtn.style.display = "none"

    } else {
        logOutBtn.style.display = "none"
        taskContainer.style.display = "none";
        taskContainer.innerHTML = "";
        LoginBtn.style.display = "block"
        SignUp.style.display = "block"
    }
};

// Handling user On Auth Changed
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        localStorage.removeItem("activeUser");
        setupUI(null);
        return;
    }

    console.log('user', user);
    localStorage.setItem("activeUser", user.uid);
    setupUI(user);

    const tasks = loadUserTasks();

    const Uid = user.uid;

    for (const task of tasks) {
        await setDoc(
            doc(db, "users", Uid,    "tasks", task.id),
            {
                text: task.text,
                time: task.time,
                checked: task.checked
            }
        );
    }
});


// Storing Data in FireBase 
// const guidesRef = collection(db, "todo");
// getDocs(guidesRef).then((snapshot) => {
//     SetupTasks(snapshot.docs)
//     console.log("settupData")
// })
//     .catch((error) => {
//         console.error(error);
//     });




// Handling SignUp Btn
const SignUpBtn = document.querySelector("#signup")
SignUpBtn.addEventListener("submit", (e) => {
    console.log("clicked")
    e.preventDefault()
    const email = SignUpBtn['signup-email'].value
    const password = SignUpBtn['signup-password'].value
    console.log(email, password)


    const auth = getAuth()
    const user = createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        const modal = document.querySelector('#modal-signup')
        M.Modal.getInstance(modal).close();
        SignUpBtn.reset();
        console.log(user)
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
})

// Handling LogOut
const Logout = document.querySelector('#logout')
Logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("logout successfull")
    });
})

// Handing Login Btn 
const LoginForm = document.querySelector("#login-form")
LoginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const auth = getAuth()
    const email = LoginForm['login-email'].value
    const password = LoginForm['login-password'].value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            const modal = document.querySelector('#modal-login')
            M.Modal.getInstance(modal).close();
            LoginForm.reset();

            console.log("Logged in:", user);
        })
        .catch((error) => {
            console.log("Please Enter a Valid Email or passoword");
        });
});

