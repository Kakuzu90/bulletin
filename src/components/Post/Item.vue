<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useDate from '../../composable/useDate';
import usePost from '../../composable/usePost';
import { useCharactersLimit } from "../../composable/useCharactersLimit"

  const router = useRouter();
  const props = defineProps(["item"]);
  const  { getFormattedDate } = useDate();
  const { getPostImage, post } = usePost();
  const formattedDate = getFormattedDate(props.item.created_at);

  onMounted(async () => {
    await getPostImage(props.item.id);
  })

  const limitedBody = computed(() => {
    return useCharactersLimit(props.item.body, 300);
  })

  const titleColor = computed(() => {
    if (props.item.deleted_at !== null) {
      return "text-danger";
    }else {
      return "text-primary";
    }
  })

  const showPost = () => {
    router.push({name: "ShowPost", params:{uid: props.item.id}});
  }

</script>

<template>
  <div class="card card-preview shadow-sm cursor-pointer" @click="showPost">
    <div class="blog-image blog-image-normal rounded-top" :style="{ backgroundImage: 'url('+ post.image +')' }"></div>
    <div class="card-inner">
      <h6 class="card-title fw-bold" :class="titleColor">
        {{ item.title }}
      </h6>
      <p class="text-justify">{{ limitedBody }}</p>
    </div>
    <div class="card-footer bg-transparent d-flex justify-content-between align-items-center border-top text-muted">
      <div class="d-flex g-2">
        <div class="d-flex align-items-center">
          <vue-feather type="eye" size="14" class="text-primary" />
          <span class="me-25 fs-12px">{{ item.viewers }}</span>
        </div>
        <div class="d-flex align-items-center">
          <vue-feather type="message-square" size="14" class="text-primary" />
          <span class="me-25 fs-12px">{{ item.comments }}</span>
        </div>
      </div>
      <span class="fs-12px">Date Posted: {{ formattedDate }}</span>
    </div>
  </div>
</template>