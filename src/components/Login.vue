<script setup>
import AuthLayout from "../components/Layouts/AuthLayout.vue";
import banner from "../assets/images/banner-top.png";
import useAuth from "../composable/useAuth";
import { ref } from "vue";

const showPassword = ref(false);
const {
  email, password, errors, loginError, submit,
  clearError, login
} = useAuth();
const togglePassword = () => showPassword.value = !showPassword.value;

</script>
<template>
  <auth-layout>
    <div class="nk-content">
      <div class="nk-block nk-block-middle nk-auth-body wide-xs">
        <div class="card card-bordered">
          <div class="d-flex justify-content-between align-items-center bg-primary-dim p-3">
            <div>
              <h4 class="text-primary fw-bolder">Welcome Back!</h4>
              <p class="fs-13px">Access your account using your email and password.</p>
            </div>
            <img :src="banner" alt="Banner Image" width="200" height="150" />
          </div>
          <div class="card-inner">
            <h4 class="text-center fw-bold text-primary">NORSU-BSC Bulletin System</h4>
            <div class="mb-1">
              <div class="form-label-group">
                <label class="form-label">Email</label>
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

            <div class="form-group">
              <div class="form-label-group">
                <label class="form-label">Password</label>
                <router-link :to="{name: 'Forgot'}" class="link link-primary link-sm">Forgot Password?</router-link>
              </div>
              <div class="form-control-wrap">
                <a href="#" class="form-icon form-icon-right" @click="togglePassword">
                  <vue-feather :type="showPassword ? 'eye-off' : 'eye'" size="14" class="passcode-icon icon-show icon" />
                </a>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
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

            <p class="text-danger text-center" v-if="loginError">
              <strong class="fw-bolder">Failed!</strong> The credentials you provided are not found!
            </p>

            <button 
              type="button" 
              class="btn btn-lg btn-block btn-primary"
              :disabled="submit"
              @click="login"
            >
              <span v-if="!submit">
                LOGIN
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
              New on our platform? <router-link :to="{name: 'Register'}">Create an account</router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>