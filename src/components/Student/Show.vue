<script setup>
import background from '../../assets/images/profile-background.jpg';
import male from '../../assets/images/male.jpg';
import female from '../../assets/images/female.jpg';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { db, storage } from '../../firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useStore } from 'vuex';
import { ref as sref, getDownloadURL } from 'firebase/storage';
import { toast } from 'vue3-toastify';

const store = useStore();
const route = useRoute();
const uid = ref(route.params.uid);
const student = ref({});
const loadslip = ref(null);

const getStudentInfo = async () => {
  const docRef = doc(db, 'students', uid.value);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    student.value.id = docSnap.id;
    student.value.name = docSnap.data().name;
    student.value.avatar = avatarImg(docSnap.data().gender);
    student.value.email = docSnap.data().email;
    student.value.student_no = docSnap.data().student_no;
    student.value.college = docSnap.data().college;
    student.value.course = docSnap.data().course;
    student.value.year_level = docSnap.data().year_level;
  }
}

const avatarImg = (gender) => {
  if (gender === 'Male') {
    return male;
  }else {
    return female;
  }
};

const approve = async () => {
  const docRef = doc(db, "students", uid.value);
  await updateDoc(docRef, {
    verified_at: new Date().getTime()
  })
  toast(`LoadSlip Aprroved!\nLoadslip has been successfully approved.`, { "type": "success", "dangerouslyHTMLString": true, "autoClose": 1500})
}

const decline = async () => {
  const docRef = doc(db, "students", uid.value);
  await updateDoc(docRef, {
    verified_at: null
  })
  toast(`LoadSlip Declined!\nLoadslip has been declined.`, { "type": "error", "dangerouslyHTMLString": true, "autoClose": 1500})
}

  const getImageDownloadUrl = async () => {
    try {
      const imageRef = sref(storage, "uploads/" + uid.value);
      const imageURL = await getDownloadURL(imageRef); // Wait for the download URL
      loadslip.value = imageURL;
    } catch (error) {
      loadslip.value = background;
    }
  }

  onMounted(() => {
    getStudentInfo();
    getImageDownloadUrl();
    store.dispatch('hideLoader');
  })
</script>

<template>
  <div class="nk-block">
    <RouterLink :to="{ name: 'Student' }" class="d-flex align-items-center text-dark">
      <vue-feather type="arrow-left" size="20"/>
      <span class="m-1">Go Back</span>
    </RouterLink>
    <div class="row">
      <div class="col-lg-5">
        <div class="card card-preview shadow-sm">
          <div class="position-relative">
            <div class="blog-image blog-image-normal rounded-top" :style="{backgroundImage: 'url('+background+')'}"></div>
            <div class="floating-avatar">
              <div class="user-avatar bg-white p-1 xl">
                <img :src="student.avatar" alt="Avatar Profile" />
              </div>
            </div>
          </div>
          <div class="card-inner">
            <h4 class="text-center text-dark fw-bolder mb-0 mt-4">
              {{ student.name }}
            </h4>
            <p class="text-center mb-0 text-primary fw-bolder">
              {{ student.email }}
            </p>
            <p class="text-center text-muted mb-0">
              {{ student.student_no }}
            </p>
            <div class="d-flex justify-content-center align-items-center flex-column">
							<span class="badge badge-outline-danger">
                {{ student.college }}
              </span>
              <span class="badge badge-outline-primary mt-1">
                {{ student.course }}
              </span>
            </div>
            <p class="text-center fw-bold">{{ student.year_level }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-7">
        <div class="card card-preview shadow-sm">
          <div class="card-inner">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="mb-0 card-title">
                Loadslip <vue-feather type="alert-octagon" size="15" class="text-danger"/>
              </h4>
              <div>
                <button
                  type="button"
                  class="btn btn-icon p-1 btn-success"
                  @click="approve"
                >
                  <vue-feather type="check" size="15" />
                </button>
                <button
                  type="button"
                  class="btn btn-icon p-1 btn-danger mx-1"
                  @click="decline"
                >
                  <vue-feather type="x" size="15" />
                </button>
                <!-- <button
                  type="button"
                  class="btn btn-icon p-1 btn-info"
                >
                  <vue-feather type="download" size="15" />
                </button> -->
              </div>
            </div>
            <img :src="loadslip" class="img-fluid" alt="Loadslip" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.floating-avatar {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
}
</style>