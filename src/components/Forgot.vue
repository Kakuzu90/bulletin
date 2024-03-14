<script setup>
import { useStore } from "vuex";
import banner from "../assets/images/banner-top.png";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "vue3-toastify";

const router = useRouter();
const store = useStore();
const errors = ref({});
const submit = ref(false);
const email = ref("");

onMounted(() => {
  store.dispatch("hideLoader");
})

const clearError = (key) => delete errors.value[`${key}`];

const resend = async () => {
  submit.value = true;
  await sendPasswordResetEmail(auth, email.value);
  email.value = "";
  submit.value = false;
  toast(`Password Reset Sent!\nWe have successfully send your password reset email link.`, { "type": "success", "dangerouslyHTMLString": true, "autoClose": 1500})
}

</script>

<template>
  <div class="nk-content">
    <div class="nk-block nk-block-middle nk-auth-body wide-xs">
      <div class="card card-bordered">
        <div class="d-flex justify-content-between align-items-center bg-primary-dim p-3">
          <div>
            <h4 class="text-primary fw-bolder">Forgot Password?</h4>
            <p class="fs-13px">If you forgot your password, well, then we’ll email you instructions to reset your password.</p>
          </div>
          <img :src="banner" alt="Banner Image" width="200" height="150" />
        </div>
        <div class="card-inner">

          <div class="mb-4">
            <div class="form-label-group">
              <label class="form-label">
                Email Address <span class="text-danger fw-bolder">*</span>
              </label>
            </div>
            <input 
              type="email" 
              v-model="email"
              class="form-control" 
              :class="{'error': errors.email}"
              placeholder="Enter your email address"
              @input="clearError('email')"
              autofocus />
            <p class="mb-0 text-danger fs-13px" v-if="errors.email">
              {{ errors.email }}
            </p>
          </div>

          <button 
            type="button" 
            class="btn btn-lg btn-block btn-primary"
            :disabled="submit"
            @click="resend"
          >
            <span v-if="!submit">
              SEND EMAIL
            </span>
            <div v-else>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Loading...</span>
            </div>
          </button>

          <div class="text-center pt-4">
            <h6 class="overline-title overline-title-sap"><span>OR</span></h6>
          </div>

          <div class="form-note-s2 text-center pt-4">
            <router-link :to="{name: 'Login'}"><strong>Return to Login</strong></router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>