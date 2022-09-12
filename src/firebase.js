const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  child,
  get,
  update,
  remove,
} = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyAfAt4RZ6FkT2pYWRFTb_bV42hr8NNTyZU",
  authDomain: "medicine-1ad84.firebaseapp.com",
  databaseURL:
    "https://medicine-1ad84-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "medicine-1ad84",
  storageBucket: "medicine-1ad84.appspot.com",
  messagingSenderId: "721366631643",
  appId: "1:721366631643:web:bc789daf4d55d1736878fe",
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

async function getData(path) {
  return await get(child(dbRef, path)).then((data) =>
    data.exists() ? data.val() : ""
  );
}

async function setData(updates) {
  return await update(dbRef, updates).then(() => true);
}

async function removeData(path) {
  const databaseRef = ref(getDatabase(app), path);
  return await remove(databaseRef).then(() => true);
}

module.exports = { getData, setData, removeData };
