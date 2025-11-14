import { ref, computed } from 'vue'
import axios from 'axios'

const baseUrl = () => localStorage.getItem('mockAPI') || ''

const jobs = ref([])
const byId = ref({})
const isLoadingList = ref(false)
const isLoadingById = ref({})
const errorList = ref(null)
const errorById = ref({})

let listFetchedOnce = false
let inflightList = null
const inflightById = new Map() 

export function useJobs() {
  async function fetchJobs({ force = false } = {}) {
    if (listFetchedOnce && !force) return jobs.value
    if (inflightList) return inflightList

    isLoadingList.value = true
    errorList.value = null

    inflightList = axios.get(`${baseUrl()}/jobs`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : []
        jobs.value = data
        const map = {}
        for (const j of data) map[j.id] = j
        byId.value = { ...byId.value, ...map }
        listFetchedOnce = true
        return jobs.value
      })
      .catch(err => {
        errorList.value = err
        throw err
      })
      .finally(() => {
        isLoadingList.value = false
        inflightList = null
      })

    return inflightList
  }

  async function fetchJob(id, { force = false } = {}) {
    if (!force && byId.value[id]) return byId.value[id]
    if (inflightById.has(id)) return inflightById.get(id)

    isLoadingById.value = { ...isLoadingById.value, [id]: true }
    errorById.value = { ...errorById.value, [id]: null }

    const p = axios.get(`${baseUrl()}/jobs/${id}`)
      .then(res => {
        byId.value = { ...byId.value, [id]: res.data }
        // also update list cache if it exists there
        const idx = jobs.value.findIndex(j => j.id == id)
        if (idx !== -1) {
          const copy = jobs.value.slice()
          copy[idx] = res.data
          jobs.value = copy
        }
        return res.data
      })
      .catch(err => {
        errorById.value = { ...errorById.value, [id]: err }
        throw err
      })
      .finally(() => {
        isLoadingById.value = { ...isLoadingById.value, [id]: false }
        inflightById.delete(id)
      })

    inflightById.set(id, p)
    return p
  }

  async function createJob(payload) {
    const res = await axios.post(`${baseUrl()}/jobs`, payload)
    const created = res.data
    byId.value = { ...byId.value, [created.id]: created }
    jobs.value = [created, ...jobs.value]
    return created
  }

  async function updateJob(id, payload) {
    const res = await axios.put(`${baseUrl()}/jobs/${id}`, payload)
    const updated = res.data
    // Update item cache
    byId.value = { ...byId.value, [id]: updated }
    // Update list cache if present
    const idx = jobs.value.findIndex(j => j.id == id)
    if (idx !== -1) {
      const copy = jobs.value.slice()
      copy[idx] = updated
      jobs.value = copy
    }
    return updated
  }

  async function deleteJob(id) {
    await axios.delete(`${baseUrl()}/jobs/${id}`)
    const { [id]: _, ...rest } = byId.value
    byId.value = rest
    jobs.value = jobs.value.filter(j => j.id != id)
    return true
  }

  function invalidateList() {
    listFetchedOnce = false
  }

  const limited = (limit) => computed(() => (limit ? jobs.value.slice(0, limit) : jobs.value))

  return {
    jobs, byId, isLoadingList, isLoadingById, errorList, errorById,
    fetchJobs, fetchJob, createJob, updateJob, deleteJob, invalidateList,
    limited,
  }
}
