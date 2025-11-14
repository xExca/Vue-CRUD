<script setup>
import { defineProps, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  job: { type: Object, required: true }
})

const showFullDescription = ref(false)
const handleShowMore = () => (showFullDescription.value = !showFullDescription.value)

const truncatedDescription = computed(() => {
  const description = props.job.description || ''
  return description.length > 100 ? description.slice(0, 100) + '...' : description
})

const enter = (el) => {
  el.style.height = '0'
  el.style.overflow = 'hidden'
  el.offsetHeight
  el.style.transition = 'height 300ms ease-out 0s'
  el.style.height = el.scrollHeight + 'px'
}

const afterEnter = (el) => {
  el.style.height = 'auto'
  el.style.overflow = ''        
  el.style.transition = ''
}

const leave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.overflow = 'hidden'
  el.offsetHeight
  el.style.transition = 'height 300ms ease-out 0s'
  el.style.height = '0'
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md flex flex-col h-full">
    <div class="p-4 flex flex-col grow">
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ job.type }}</div>
        <h3 class="text-xl font-bold">{{ job.title }}</h3>
      </div>

      <div class="mb-5 grow">
        <transition @enter="enter" @after-enter="afterEnter" @leave="leave">
          <div v-show="showFullDescription" class="overflow-hidden">
            <p>{{ job.description }}</p>
          </div>
        </transition>

        <transition @enter="enter" @after-enter="afterEnter" @leave="leave">
          <div v-show="!showFullDescription" class="overflow-hidden">
            <p>{{ truncatedDescription }}</p>
          </div>
        </transition>

        <div class="mt-2 flex justify-end">
          <button
            @click="handleShowMore"
            class="text-blue-600 text-sm font-medium cursor-pointer"
          >
            {{ showFullDescription ? 'Show Less' : 'Show More' }}
          </button>
        </div>
      </div>

      <h3 class="text-green-500 mb-2">{{ job.salary }} / Year</h3>
      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-map-marker text-lg"></i>
          {{ job.location }}
        </div>
        <RouterLink
          :to="'/jobs/' + job.id"
          class="h-9 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
          Read More
        </RouterLink>
      </div>
    </div>
  </div>
</template>