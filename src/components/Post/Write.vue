<script setup>
import { addDoc, collection, updateDoc, doc, getDoc } from 'firebase/firestore';
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import useNotification from '../../composable/useNotification';
import useAuth from '../../composable/useAuth';
import { db } from "../../firebase"


	const emits = defineEmits(['removeReply']);
	const props = defineProps(['replyTo']);
	const route = useRoute();
	const params = route.params.uid;
	const withReply = ref(false);
	const user = ref(null);
	const textarea = ref('');
	const { getUser } = useAuth();

	watchEffect(() => {
		if (Object.keys(props.replyTo).length > 1) {
			withReply.value = true;
		}else {
			withReply.value = false;
		}
	})

	const removeReply = () => {
		emits('removeReply', {});
	}

	const submit = async () => {
		if (Object.keys(props.replyTo).length > 1) {
			const colRef = collection(db, 'comments', props.replyTo.commentID, 'replies');
			await addDoc(colRef, {
				message: textarea.value,
				admin_id: user.value.id,
				created_at: new Date().getTime(),
			})

			if (props.replyTo.ownerID != user.value.id) {
				const send = useNotification();
				const payload = {
					notification : {
						title : user.value.name + " replied to your comment",
						body : textarea.value.substring(0, 20),
					},
					data: {
						postID : params
					},
					to : props.replyTo.token
				};

				send(payload)
				const notificationPayload = ref({
					title: user.value.name + " replied to your comment",
					body: textarea.value.substring(0, 50),
					post_id: params,
					created_at: new Date().getTime(),
				});

				if (!props.replyTo.is_admin) {
					notificationPayload.value.student_id = props.replyTo.ownerID;
					await addDoc(collection(db, 'notifications'), notificationPayload.value);
				}
			}
		}else {
			const colRef = collection(db, 'comments');
			await addDoc(colRef, {
				comment: textarea.value,
				post_id: params,
				admin_id: user.value.id,
				created_at: new Date().getTime(),
			});
		}
	
		const postRef = doc(db, 'posts', params);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists) {
      const count = postSnap.data().comments + 1;
      await updateDoc(postRef, {comments: count});
    }
    textarea.value = '';
	}

	onMounted(async () => {
		user.value = (await getUser()).value;
	})
</script>

<template>
	<div
    v-if="withReply" 
    class="bg-primary-dim d-flex justify-content-between align-items-center p-1 rounded"
  >
    <div class="d-flex justify-content-start align-items-center">
      <p class="mb-0 fw-bolder text-danger fs-12px">Replying to: </p>
      <span class="me-25 badge badge-outline-primary">{{ replyTo.name }}</span>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <vue-feather class="cursor-pointer" type="x" size="14" @click="removeReply" />
    </div>
  </div>
	<textarea v-model="textarea" class="form-control" placeholder="Your message..." @keyup.enter="submit"></textarea>
	<div class="d-flex justify-content-end align-items-center mt-2">
    <button type="button" class="btn btn-primary" 
      :disabled="textarea == ''"
      @click="submit"
    >
      <vue-feather type="send" size="14" />
      <span class="ml-1">Comment</span>
    </button>
  </div>
</template>