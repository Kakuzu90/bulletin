<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import Login from "../components/Login.vue";

const store = useStore();

onMounted(() => {
  store.dispatch("hideLoader");
})

</script>

<template>
  <login />
</template>