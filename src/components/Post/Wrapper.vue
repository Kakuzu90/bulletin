<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";
import useDate from "../../composable/useDate";
import usePost from "../../composable/usePost";
import { useRoute } from "vue-router";

  const store = useStore();
  const route = useRoute();
  const params = route.params.uid;
  const { getFormattedDate } = useDate();
  const { 
    post, getPost, getPostImage,
    canDelete, canRestore, canUpdatePost,
  } = usePost();

  onMounted(async () => {
    await getPost(params);
    await getPostImage(params);
    store.dispatch("hideLoader");
  })
</script>

<template>
  <div class="nk-block">
    <RouterLink :to="{ name: 'Post' }" class="d-flex align-items-center text-dark">
      <vue-feather type="arrow-left" size="20"/>
      <span class="m-1">Go Back</span>
    </RouterLink>

    <div class="col-lg-9 col-12 mx-auto">
      <div class="card card-preview shadow-sm">
        <div class="position-relative">
          <div class="blog-image blog-image-large rounded-top" :style="{ backgroundImage: 'url('+ post.image +')' }"></div>
          <div class="statistics">
            <div class="d-flex justify-content-center align-items-center">
              <vue-feather type="eye" size="25" class="text-white"/>
              <span class="ml-1 fw-medium text-white">{{ post.viewers }}</span>
            </div>
            <div class="d-flex justify-content-center align-items-center">
              <vue-feather type="message-square" size="25" class="text-white"/>
              <span class="ml-1 fw-medium text-white">{{ post.comments }}</span>
            </div>
          </div>
        </div>
        <div class="card-inner">
          <div class="d-flex justify-content-end align-items-center mb-1" v-if="canUpdatePost">
            <RouterLink :to="{ name: 'EditPost', params: {uid: params} }" class="btn btn-sm btn-success">
              <vue-feather type="edit" size="14" />
              <span class="ml-1">Edit</span>
            </RouterLink>
            <button
              v-if="canDelete"
              type="button"
              class="btn btn-sm btn-danger ml-1"
             
            >
              <vue-feather type="trash-2" size="14" />
              <span class="ml-1">Delete</span>
            </button>
            <button
              v-if="canRestore"
              type="button"
              class="btn btn-sm btn-warning ml-1"
              
            >
              <vue-feather type="refresh-ccw" size="14" />
              <span class="ml-1">Restore</span>
            </button>
          </div>
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <h4 class="card-title fw-bold text-primary mb-0">{{ post.title }}</h4>
            <span class="text-muted">
              Date Posted: {{ getFormattedDate(post.created_at) }}
            </span>
          </div>
          <p class="card-text text-justify">{{ post.body }}</p>
        </div>
      </div>
      <!-- comments -->
      <h5 class="d-flex align-items-center my-4">
        <vue-feather type="message-square" size="20" /> <span class="ml-1">Comments:</span>
      </h5>
    </div>
  </div>
</template>
<style scoped>
.statistics {
  position: absolute;
  bottom: 15px;
  left: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
</style>