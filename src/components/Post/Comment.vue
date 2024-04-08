<script setup>
import Write from './Write.vue';
import profile from '../../assets/images/administrator.jpg';
import male from '../../assets/images/male.jpg';
import female from '../../assets/images/female.jpg';
import { computed, onMounted, ref } from 'vue';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

  const props = defineProps(['comment']);
  const replies = ref([]);
  const isVisible = ref(false);
  const sendTo = ref({
    commentID: props.comment.id,
  });

  const avatar = computed(() => {
    if (props.comment.gender == "Male") {
      return male;
    }else if (props.comment.gender == "Female") {
      return female;
    }else {
      return profile;
    }
  })

  const getReplies = async () => {
    const repliesCollection = collection(db, 'comments', props.comment.id, 'replies');
    onSnapshot(repliesCollection, (querySnapshot) => {
      replies.value = [];
      querySnapshot.forEach(async (reply) => {
				if (reply.data().student_id) {
					const docRef = doc(db, 'students', reply.data().student_id);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists) {
						const tplt = {
							id: reply.id,
							std: docSnap.id,
							name: docSnap.data().name,
							gender: docSnap.data().gender,
							comment: reply.data().message,
							token: docSnap.data()._token,
							created_at : reply.data().created_at,
						};
						replies.value.push(tplt);
					}
				}
        if (reply.data().admin_id) {
					const docRef = doc(db, 'admins', reply.data().admin_id);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists) {
						const tplt = {
							id: reply.id,
							std: docSnap.id,
							name: docSnap.data().name,
							gender: "admin",
							comment: reply.data().message,
							token: docSnap.data()._token,
							created_at : reply.data().created_at,
						};
						replies.value.push(tplt);
					}
				}
      });
    })
  }

  const sortReplies = computed(() => {
    return replies.value.sort((a, b) => a.created_at - b.created_at);
  });

  const viewReplies = () => {
    if(isVisible) {
      sendTo.value = {};
      sendTo.value.commentID = props.comment.id;
    }
    isVisible.value = !isVisible.value;
  }

  const formattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
 }

 const replyAvatar = (gender) => {
  if (gender == "Male") {
      return male;
    }else if (gender == "Female") {
      return female;
    }else {
      return profile;
    }
 }

 const toggleRepliesText = computed(() => {
    const status = sortReplies.value.length > 1 ? "replies..." : "reply";
    if (!isVisible.value) {
      return "View " + sortReplies.value.length + " " + status;
    }else {
      return "Hide Reply";
    }
 })

 const replyClick = () => {
  isVisible.value = true;
  sendTo.value.ownerID = props.comment.std;
  sendTo.value.token = props.comment.token;
  sendTo.value.name = props.comment.name;
	sendTo.value.is_admin = props.comment.is_admin;
 }

 const replyToReply = (reply) => {
  sendTo.value.ownerID = reply.std;
  sendTo.value.token = reply.token;
  sendTo.value.name = reply.name;
 }

 const onRemoveReply = (data) => {
  sendTo.value = data;
  sendTo.value.commentID = props.comment.id;
 }

  onMounted(() => {
    getReplies();
  });

</script>

<template>
  <div class="row g-0">
    <div class="col-1">
      <div class="user-avatar">
        <img :src="avatar" alt="Profile Avatar" />
      </div>
    </div>
    <div class="col-11 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fs-15px">{{ comment.name }}</h6>
        <span>{{ formattedDate(comment.created_at) }}</span>
      </div>
      <p class="mb-1">
       {{ comment.comment }}
      </p>
      <span
        class="text-dark fw-bolder cursor-pointer"
        @click="replyClick"
      >
        Reply
      </span>
      <p 
        class="text-dark mb-0 mt-1 fw-bold cursor-pointer"
        v-if="sortReplies.length > 0"
        @click="viewReplies"
      >
        {{ toggleRepliesText }}
      </p>
      <div
        v-if="isVisible"
      >
      <hr>
      <div
        class="row g-0"
        v-for="reply in sortReplies"
        :key="reply.id"
      >
        <div class="col-1">
          <div class="user-avatar">
            <img :src="replyAvatar(reply.gender)" alt="Profile Avatar" />
          </div>
        </div>
        <div class="col-11 mb-1">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fs-15px">{{ reply.name }}</h6>
            <span>{{ formattedDate(reply.created_at) }}</span>
          </div>
          <p class="mb-1">
          {{ reply.comment }}
          </p>
          <span
            class="text-dark fw-bolder cursor-pointer"
            @click="replyToReply(reply)"
          >
            Reply
          </span>
        </div>
      </div>
      
      <write 
        :reply-to="sendTo" 
        ref="textarea"
        @remove-reply="onRemoveReply"
      />

      </div>
    </div>
  </div>
</template>