import { createRouter, createWebHistory } from 'vue-router'
import Hotels from './components/Hotels.vue'
import HotelDetails from './components/HotelDetails.vue'
import RoomReservation from './components/RoomReservation.vue'
import ReservationDetails from './components/ReservationDetails.vue'
import NotFound from './components/NotFound.vue'

const routes = [
  { path: '/', component: Hotels },
  { path: '/hotel/:id', component: HotelDetails, props: true },
  { path: '/reserve/:id', component: RoomReservation, props: true },
  { path: '/reservation-details/:id', component: ReservationDetails, props: true },
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router