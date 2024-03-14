import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { computed, onMounted, ref, watchEffect } from "vue";
import { getDownloadURL, ref as sref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import useAllToken from "./useAllToken";
import useNotification from "./useNotification";
import useAuth from "./useAuth";
import background from "../assets/images/background.jpg";
import { toast } from "vue3-toastify";

export default function usePost() {
  const post = ref({});
  const posts = ref([]);
  const form = ref({});
  const errors = ref({});
  const submit = ref(false);
  const cardBackground = ref(background);
  const image = ref(null);
  const send = useNotification();
  const { user } = useAuth();
  const tokens = useAllToken(user.value.college);

  const getPosts = async () => {
    const colRef = collection(db, "posts");
    const colQuery = query(colRef, orderBy("created_at", "desc"), orderBy("college"));
    onSnapshot(colQuery, (snapshot) => {
      posts.value = [];
      snapshot.forEach(async (item) => {
        let college = "ALL";
        
        if (item.data().college !== "*") {
          const docRef = doc(db, "colleges", item.data().college);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists) {
            college = docSnap.data().code;
          }
        }
        
        const tplt = {
          id: item.id,
          title: item.data().title,
          body: item.data().body,
          college: college,
          viewers: item.data().viewers,
          comments: item.data().comments,
          created_at: item.data().created_at,
          deleted_at: item.data().deleted_at,
          restored_at: item.data().restored_at,
        };
        posts.value.push(tplt);
      })
    })
  }

  const store = async () => {
    errors.value = {};
    if (!form.value.hasOwnProperty("title") || form.value.title == "") {
      errors.value.title = "The title field is required."
    }
    if (!form.value.hasOwnProperty("body") || form.value.body == "") {
      errors.value.body = "The body field is required.";
    }

    if (Object.values(errors.value).length === 0) {
      submit.value = true;
      const docRef = await addDoc(collection(db, "posts"), {
        title: form.value.title,
        body: form.value.body,
        college: user.value.college,
        viewers: 0,
        comments: 0,
        created_at: new Date().getTime(),
        deleted_at: null,
        restored_at: null,
      });

      if (form.value.hasOwnProperty('file')) {
        const storageRef = sref(storage, "images/" + docRef.id);
        await uploadBytes(storageRef, form.value.file);
      }

      const payload = {
        notification : {
          title : form.value.title,
          body : "New Post"
        },
        data: {
          postID : docRef.id
        },
        registration_ids: tokens.value,
      };
      if (tokens.value.length > 0) {
        send(payload);
      }
      
      await addDoc(collection(db, "notifications"), {
        title: "New Post",
        body: "The administrator posted a new post with the title of " + form.value.title + ".",
        student_id: "*",
        post_id: docRef.id,
        created_at: new Date().getTime(),
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      toast(`Post Created!\n${form.value.title} has been created successfully.`, { "type": "success", "dangerouslyHTMLString": true, "autoClose": 1500})

      image.value = null;
      form.value = {};
      submit.value = false;
    }else {
      submit.value = false;
    }
  }

  const update = async (uid) => {
    errors.value = {};
    if (!form.value.hasOwnProperty("title") || form.value.title == "") {
      errors.value.title = "The title field is required."
    }
    if (!form.value.hasOwnProperty("body") || form.value.body == "") {
      errors.value.body = "The body field is required.";
    }

    if (Object.values(errors.value).length === 0) {
      submit.value = true;
      const docRef = doc(db, "posts", uid);

      await updateDoc(docRef, {
        title: form.value.title,
        body: form.value.body,
      });

      if (form.value.hasOwnProperty('file')) {
        const storageRef = sref(storage, "images/" + docRef.id);
        await uploadBytes(storageRef, form.value.file);
      }
      toast(`Post Updated!\n${form.value.title} has been updated successfully.`, { "type": "info", "dangerouslyHTMLString": true, "autoClose": 1500})

      delete form.value["file"];
      delete form.value["name"];
      submit.value = false;
    }else {
      submit.value = false;
    }
  }

  const deletePost = async (uid) => {
    const docRef = doc(db, "posts", uid);
    await updateDoc(docRef, {
      deleted_at: new Date().getTime(),
      restored_at: null,
    })
  }

  const restorePost = async (uid) => {
    const docRef = doc(db, "posts", uid);
    await updateDoc(docRef, {
      deleted_at: null,
      restored_at: new Date().getTime(),
    })
  }

  const getPost = async (uid) => {
    const docRef = doc(db, "posts", uid);
    onSnapshot(docRef, (snapshot) => {
      form.value.title = snapshot.data().title;
      form.value.body = snapshot.data().body;
      post.value.id = snapshot.id;
      post.value.title = snapshot.data().title;
      post.value.body = snapshot.data().body;
      post.value.college = snapshot.data().college,
      post.value.viewers = snapshot.data().viewers;
      post.value.comments = snapshot.data().comments;
      post.value.created_at = snapshot.data().created_at;
      post.value.deleted_at = snapshot.data().deleted_at;
      post.value.restored_at = snapshot.data().restored_at;
    })
  }

  const getPostImage = async (uid) => {
    try {
      const imageRef = sref(storage, "images/" + uid);
      const url = await getDownloadURL(imageRef);
      post.value.image = url;
    }catch(error) {
      post.value.image = background;
    }
  }

  const handleUpload = (e) => {
    const uploaded = e.target.files[0];
    form.value.file = uploaded;
    form.value.name = uploaded.name;
    image.value = URL.createObjectURL(uploaded);
  }

  const resetUpload = () => {
    delete form.value["file"];
    delete form.value["name"];
    image.value = null;
  }

  const resetUploadV2 = () => {
    delete form.value["file"];
    delete form.value["name"];
    image.value = post.value.image;
  }

  watchEffect(() => {
    if (image.value !== null) {
      cardBackground.value = image.value;
    }else {
      cardBackground.value = background;
    }
  })

  const canUpdatePost = computed(() => {
    return post.value.college === user.value.college;
  })

  const postTotal = computed(() => {
    return posts.value.length;
  })

  const canDelete = computed(() => {
    return post.value.deleted_at == null && canUpdatePost.value;
  })

  const canRestore = computed(() => {
    return post.value.restored_at == null && post.value.deleted_at != null && canUpdatePost.value;
  })

  onMounted(async () => {
    await getPosts();
  })

  return {
    cardBackground,
    form,
    errors,
    submit,
    post,
    posts,
    postTotal,
    canUpdatePost,
    canDelete,
    canRestore,
    handleUpload,
    resetUpload,
    resetUploadV2,
    store,
    update,
    getPost,
    getPostImage,
    deletePost,
    restorePost,
  }
}