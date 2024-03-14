<script setup>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import DataTable from "../DataTable.vue";
import useAdmin from "../../composable/useAdmin";
import useDate from "../../composable/useDate";
import profile from "../../assets/images/administrator.jpg";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const store = useStore();
const searchable = ref(["name"]);
const { admins } = useAdmin();
const { getFormattedDate } = useDate();

onMounted(async () => {
  store.dispatch("hideLoader");
})

const setApprove = async (uid) => {
  const docRef = doc(db, "admins", uid);
  await updateDoc(docRef, {
    verified_at: new Date().getTime(),
  })
}

const setDecline = async (uid) => {
  const docRef = doc(db, "admins", uid);
  await updateDoc(docRef, {
    verified_at: null,
  })
}

</script>

<template>
  <div class="nk-block">
    <data-table
      title="List of Admins"
      :data="admins"
      :searchable="searchable"
      :perPage="15"
    >
      <template v-slot:thead>
        <tr class="nk-tb-item nk-tb-head">
          <th class="nk-tb-col text-left">
            <span class="sub-text">Name</span>
          </th>
          <th class="nk-tb-col">
            <span class="sub-text">College</span>
          </th>
          <th class="nk-tb-col">
            <span class="sub-text">Date Verified</span>
          </th>
          <th class="nk-tb-col">
            <span class="sub-text">Date Registered</span>
          </th>
          <th class="nk-tb-col"></th>
        </tr>
      </template>
      <template v-slot:tbody="slotProps">
        <tr class="nk-tb-item" v-if="slotProps.data.length === 0">
          <td class="nk-tb-col" colspan="5">
            <span class="">No Admins Found</span>
          </td>
        </tr>
        <tr 
          class="nk-tb-item text-left"
          v-for="admin in slotProps.data"
          :key="admin.id"
        >
          <td class="nk-tb-col text-left">
            <div class="user-card">
              <div class="user-avatar d-none d-sm-flex">
                <img :src="profile" alt="Admin Avatar" />
              </div>
              <div class="user-info">
                <span class="tb-lead d-flex align-items-center">
                  {{ admin.name }}
                  <vue-feather type="check-circle" size="15" class="me-25 text-success" v-if="admin.verified_at" />
                </span>
                <span>{{ admin.email }}</span>
              </div>
            </div>
          </td>
          <td class="nk-tb-col text-center">
            <span class="badge badge-outline-primary">
              {{ admin.college }}
            </span>
          </td>
          <td class="nk-tb-col text-center">
            <span class="fw-bolder text-warning">
              {{ admin.verified_at ? getFormattedDate(admin.verified_at) : "Not Yet" }}
            </span>
          </td>
          <td class="nk-tb-col text-center">
            <span class="fw-bolder text-danger">
              {{ getFormattedDate(admin.created_at) }}
            </span>
          </td>
          <td class="nk-tb-col align-middle">
            <button 
              type="button"
              class="btn btn-icon btn-success p-1"
              @click="setApprove(admin.id)"
              v-if="admin.verified_at === null"
            >
              <vue-feather type="check" size="15" />
            </button>
            <button 
              type="button"
              class="btn btn-icon btn-danger p-1 ml-1"
              @click="setDecline(admin.id)"
              v-else
            >
              <vue-feather type="x" size="15" />
            </button>
          </td>
        </tr>
      </template>
    </data-table>
  </div>
</template>