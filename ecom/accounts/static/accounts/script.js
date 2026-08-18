  //GOOGLE SIGN IN

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAuth,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "",
    authDomain: "nativegoods20.firebaseapp.com",
    projectId: "nativegoods20",
    storageBucket: "nativegoods20.firebasestorage.app",
    messagingSenderId: "60861623458",
    appId: "1:60861623458:web:ad6722e798be61b0213bfb"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'en';
  const provider = new GoogleAuthProvider();

  const googleLogin = document.getElementById("googleSignInButton");
  googleLogin.addEventListener("click", function(){
  
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "index1.html";

  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  })

  
