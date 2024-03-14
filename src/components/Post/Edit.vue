<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import usePost from '../../composable/usePost';

  const loader = useStore();
  const route = useRoute();
  const {
    form, errors, submit, update, post, getPost,
    cardBackground, handleUpload, resetUploadV2, getPostImage
  } = usePost(route.params.uid);

  const clearErr = (key) => delete errors.value[`${key}`];

  onMounted(async () => {
    await getPost(route.params.uid);
    await getPostImage(route.params.uid);
    cardBackground.value = post.value.image;
    loader.dispatch("hideLoader");
  })
</script>

<template>
  <div class="nk-block">
    <RouterLink :to="{ name: 'ShowPost', params: {uid: route.params.uid} }" class="d-flex align-items-center text-dark">
      <vue-feather type="arrow-left" size="20"/>
      <span class="m-1">Go Back</span>
    </RouterLink>
    <div class="col-lg-8 col-12 mx-auto">
      <div class="card card-preview shadow-sm">
        <div class="blog-image blog-image-large rounded-top" :style="{ backgroundImage: 'url('+ cardBackground +')' }"></div>
        <div class="card-inner">
          <div class="d-flex align-items-center mb-2" v-if="form.name">
            <span class="badge badge-light badge-pill badge-md">{{ form.name }}</span>
            <vue-feather type="x" size="18" class="text-danger cursor-pointer" @click="resetUploadV2" />
          </div>
          <label for="photo" class="btn btn-primary mb-0">
            <vue-feather type="image" size="14" />
            <span class="ml-1">Upload Image</span>
            <input type="file" hidden accept="image/*" id="photo" @change="handleUpload">
          </label>

          <div class="mb-2 mt-2">
            <label class="form-label">
              Title: <span class="text-danger fw-bolder">*</span>
            </label>
            <input type="text" class="form-control" :class="{'error' : errors.title}" @input="clearErr('title')" placeholder="Enter your title here" v-model="form.title" />
            <span class="text-danger fs-12px" v-if="errors.title">
              {{ errors.title }}
            </span>
          </div>
          <div class="mb-2">
            <label class="form-label">
              Body: <span class="text-danger fw-bolder">*</span>
            </label>
            <textarea class="form-control" :class="{'error' : errors.body}" @input="clearErr('body')" placeholder="Enter your body here..." rows="10" v-model="form.body"></textarea>
            <span class="text-danger fs-12px" v-if="errors.body">
              {{ errors.body }}
            </span>
          </div>

          <div class="d-flex justify-content-end align-items-center">
            <button 
              type="button"
              class="btn btn-primary"
              @click="update(route.params.uid)"
              :disabled="submit"
              >
              <div v-if="submit">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Loading...</span>
              </div>
              <div class="d-flex align-items-center"  v-else>
                <vue-feather type="save" size="15" />
                <span class="ml-1">Update Post</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>