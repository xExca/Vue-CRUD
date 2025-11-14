<script setup>
  import { RouterLink, useRoute } from 'vue-router'
  import logo from '@/assets/img/logo.png'
  import { useAuth, logout } from '@/auth/auth'
  import { computed, ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
  import { data } from '@/data.js'
  import { useToast } from 'vue-toastification'
  import SettingsModal  from '@/components/SettingsModal.vue'

  const isToggleOpen = ref(false)
  const togglesetting = ref(false)
  const mockAPI = ref('')
  const modalInitialFocus = ref(null)
  const route = useRoute()
  const configReady = ref(false)
  const { user, isAuthed } = useAuth()


  const canAddJob = computed(() => {
    return ['admin', 'recruiter'].includes(String(user.value?.role || '').toLowerCase().trim());
    
  })

  const isActiveRoute = (routePath) => route.path === routePath

  const readConfig = () => {
    const saved = localStorage.getItem('mockAPI') || ''
    mockAPI.value = saved
    configReady.value = Boolean(saved)
  }

  const toggleDropDown = () => {
    isToggleOpen.value = !isToggleOpen.value
  }

  const handleLogout = () => {
    logout()
    isToggleOpen.value = false
  }

  const openSettings = async () => {
    togglesetting.value = true
    await nextTick()
    modalInitialFocus.value?.focus()
  }

  const closeSettings = () => {
    togglesetting.value = false
  }

  const handleSetting = () => {
    openSettings()
  }

  const onKeydown = (e) => {
    if (e.key === 'Escape' && togglesetting.value && configReady.value) closeSettings()
  }

  onMounted(() => {
    readConfig()
    if (!configReady.value) openSettings()
    window.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
  })
</script>

<template>
  <nav class="bg-green-700 border-b border-green-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <RouterLink class="flex shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2">Vue Jobs</span>
          </RouterLink>
          
          <div class="md:ml-auto">
            <div class="flex space-x-2 items-center">
              <button
                type="button"
                class="px-3 py-2 text-center justify-center cursor-pointer"
                @click="handleSetting"
                :aria-disabled="!configReady"
                :title="!configReady ? 'Please configure Mock API first' : 'Settings'"
              >
                <i class="pi pi-cog text-lg text-white"></i>
              </button>
              <RouterLink
                to="/"
                :class="[
                  'text-white','rounded-md','px-3','py-2',
                  isActiveRoute('/') ? 'bg-green-900' : 'hover:bg-gray-900','hover:text-white',
                  !configReady ? 'pointer-events-none opacity-50' : ''
                ]"
                :tabindex="configReady ? 0 : -1"
              >Home</RouterLink>

              <RouterLink
                to="/jobs"
                :class="[
                  'text-white','rounded-md','px-3','py-2',
                  isActiveRoute('/jobs') ? 'bg-green-900' : 'hover:bg-gray-900','hover:text-white',
                  !configReady ? 'pointer-events-none opacity-50' : ''
                ]"
                :tabindex="configReady ? 0 : -1"
              >Jobs</RouterLink>

              <template v-if="isAuthed">
                <RouterLink
                  v-if="canAddJob"
                  to="/jobs/add"
                  :class="[
                    'text-white','rounded-md','px-3','py-2',
                    isActiveRoute('/jobs/add') ? 'bg-green-900' : 'hover:bg-gray-900','hover:text-white',
                    !configReady ? 'pointer-events-none opacity-50' : ''
                  ]"
                  :tabindex="configReady ? 0 : -1"
                >Add Job</RouterLink>

                <div class="relative inline-block text-left" :class="!configReady ? 'pointer-events-none opacity-50' : ''">
                  <div
                    class="text-white px-3 py-2 cursor-pointer"
                    @click="toggleDropDown"
                  >
                    Hello, {{ user.name }}
                  </div>
                  
                  <div
                    v-if="isToggleOpen"
                    class="absolute left-3 top-10 mt-0 bg-white text-gray-800 shadow-md rounded overflow-hidden"
                  >
                    <p
                      @click="handleLogout"
                      class="px-3 py-1 cursor-pointer hover:bg-gray-200"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              </template>

              <RouterLink
                v-else
                to="/login"
                :class="[
                  'text-white','rounded-md','px-3','py-2',
                  isActiveRoute('/login') ? 'bg-green-900' : 'hover:bg-gray-900','hover:text-white',
                  !configReady ? 'pointer-events-none opacity-50' : ''
                ]"
                :tabindex="configReady ? 0 : -1"
              >Login</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <SettingsModal
    :open="togglesetting"
    :focusRef="modalInitialFocus"
    @close="closeSettings"
  />
</template>