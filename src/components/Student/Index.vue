<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DataTable from "../DataTable.vue";

const props = defineProps(["students", "title"]);
const searchable = ref(["name"]);
const router = useRouter();

const showStudent = (uid) => {
  router.push({name: 'ShowStudent', params: {uid: uid}});
}
</script>

<template>
  <data-table
    :title="title"
    :data="students"
    :searchable="searchable"
    :perPage="10"
  >
    <template v-slot:thead>
      <tr class="nk-tb-item nk-tb-head">
        <th class="nk-tb-col text-left">
          <span class="sub-text">Name</span>
        </th>
        <th class="nk-tb-col">
          <span class="sub-text">Student No.</span>
        </th>
        <th class="nk-tb-col">
          <span class="sub-text">Gender</span>
        </th>
        <th class="nk-tb-col">
          <span class="sub-text">College</span>
        </th>
        <th class="nk-tb-col">
          <span class="sub-text">Year Level</span>
        </th>
        <th class="nk-tb-col"></th>
      </tr>
    </template>
    <template v-slot:tbody="slotProps">
      <tr class="nk-tb-item" v-if="slotProps.data.length === 0">
        <td class="nk-tb-col" colspan="6">
          <span class="">No Students Found</span>
        </td>
      </tr>
      <tr 
        class="nk-tb-item"
        v-for="student in slotProps.data"
        :key="student.id"
      >
        <td class="nk-tb-col text-left">
          <div class="user-card">
            <div class="user-avatar d-none d-sm-flex">
              <img :src="student.avatar" alt="Male Avatar" />
            </div>
            <div class="user-info">
              <span class="tb-lead">{{ student.name }}</span>
              <span>{{ student.email }}</span>
            </div>
          </div>
        </td>
        <td class="nk-tb-col">
          <span class="fw-bolder">
            {{ student.student_no }}
          </span>
        </td>
        <td class="nk-tb-col">
          <span class="badge badge-warning">{{ student.gender }}</span>
        </td>
        <td class="nk-tb-col">
          <span class="badge badge-danger badge-pill">{{ student.college }}</span>
        </td>
        <td class="nk-tb-col">
          <span>{{ student.year_level }}</span>
        </td>
        <td class="nk-tb-col align-middle">
          <button 
            type="button"
            class="btn btn-icon btn-primary p-1"
           @click="showStudent(student.id)"
          >
            <vue-feather type="eye" size="15" />
          </button>
        </td>
      </tr>
    </template>
  </data-table>
</template>