import { collection, onSnapshot } from "firebase/firestore";
import { onMounted } from "vue";
import { db } from "../firebase";
import { ref } from "vue";

export default function useAllToken(college) {
  const tokens = ref([]);

  onMounted(() => {
    getTokens();
  })

  const getTokens = async () => {
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

  return tokens;
}