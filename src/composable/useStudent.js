import { computed, onMounted, ref } from "vue";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref as sref } from "firebase/storage";
import male from "../assets/images/male.jpg";
import female from "../assets/images/female.jpg";
import background from "../assets/images/background.jpg";

export default function useStudent() {
  const student = ref({});
  const students = ref([]);
  const loadslip = ref(null);

  const getStudents = async () => {
    const colRef = collection(db, "students");
    const colQuery = query(colRef, orderBy("college"), orderBy("name"), orderBy("gender"), orderBy("year_level"));
    onSnapshot(colQuery, (snapshot) => {
      students.value = [];
      snapshot.forEach((doc) => {
        const tplt = {
          id: doc.id,
          avatar: getAvatar(doc.data().gender),
          name: doc.data().name,
          email: doc.data().email,
          gender: doc.data().gender,
          college: doc.data().college,
          year_level: doc.data().year_level,
          student_no: doc.data().student_no,
          verified_at: doc.data().verified_at,
        }
        students.value.push(tplt);
      })
    })
  }

  const updateVerify = async (uid, status) => {
    const docRef = doc(db, "students", uid);
    await updateDoc(docRef, {
      verified_at: status,
    });
  }

  const setDecline = async (uid) => {
    await updateVerify(uid, false);
  }

  const setApprove = async (uid) => {
    await updateVerify(uid, true);
  }

  const getStudent = async (uid) => {
    const docRef = doc(db, "students", uid);
    onSnapshot(docRef, (doc) => {
      student.value.avatar = getAvatar(doc.data().gender);
      student.value.id = doc.id;
      student.value.name = doc.data().name;
      student.value.email = doc.data().email;
      student.value.gender = doc.data().gender;
      student.value.college = doc.data().college;
      student.value.year_level = doc.data().year_level;
      student.value.student_no = doc.data().student_no;
      student.value.verified_at = doc.data().verified_at;
    })
  }

  const getAvatar = (gender) => {
    if (gender === "Male") {
      return male;
    }else {
      return female;
    }
  }

  const getLoadSlip = async (uid) => {
    try {
      const imageRef = sref(storage, "uploads/" + uid);
      const url = await getDownloadURL(imageRef);
      loadslip.value = url;
    }catch(error) {
      loadslip.value = background;
    }
  }

  const unverified = computed(() => {
    return students.value.filter(student => student.verified_at === null);
  })

  const studentTotal = computed(() => {
    return students.value.length;
  })

  const getMaleCount = computed(() => {
    return students.value.filter(student => student.gender === "Male").length;
  })

  const getFemaleCount = computed(() => {
    return students.value.filter(student => student.gender === "Female").length;
  })

  onMounted(async () => {
    await getStudents();
  })

  return {
    student,
    students,
    loadslip,
    unverified,
    studentTotal,
    setDecline,
    setApprove,
    getStudent,
    getAvatar,
    getLoadSlip,
    getMaleCount,
    getFemaleCount,
  }
}