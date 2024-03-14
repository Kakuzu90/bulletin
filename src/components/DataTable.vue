<script setup>
import { computed, ref } from "vue";

const props = defineProps(["title", "data", "searchable", "perPage"]);
const searchQuery = ref('');
const currentPage = ref(1);

const filteredData = computed(() => {
  if (!searchQuery.value) {
    return props.data;
  }else {
    currentPage.value = 1;
    const term = searchQuery.value.toLowerCase();
    return props.data.filter(item => {
      return props.searchable.some(key => {
        return String(item[key]).toLowerCase().includes(term);
      });
    });
  }
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.perPage;
  const end = start + props.perPage;
  return filteredData.value.slice(start, end);
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.perPage);
})

const displayedPages = computed(() => {
  const numPages = Math.min(5, totalPages.value);
  const middlePage = Math.ceil(numPages / 2);
  let startPge = Math.max(currentPage.value - middlePage, 1);
  if (startPge + numPages > totalPages.value) {
    startPge = totalPages.value - numPages + 1;
  }
  return Array.from({length: numPages}, (_, i) => startPge + i);
})

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * props.perPage + 1;
  const end = Math.min(start + props.perPage - 1, filteredData.value.length);
  return `${start} - ${end} of ${filteredData.value.length}`;
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

const gotoPage = (page) => {
  currentPage.value = page;
}

</script>

<template>
  <div class="card card-preview shadow-sm">
    <div class="card-inner">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-4">
        <h5 class="card-title mb-0">{{ title }}</h5>
        <div class="d-flex justify-content-center align-items-center">
          <div class="form-control-wrap ml-1">
            <div class="form-icon form-icon-right">
              <vue-feather type="search" size="15" />
            </div>
            <input type="text" class="form-control" v-model="searchQuery"  placeholder="Search here..." />
          </div>
        </div>
      </div>

      <div class="table-responsive-sm">
        <table class="nk-tb-list nk-tb-ulist text-center">
          <thead>
            <slot name="thead"></slot>
          </thead>
          <tbody>
            <slot name="tbody" :data="paginatedData"></slot>
          </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center mt-4">
          <ul class="pagination">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="prevPage">Prev</a>
            </li>
            <li v-for="pageNumber in displayedPages" :key="pageNumber" class="page-item" :class="{ 'active': pageNumber === currentPage }">
              <a class="page-link" href="#" @click.prevent="gotoPage(pageNumber)">{{ pageNumber }}</a>
            </li>
            <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
            </li>
          </ul>
          <span class="text-dark">{{ paginationInfo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>