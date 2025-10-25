<script setup>
import JobListing from '@/components/JobListing.vue';
import { reactive, ref, defineProps, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

const jobs = ref([]);

defineProps({
  limit: {
    type: Number,
    default: 3
  },
  showButton: {
    type: Boolean,
    default: false
  }
});

const state = reactive({
  jobs: [],
  isLoading: true,
});

onMounted(async () => {
  try {
    await axios.get('http://localhost:8080/jobs')
    .then((response) => {
      state.jobs = response.data
    }).catch((error) => {
      console.error(error)
    }).finally(() => {
      state.isLoading = false
    })
  }catch (error){
    console.error(error)
  }
})
</script>


<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 text-center mb-6">Job Listings</h2>
      <div v-if="state.isLoading === true" class="text-center text-gray-500">
        <PulseLoader />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing v-for="job in state.jobs.slice(0, limit || state.jobs.length)" :key="job.id" :job="job" />
      </div>  
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      to="/jobs"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
    >
      View All Jobs
    </RouterLink>
  </section>
 
</template>
