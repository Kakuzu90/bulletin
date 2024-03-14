import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { computed, ref } from "vue";
import { onMounted } from "vue";
import { db } from "../firebase";
import useAuth from "./useAuth";

export default function useAdmin() {
  const form = ref({});
  const errors = ref({});
  const submit = ref(false);
  const admins = ref([]);
  const { user } = useAuth();

  const getAdmins = async () => {
    const colRef = collection(db, "admins");
    const colQuery = query(colRef, orderBy("college"), orderBy("name"));
    onSnapshot(colQuery, (snapshot) => {
      admins.value = [];
      snapshot.forEach(async (item) => {
        if (item.id !== user.value.id && item.data().college !== "*") {
          const tplt = {
            id: item.id,
            name: item.data().name,
            email: item.data().email,
            college: item.data().college,
            is_super: item.data().is_super,
            _token: item.data()._token,
            verified_at: item.data().verified_at,
            created_at: item.data().created_at,
          }
          admins.value.push(tplt);
        }
      })
    })
  }

  const verifyAdmin = async (uid) => {
    const docRef = doc(db, "admins", uid);
    await updateDoc(docRef, {
      verified_at: new Date().getTime(),
    })
  }

  const adminTotal = computed(() => {
    return admins.value.length;
  })

  onMounted(async () => {
    await getAdmins();
  })

  return {
    form,
    errors,
    submit,
    admins,
    adminTotal,
    verifyAdmin,
  }
}