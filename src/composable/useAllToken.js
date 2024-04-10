import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ref } from "vue";

export default function useAllToken() {
	const tokens = ref([]);

  const getTokens = async (college) => {
		tokens.value = [];
    const colRef = collection(db, "students");
    onSnapshot(colRef, (snapshots) => {
      tokens.value = [];
      snapshots.forEach((doc) => {
        if (college == "*") {
          if (doc.data()._token) {
            tokens.value.push(doc.data()._token);
          }
        }else {
          if (doc.data().college == college && doc.data()._token) {
            tokens.value.push(doc.data()._token);
          }
        }
      })
    })
  }

  return {
		tokens,
		getTokens,
	}
}