<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import AppLayout from "../components/Layouts/AppLayout.vue";
import Index from "../components/Student/Index.vue";
import Card1 from "../components/Cards/Card1.vue";
import Card2 from "../components/Cards/Card2.vue"
import usePost from "../composable/usePost";
import useStudent from "../composable/useStudent";
import useAdmin from '../composable/useAdmin';
import useAuth from '../composable/useAuth';

const store = useStore();
const { user } = useAuth();
const { postTotal } = usePost();
const { studentTotal, unverified } = useStudent();
const { adminTotal } = useAdmin();
const searchable = ref(["name"]);

onMounted(() => {
  store.dispatch("hideLoader");
})
</script>

<template>
  <app-layout>
    <div class="nk-block nk-block-lg">
      <div class="row justify-content-center align-items-center g-4">
        <div class="col-lg-6">
          <card-1 />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 col-12">
          <card-2
          type="Posts"
          :total="postTotal"
          icon="image"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 col-12">
          <card-2
          type="Students"
          :total="studentTotal"
          icon="users"
          />
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 col-12" v-if="user.college === '*'">
          <card-2
          type="Admins"
          :total="adminTotal"
          icon="user-check"
          />
        </div>
      </div>
    </div>
    <div class="nk-block">
      <index title="List of New Students" :students="unverified" />
    </div>
  </app-layout>
</template>