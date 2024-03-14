import { onMounted, ref } from "vue"
import { auth, db, messaging } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

export default function useAuth() {
  const email = ref("");
  const password = ref("");
  const user = ref({});
  const form = ref({});
  const errors = ref({});
  const loginError = ref(false);
  const submit = ref(false);
  const router = useRouter();

  onMounted(async () => {
    if (auth.currentUser != null) {
      await detials(auth.currentUser.uid);
    }
  });

  const login = async () => {
    submit.value = true;
    loginError.value = false;
    errors.value = {};
    if (email.value == "") {
      errors.value.email = "The email field is required.";
    }else if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email.value)) {
      errors.value.email = "The email is invalid.";
    }
    if (password.value == "") {
      errors.value.password = "The password field is required.";
    }
    if (Object.values(errors.value).length === 0) {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async (credential) => {
          email.value = "";
          password.value = "";
          const uid = credential.user.uid;
          const docRef = doc(db, "admins", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.data().verified_at === null) {
            toast("Account Warning!\nYour account is not yet verified by the administrator, please wait.", { "type" : "warning", "dangerouslyHTMLString": true, "autoClose": 1500});
            await logout();
            router.push({name: "Login"});
          }
          else if (docSnap.data().is_super !== null && docSnap.data().verified_at !== null) {

            toast("Login Success!\nRedirecting...", { "type" : "success", "dangerouslyHTMLString": true, "autoClose": 1500});
            getToken(messaging,
            {
              vapidKey: 'BEKKMUzNv2oOYakrfRQzqU1d-p9wDM5rFPjrJbLL4yIrYjp_nDtMfT7a3ZS-jZkHAqDplixQdpjI-RugoS-fgag'
            })
            .then(async (currentToken) => {
              if (currentToken) {
                await update(uid, {_token: currentToken});
                
                router.push({name: "Dashboard"});
                
              }else {
                toast("No registration token available, Request permission to generate one.", { "type" : "error", "dangerouslyHTMLString": true, "autoClose": 1500});
              }
            })
            .catch((error) => {
              toast(error, { "type" : "error", "dangerouslyHTMLString": true, "autoClose": 1500});
            })
            
          }else {
            await logout();
            loginError.value = true;
          }
        })
        .catch(() => {
          password.value = "";
          loginError.value = true;
        })
        .finally(() => {
          submit.value = false;
        })
    }else {
      submit.value = false;
    }
  }

  const detials = async (uid) => {
    const docRef = doc(db, "admins", uid);
    onSnapshot(docRef, (docSnap) => {
      form.value.name = docSnap.data().name;
      form.value.email = docSnap.data().email;

      user.value.id = docSnap.id;
      user.value.name = docSnap.data().name;
      user.value.email = docSnap.data().email;
      user.value.college = docSnap.data().college,
      user.value.is_super = docSnap.data().is_super;
      user.value.verified_at = docSnap.data().verified_at;
    });
  }

  const logout = async () => {
    await auth.signOut();
  }

  const update = async (uid, payload) => {
    const docRef = doc(db, "admins", uid);
    await updateDoc(docRef, payload);
  }

  const createAccount = async () => {
    errors.value = {};
    if (!form.value.hasOwnProperty("name") || form.value.name == "") {
      errors.value.name = "The name field is required.";
    }
    if (!form.value.hasOwnProperty("email") || form.value.email.value == "") {
      errors.value.email = "The email field is required.";
    }else if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(form.value.email)) {
      errors.value.email = "The email is invalid.";
    }
    if (!form.value.hasOwnProperty("college") || form.value.college == "") {
      errors.value.college = "The college field is required.";
    }
    if (!form.value.hasOwnProperty("password") || form.value.password == "") {
      errors.value.password = "The password field is required.";
    }

    if (Object.values(errors.value).length === 0) {
      submit.value = true;
      createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
      .then(async (credential) => {
        await setDoc(doc(collection(db, "admins"), credential.user.uid), {
          name: form.value.name,
          email: form.value.email,
          college: form.value.college,
          is_super: false,
          created_at: new Date().getTime(),
          verified_at: null,
        });
        await sendEmailVerification(credential.user);
        toast("Account Created!\nYou have successfully created an account, please wait till the admin verify your account.", { "type" : "success", "dangerouslyHTMLString": true, "autoClose": 1500});
        setTimeout(async () => {
          await logout();
          router.push({name: 'Login'});
        }, 1500)
      })
      .catch((error) => {
        toast(error, { "type" : "error", "dangerouslyHTMLString": true, "autoClose": 1500});
      })
      .finally(() => {
        form.value = {};
        submit.value = false;
      })
    }else {
      submit.value = false;
    }
  }
  
  const clearError = (key) => delete errors.value[`${key}`];

  return {
    email,
    password,
    user,
    form,
    errors,
    loginError,
    submit,
    login,
    logout,
    update,
    clearError,
    createAccount,
  }
}