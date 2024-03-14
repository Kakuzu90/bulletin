<script setup>
import { onMounted } from "vue";
import Loader from "./components/Loader.vue";
onMounted(() => {
  Notification.requestPermission();
})
</script>

<template>
  <loader />
  <router-view />
</template>
