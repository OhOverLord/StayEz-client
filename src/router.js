import { createRouter, createWebHistory } from 'vue-router'
import Hotels from './components/Hotels.vue'
import HotelDetails from './components/HotelDetails.vue'

const routes = [
  { path: '/', component: Hotels },
  { path: '/hotel/:id', component: HotelDetails, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router