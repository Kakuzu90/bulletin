<script setup>
import { onMounted, ref, computed } from "vue";
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useStore } from "vuex";
import useDate from "../../composable/useDate";
import usePost from "../../composable/usePost";
import { db } from "../../firebase"
import { useRoute } from "vue-router";
import Comment from "../Post/Comment.vue";
import Write from "../Post/Write.vue";
import Modal from "../Modal.vue";

  const store = useStore();
  const route = useRoute();
  const params = route.params.uid;
  const { getFormattedDate } = useDate();
  const { 
    post, getPost, getPostImage,
    canDelete, canRestore, canUpdatePost,
  } = usePost();

	const whatType = ref(1);
	const comments = ref([]);

	const deletePost = () => {
    whatType.value = 1;
    $('#modalTop').modal('show')
  }

  const restorePost = () => {
    whatType.value = 2;
    $('#modalTop').modal('show')
  }

	const getComments = async () => {
    const colRef = collection(db, 'comments');
    const q = query(colRef, where('post_id', '==', params));
    onSnapshot(q, (querySnapshot) => {
      comments.value = [];
      querySnapshot.forEach(async (snapshot) => {
				if (snapshot.data().student_id) {
					const docRef = doc(db, 'students', snapshot.data().student_id);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists) {
						const tplt = {
							id: snapshot.id,
							std: docSnap.id,
							name: docSnap.data().name,
							gender: docSnap.data().gender,
							token: docSnap.data()._token,
							is_admin: false,
							comment: snapshot.data().comment,
							created_at : snapshot.data().created_at,
						};
						comments.value.push(tplt);
					}
				}
				if (snapshot.data().admin_id) {
					const docRef = doc(db, 'admins', snapshot.data().admin_id);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists) {
						const tplt = {
							id: snapshot.id,
							std: docSnap.id,
							name: docSnap.data().name,
							gender: "admin",
							token: docSnap.data()._token,
							is_admin: true,
							comment: snapshot.data().comment,
							created_at : snapshot.data().created_at,
						};
						comments.value.push(tplt);
					}
				}
        
      })
    })
  }

  const sortComments = computed(() => {
    return comments.value.sort((a, b) => a.created_at - b.created_at);
  })

  onMounted(async () => {
    await getPost(params);
    await getPostImage(params);
		await getComments();
    store.dispatch("hideLoader");
  })
</script>

<template>
	<modal :type="whatType" :uid="params" />
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
							@click="deletePost"
            >
              <vue-feather type="trash-2" size="14" />
              <span class="ml-1">Delete</span>
            </button>
            <button
              v-if="canRestore"
              type="button"
              class="btn btn-sm btn-warning ml-1"
              @click="restorePost"
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

			<div class="nk-block mb-3">
				<comment
					v-for="comment in sortComments"
					:key="comment.id"
					:comment="comment" />
			</div>

			<write :reply-to="{}" ref="textarea" />
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