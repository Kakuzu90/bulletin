<script setup>
  import { ref, watchEffect } from "vue";
  import { useStore } from "vuex";

  const store = useStore();
  const isLoading = ref(true);

  watchEffect(() => {
    isLoading.value = store.getters.isLoading;
  });
</script>

<template>
  <div v-if="isLoading">
    <div class="loading">
      <span></span>
      <p>Please wait</p>
    </div>
  </div>
</template>