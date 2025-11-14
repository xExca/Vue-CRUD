<script setup>
  import logo from '@/assets/img/logo.png';
  import { useToast } from 'vue-toastification';
  import { reactive, ref } from 'vue';
  import { login } from '@/auth/auth.js';
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const error = ref('');
  const toast = useToast();

  const payload = reactive({
    username: 'admin',
    password: 'Password@123',
  });

  const safeRedirect = (val) => {
    if (typeof val !== 'string') return '/';
    return val.startsWith('/') && !val.startsWith('//') ? val : '/';
  };
  

const handleSubmit = async () => {
  error.value = ''
  try {
    const { username, password } = payload

    const result = await login(username, password)

    console.log('Status:', result.status) 

    if (result.status === 200) {
      const target = safeRedirect(route.query.redirect);
      router.replace(target)
    }
  } catch (e) {
    toast.error(e.message || 'Invalid username or password.')
    console.error('Login Error:', e)
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" :src="logo" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" method="POST" @submit.prevent="handleSubmit">
        <div>
          <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
          <div class="mt-2">
            <input v-model="payload.username" type="text" name="username" id="username" required class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-[1px] -outline-offset-1 outline-gray-500 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-gray-800 hover:text-green-300">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="payload.password" type="password" name="password" id="password" required class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-[1px] -outline-offset-1 outline-gray-500 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-500 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>
