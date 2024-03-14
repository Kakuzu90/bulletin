<script setup>
import ErrorLayout from "../components/Layouts/ErrorLayout.vue";
import error from "../assets/svg/error-404.svg";
import { onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch("hideLoader");
})
</script>

<template>
  <error-layout>
    <div class="nk-block nk-block-middle wide-md mx-auto">
      <div class="nk-block-content nk-error-ld text-center">
        <img :src="error" class="nk-error-gfx" alt="404 Image" />
        <div class="wide-xs mx-auto">
          <h3 class="nk-error-title">Oops! Why you're here?</h3>
          <p class="nk-error-text">
            We are very sorry for inconvenience. It looks like you’re try to access a page that either has been deleted or never existed.
          </p>
          <RouterLink :to="{ name: 'Dashboard' }" class="btn btn-lg btn-primary mt-2">
            Back To Home
          </RouterLink>
        </div>
      </div>
    </div>
  </error-layout>
</template>