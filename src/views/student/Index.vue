<script setup>
import AppLayout from "../../components/Layouts/AppLayout.vue";
import Index from "../../components/Student/Index.vue";
import useStudent from "../../composable/useStudent";
import Card2 from "../../components/Cards/Card2.vue";
import { useStore } from "vuex";
import { onMounted } from "vue";

const { students, getFemaleCount, getMaleCount } = useStudent();
const store = useStore();

onMounted(() => {
  store.dispatch("hideLoader");
})

</script>

<template>
  <app-layout>
    <div class="nk-block">
      <div class="row justify-content-center align-items-center mb-5">
        <div class="col-lg-4 col-md-6 col-sm-6 col-12">
          <Card2
            type="Male"
            :total="getMaleCount"
            icon="square"
          />
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 col-12">
          <Card2
            type="Female"
            :total="getFemaleCount"
            icon="triangle"
          />
        </div>
      </div>
      <index title="List of Students" :students="students" />
    </div>
  </app-layout>
</template>