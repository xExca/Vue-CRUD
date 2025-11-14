<script setup>
import mockapi from '@/assets/img/mockapi.png'
import mocklink from '@/assets/img/mocklink.png'
import mockresource from '@/assets/img/mockresource.png'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import { data } from '@/data.js'

const props = defineProps({
  open: { type: Boolean, required: true },   // from Navbar
  focusRef: { type: Object, default: null }, // parent close-button focus target
})
const emit = defineEmits(['close'])

const toast = useToast()

const step = ref(1)
const mockAPI = ref('')
const errorMsg = ref('')
const copiedMsg = ref('')

const closeBtn = ref(null)
watch(() => props.open, async (val) => {
  if (val) {
    const saved = localStorage.getItem('mockAPI') || ''
    mockAPI.value = saved
    step.value = saved ? 2 : 1

    await nextTick()
    if (props.focusRef) props.focusRef.value = closeBtn.value
  }
})

const onKeydown = (e) => {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const nextStep = () => (step.value = 2)
const prevStep = () => (step.value = 1)

const copyToClipboard = async (type) => {
  const t = String(type).toLowerCase()
  const text = t === 'jobs' ? JSON.stringify(data.jobs, null, 2)
                            : JSON.stringify(data.users, null, 2)
  try {
    await navigator.clipboard.writeText(text)
    copiedMsg.value = `${t === 'jobs' ? 'Jobs' : 'Users'} dataset copied to clipboard!`
    toast.success(copiedMsg.value)
  } catch {
    copiedMsg.value = 'Failed to copy!'
    toast.error(copiedMsg.value)
  } finally {
    setTimeout(() => (copiedMsg.value = ''), 2500)
  }
}

const validateUrl = (value) => {
  try {
    const url = new URL(value)
    const validProtocol = ['http:', 'https:'].includes(url.protocol)
    const validDomain = url.hostname.endsWith('mockapi.io')
    return validProtocol && validDomain
  } catch {
    return false
  }
}

const handleSaveSettings = () => {
  errorMsg.value = ''
  if (!mockAPI.value || !validateUrl(mockAPI.value)) {
    errorMsg.value = 'Please enter a valid http(s) URL.'
    return
  }
  localStorage.setItem('mockAPI', mockAPI.value)
  window.location.reload()
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade" appear>
      <div v-if="open" class="fixed inset-0 z-1000 flex items-center justify-center bg-black/50"
           aria-labelledby="mockapi-tutorial" role="dialog" aria-modal="true">
        <div class="relative z-10 rounded-lg bg-white shadow-lg mx-4 max-w-[75%]"
             :class="step === 1 ? 'w-[90%] h-[90vh]' : 'w-[40%] h-[40vh]'" @click.stop>
          <div class="flex h-full flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between border-b px-5 py-3">
              <h2 id="mockapi-tutorial" class="text-lg font-semibold">
                {{ step === 1 ? 'Introduction to MockAPI' : 'Connect Your MockAPI Project' }}
              </h2>
              <button class="px-2 py-1 text-red-900 font-bold hover:text-gray-700"
                      @click="$emit('close')" ref="closeBtn" aria-label="Close">✕</button>
            </div>

            <!-- Body -->
            <div class="flex">
              <div v-if="step === 1" class="px-6 py-6 space-y-3">
                <p class="text-gray-700">
                  MockAPI.io is a free online service that provides fake RESTful APIs for testing and prototyping front-end projects.
                </p>

                <h3 class="text-md font-semibold text-gray-800">Getting Started:</h3>
                <ol class="list-decimal list-inside text-gray-700 space-y-1">
                  <li>Go to <a href="https://mockapi.io" target="_blank" class="text-green-700 underline">mockapi.io</a> and sign up.</li>
                  <li>Create a new project, then click <strong>New Resource</strong>.</li>
                  <li>
                    Create two resources:
                    <code>Jobs</code> <span class="pi pi-clipboard font-bold cursor-pointer" @click="copyToClipboard('Jobs')"></span>
                    and
                    <code>Users</code> <span class="pi pi-clipboard font-bold cursor-pointer" @click="copyToClipboard('Users')"></span>.
                  </li>
                  <li>Copy your base URL (e.g. <code>https://yourkey.mockapi.io/api</code>).</li>
                </ol>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-3 flex flex-col justify-between rounded-lg border border-gray-300 bg-gray-50">
                    <p class="mt-2 text-sm text-gray-600">1) Sign up / Dashboard</p>
                    <img class="w-full h-56 object-contain rounded-md" :src="mockapi" alt="MockAPI dashboard example" />
                  </div>
                  <div class="flex flex-col justify-between gap-2">
                    <div class="rounded-lg border border-gray-300 bg-gray-50 p-3">
                      <p class="mt-2 text-sm text-gray-600">2) Creating the resource in your project</p>
                      <img class="w-full object-contain rounded-md" :src="mockresource" alt="Create resources example" />
                    </div>
                    <div class="rounded-lg border border-gray-300 bg-gray-50 p-3">
                      <p class="mt-2 text-sm text-gray-600">3) Copy your unique project link</p>
                      <img class="w-full object-contain rounded-md" :src="mocklink" alt="Copy project key example" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2 -->
              <div v-else class="px-6 py-3 space-y-4 w-full">
                <p class="text-gray-700">
                  Enter your MockAPI base URL below (e.g. <code>https://yourkey.mockapi.io/api-prefix</code>).
                </p>

                <label class="text-sm font-medium mb-5">MockAPI Link <span class="text-red-600">*</span></label>
                <input v-model.trim="mockAPI" type="text" placeholder="https://yourkey.mockapi.io/api"
                       class="border rounded w-full px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring focus:ring-green-500"
                       :aria-invalid="!!errorMsg" />
                <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
              </div>
            </div>

            <div class="mt-auto sticky bottom-0 rounded bg-white border-t px-6 py-4">
              <div class="flex" :class="step === 1 ? 'justify-end' : 'justify-between'">
                <template v-if="step === 1">
                  <button @click="nextStep" class="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 cursor-pointer">
                    Let’s Get Started
                  </button>
                </template>
                <template v-else>
                  <button @click="prevStep" class="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100 cursor-pointer">
                    Back to Tutorial
                  </button>
                  <button @click="handleSaveSettings" class="px-4 py-2 rounded text-white bg-green-700 hover:bg-green-800 cursor-pointer">
                    Save
                  </button>
                </template>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
