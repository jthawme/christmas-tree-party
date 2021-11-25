import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onChildAdded,
  onChildChanged,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB7_sGumxoJQzfHGWnZq9_3-QEe4AgoG1I",
  authDomain: "christmas-tree-party.firebaseapp.com",
  databaseURL:
    "https://christmas-tree-party-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "christmas-tree-party",
  storageBucket: "christmas-tree-party.appspot.com",
  messagingSenderId: "937138182242",
  appId: "1:937138182242:web:038f3a70f3a3594fcd193b",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const DB = getDatabase(app);

export const treesRef = ref(DB, "trees");

export const getTrees = () => {
  return get(treesRef).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return [];
    }
  });
};

export const listenForTrees = (cb) => {
  const t = new Date().getTime();

  const onUpdate = (snapshot) => {
    const val = snapshot.val();

    if (val.timestamp > t) {
      cb(snapshot.key, val);
    }
  };

  onChildAdded(treesRef, onUpdate);
  onChildChanged(treesRef, onUpdate);
};

export const addTree = (id, value) => {
  return set(child(treesRef, id), {
    timestamp: new Date().getTime(),
    type: "tree",
    value,
  });
};
