<script setup>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import background from "../assets/images/profile-background.jpg";
import profile from "../assets/images/administrator.jpg";
import useAuth from "../composable/useAuth";
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "vue3-toastify";

const store = useStore();
const showPassword= ref(false);
const { user, form, errors, submit, update } = useAuth();

onMounted(() => {
  store.dispatch("hideLoader");
})

const clearErr = (key) => delete errors.value[`${key}`];
const togglePassword = () => showPassword.value = !showPassword.value;

const sendEmailReset = async () => {
  await sendPasswordResetEmail(auth, auth.currentUser?.email);
  toast("Password Reset Sent!\nPlease check your inbox and follow the instructions.", { "type": "success", "dangerouslyHTMLString": true, "autoClose": 1500})
}

const updateAccount = async () => {
  errors.value = {};

  if (form.value.name == '') {
    errors.value.name = "The name field is required."
  }
  if (form.value.email == '') {
    errors.value.email = "The email field is required.";
  }else if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(form.value.email)) {
    errors.value.email = "The email is invalid.";
  }
  if (!form.value.hasOwnProperty("password") || form.value.password == "") {
    errors.value.password = "The password field is required.";
  }

  if (Object.values(errors.value).length === 0) {
    submit.value = true;

    const credentials = EmailAuthProvider.credential(
      auth.currentUser?.email,
      form.value.password
    )

    reauthenticateWithCredential(auth.currentUser, credentials)
      .then(async () => {
        if (form.value.email !== user.value.email) {
          await verifyBeforeUpdateEmail(auth.currentUser, user.value.email);
          await update(user.value.id, {
            email: form.value.email
          });
        }
        await update(user.value.id, {
          name: form.value.name
        });
        showPassword.value = !showPassword.value ?? false;
        toast("Changes Saved!\nAdministrator information has been successfully changed.", { "type": "success", "dangerouslyHTMLString": true, "autoClose": 1500})
      })
      .catch((error) => {
        form.value.password = "";
        toast("Incorrect Password, please try again!", { "type": "error", "dangerouslyHTMLString": true, "autoClose": 1500})
      })
      .finally(() => {
        form.value.password = "";
        submit.value = false;
      })
  }else {
    submit.value = false;
  }
}

</script>

<template>
  <div class="nk-block">
    <div class="col-lg-5 mx-auto">
      <div class="card card-preview shadow-sm">
        <div class="position-relative">
          <div class="blog-image blog-image-normal rounded-top" :style="{backgroundImage: 'url('+background+')'}"></div>
          <div class="floating-avatar">
            <div class="user-avatar bg-white p-1 xl">
              <img :src="profile" alt="Avatar Profile" />
            </div>
          </div>
        </div>
        <div class="card-inner">
          <h4 class="text-center text-primary mt-4">Administrator</h4>

          <div class="mb-2">
            <label class="form-label">
              Name <span class="text-danger">*</span>
            </label>
            <div class="form-control-wrap">
              <div class="form-icon form-icon-right">
                <vue-feather type="user" size="15" />
              </div>
              <input type="text" 
              class="form-control" 
              :class="{'error' : errors.name}" 
              @input="clearErr('name')" 
              v-model="form.name" 
              placeholder="Enter your name here" autofocus />
              <p class="mb-0 text-danger fs-13px" v-if="errors.name">
                {{ errors.name }}
              </p>
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label">
              Email <span class="text-danger">*</span>
            </label>
            <div class="form-control-wrap">
              <div class="form-icon form-icon-right">
                <vue-feather type="mail" size="15" />
              </div>
              <input type="email" class="form-control" v-model="form.email" @input="clearErr('email')" placeholder="Enter your email address here" />
              <p class="mb-0 text-danger fs-13px" v-if="errors.email">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <div class="mb-2">
            <div class="form-label-group">
              <label class="form-label">
                Password <span class="text-danger">*</span>
              </label>
            </div>
            <div class="form-control-wrap">
              <a href="#" class="form-icon form-icon-right" @click="togglePassword">
                <vue-feather :type="showPassword ? 'eye-off' : 'eye'" size="14" class="passcode-icon icon-show icon" />
              </a>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="form.password" 
                class="form-control"
                :class="{'error': errors.password}" 
                @input="clearErr('password')"
                placeholder="Enter your password"
                @keypress.enter="updateAccount"
                />
            </div>
            <p class="mb-0 text-danger fs-13px" v-if="errors.password">
              {{ errors.password }}
            </p>
          </div>

          <button 
            type="button" 
            class="btn btn-block btn-warning"
            @click="updateAccount"
            :disabled="submit"
            >
            <div v-if="submit">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Loading...</span>
            </div>
            <div class="d-flex align-items-center" v-else>
              <vue-feather type="database" size="15" />
              <span class="ml-1">Submit Changes</span>
            </div>
          </button>

          <div class="text-center pt-4 pb-3">
           <h6 class="overline-title overline-title-sap"><span>OR</span></h6>
          </div>
          <div class="form-note-s2 text-center"> Request new password? <a href="#" @click="sendEmailReset">click here</a></div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.floating-avatar {
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
}
</style>