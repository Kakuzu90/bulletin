<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import AppLayout from "../../components/Layouts/AppLayout.vue"
import Create from "../../components/Post/Create.vue";

  const store = useStore();

  onMounted(() => {
    store.dispatch("hideLoader");
  })
</script>

<template>
  <app-layout>
    <create />
  </app-layout>
</template>