<script setup>
import { onMounted } from "vue";
import Loader from "./components/Loader.vue";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

onMessage(messaging, (payload) => {
	Notification.requestPermission().then((response) => {
		if (response === "granted") {
			const notification = new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/public/favicon.png',
      });
      setTimeout(notification.close.bind(notification), 5000);
		}else {
			console.log("Permission for notifications denied.");
		}
	})
});

onMounted(() => {
  Notification.requestPermission();
})
</script>

<template>
  <loader />
  <router-view />
</template>
