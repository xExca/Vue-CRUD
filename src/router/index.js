import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import JobsView from '@/views/JobsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import JobView from '@/views/JobView.vue'
import AddJobView from '@/views/AddJobView.vue'
import EditJobView from '@/views/EditJobView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuth } from '@/auth/auth' 

function allowsRole(to, role) {
  const need = to.meta?.roles
  if (!need || need.length === 0) return true
  return !!role && need.includes(role)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',            
      name: 'home',      
      component: HomeView,  meta: { public: true } 
    },
    { 
      path: '/login',       
      name: 'login',     
      component: LoginView, meta: { public: true } 
    },
    { 
      path: '/jobs',        
      name: 'jobs',      
      component: JobsView,  
      meta: { public: true } 
    },
    { path: '/jobs/:id',    
      name: 'job',       
      component: JobView,   
      meta: { roles: ['admin','recruiter'] } 
  },
    { path: '/jobs/add',    
      name: 'jobs-add',  
      component: AddJobView,
      meta: { roles: ['admin','recruiter'] } 
  },
    { 
      path: '/jobs/edit/:id', 
      name: 'jobs-edit', 
      component: EditJobView, 
      meta: { roles: ['admin','recruiter'] } 
  },
    { 
      path: '/:catchAll(.*)', 
      name: 'not-found', 
      component: NotFoundView, 
      meta: { public: true } 
  },
  ]
})

const { user, isAuthed } = useAuth()

router.beforeEach((to) => {
  if (to.meta?.public) {
    if (to.name === 'login' && isAuthed.value) {
      return { name: 'home' }
    }
    return true
  }

  if (!isAuthed.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const role = user.value?.role
  if (!allowsRole(to, role)) {
    return { name: 'home' }
  }

  return true
})

export default router
