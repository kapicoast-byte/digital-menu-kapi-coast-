import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// 🔴 PASTE YOUR FIREBASE CONFIG HERE
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_gtI05K2B7GUEslsMjU_pN4B7rV8kkbM",
  authDomain: "pspk-c5298.firebaseapp.com",
  projectId: "pspk-c5298",
  storageBucket: "pspk-c5298.firebasestorage.app",
  messagingSenderId: "426256600838",
  appId: "1:426256600838:web:e8f5b8f4be326d482c5887",
  measurementId: "G-YSBZE6JDTY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ VERY IMPORTANT (fix for your error)
window.addItem = async function () {
  try {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const desc = document.getElementById("desc").value;
    const category = document.getElementById("category").value;
    const file = document.getElementById("image").files[0];

    let imageUrl = "";

    // Upload image if selected
    if (file) {
      const storageRef = ref(storage, "menu/" + Date.now() + "-" + file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Save to Firestore
   await addDoc(collection(db, "menu"), {
  name,
  price,
  description: desc,
  imageUrl,
  category,
  available: true
});

    alert("Item added successfully!");

  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }
};

// Load menu (for index.html)
async function loadMenu() {
  const menuDiv = document.getElementById("menu");
  if (!menuDiv) return;

  const snapshot = await getDocs(collection(db, "menu"));
  let html = "";

  snapshot.forEach(doc => {
    const item = doc.data();
    html += `
      <div>
        <img src="${item.imageUrl}" width="120"><br>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <b>₹${item.price}</b>
      </div>
      <hr>
    `;
  });

  menuDiv.innerHTML = html;
}

loadMenu();
window.generateQR = function () {
  const table = document.getElementById("tableNumber").value;

  if (!table) {
    alert("Enter table number");
    return;
  }

 const url = `https://pspk-c5298.web.app/index.html?table=${table}`;

  const canvas = document.getElementById("qrcode");

  QRCode.toCanvas(canvas, url, function (error) {
    if (error) {
      console.error(error);
      alert("QR Error");
    }
  });
};