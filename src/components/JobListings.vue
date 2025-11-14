<script setup>
  import JobListing from '@/components/JobListing.vue'
  import { defineProps, onMounted, computed } from 'vue'
  import { useJobs } from '@/utils/useJobs'
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
  import { useAuth } from '@/auth/auth'

  const props = defineProps({
    isHome : { type: Boolean, default: false },
    showButton: { type: Boolean, default: false },
  })

  const { user, isAuthed } = useAuth()

  
  const { jobs, isLoading, error, fetchJobs } = useJobs()

  onMounted(() => {
    fetchJobs()
  })

  const displayJobs = computed(() => {
  if (props.isHome) {
    return [...jobs.value].sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  // Authenticated → user's jobs, randomized
  if (isAuthed.value && user.value && user.value.id) {
    return jobs.value
      .filter(job => job.owner_id === user.value.id)
  }

  return [...jobs.value].sort(() => 0.5 - Math.random());
});


  console.log(displayJobs);
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 text-center mb-6">{{ isHome ? 'Jobs Listings for Developers' : (['recruiter'].includes(user?.role) ? 'Your Jobs' : 'Jobs')}}</h2>
      <div v-if="isLoading" class="text-center text-gray-500">
        <PulseLoader />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing v-for="job in displayJobs" :key="job.id" :job="job" />
      </div>

      <p v-if="error" class="text-center text-red-600 mt-4">
        Failed to load jobs. Please try again.
      </p>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink to="/jobs" class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700">
      View All Jobs
    </RouterLink>
  </section>
</template>
