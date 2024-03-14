<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import AppLayout from "../../components/Layouts/AppLayout.vue";
import Item from "../../components/Post/Item.vue";
import usePost from "../../composable/usePost";

const { posts } = usePost();
const store = useStore();

onMounted(() => {
  store.dispatch("hideLoader");
})
</script>

<template>
  <app-layout>
    <div class="nk-block">
      <div class="row justify-content-center align-items-center g-4">
        <h4 v-if="posts.length === 0">No Posts Found</h4>
        <div class="col-lg-4 col-md-6 col-sm-10 col-12" v-for="post in posts" :key="post">
          <item :item="post" />
        </div>
      </div>
    </div>
  </app-layout>
</template>