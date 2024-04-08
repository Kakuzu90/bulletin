<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import banner from "../assets/images/banner-top.png";
import useAuth from "../composable/useAuth";
import { ref } from "vue";

const store = useStore();
const showPassword = ref(false);
const {
  form, errors, submit, clearError, createAccount,
} = useAuth();

onMounted(() => {
  store.dispatch("hideLoader");
})

const togglePassword = () => showPassword.value = !showPassword.value;
</script>

<template>
  <div class="nk-content">
    <div class="nk-block nk-block-middle nk-auth-body wide-xs">
      <div class="card card-bordered">
        <div class="d-flex justify-content-between align-items-center bg-primary-dim p-3">
          <div>
            <h4 class="text-primary fw-bolder">Register to join!</h4>
            <p class="fs-13px">Create new account.</p>
          </div>
          <img :src="banner" alt="Banner Image" width="200" height="150" />
        </div>
        <div class="card-inner">
          <h4 class="text-center fw-bold text-primary">NORSU-BSC Bulletin System</h4>
          
          <div class="mb-1">
            <div class="form-label-group">
              <label class="form-label">
                Fullname <span class="text-danger fw-bolder">*</span>
              </label>
            </div>
            <input 
              type="text" 
              v-model="form.name"
              class="form-control" 
              :class="{'error': errors.name}"
              placeholder="Enter your complete name"
              @input="clearError('name')"
              autofocus />
            <p class="mb-0 text-danger fs-13px" v-if="errors.name">
              {{ errors.name }}
            </p>
          </div>

          <div class="mb-1">
            <div class="form-label-group">
              <label class="form-label">
                Email Address <span class="text-danger fw-bolder">*</span>
              </label>
            </div>
            <input 
              type="email" 
              v-model="form.email"
              class="form-control" 
              :class="{'error': errors.email}"
              placeholder="Enter your email address"
              @input="clearError('email')"
              autofocus />
            <p class="mb-0 text-danger fs-13px" v-if="errors.email">
              {{ errors.email }}
            </p>
          </div>
          
          <div class="mb-1">
            <div class="form-label-group">
              <label class="form-label" for="select">
                College <span class="text-danger fw-bolder">*</span>
              </label>
            </div>
            <div class="form-control-wrap">
              <div class="form-control-select">
                <select class="form-control" 
                  :class="{'error': errors.college}"
                  id="select"
                  v-model="form.college" 
                  placeholder="Select a college"
                  @change="clearError('college')"
                >             
									<option value="CAS">CAS</option>
									<option value="CTED">CTED</option>
									<option value="CCJE">CCJE</option>
									<option value="CAF">CAF</option>
									<option value="CBA">CBA</option>
									<option value="CIT">CIT</option>
                </select>
              </div>
              <p class="mb-0 text-danger fs-13px" v-if="errors.college">
                {{ errors.college }}
              </p>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label-group">
              <label class="form-label">
                Password <span class="text-danger fw-bolder">*</span>
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
                @input="clearError('password')"
                placeholder="Enter your password"
                @keyup.enter="login"
                />
            </div>
            <p class="mb-0 text-danger fs-13px" v-if="errors.password">
              {{ errors.password }}
            </p>
          </div>

          <button 
            type="button" 
            class="btn btn-lg btn-block btn-primary"
            :disabled="submit"
            @click="createAccount"
          >
            <span v-if="!submit">
              CREATE ACCOUNT
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
            Already have an account? <router-link :to="{name: 'Login'}">Login in instead</router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>