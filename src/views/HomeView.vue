<script setup>
  import { useAuth } from '@/auth/auth';
  import Hero from '@/components/Hero.vue';
  import HomeCards from '@/components/HomeCards.vue';
  import JobListings from '@/components/JobListings.vue';
  const role = useAuth().user.value?.role
  
</script>

<template>
  <Hero
    title="Vue Jobs" 
  />
  <HomeCards :role="role"/>
  <JobListings :showButton="false" :isHome=true />
</template>