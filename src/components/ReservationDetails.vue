<template>
    <div class="container mt-4">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <h2 class="mb-3">Reservation Details</h2>
        <div class="card mb-3">
          <div class="card-header">
            Reservation
          </div>
          <div class="card-body">
            <h5 class="card-title">Customer Information</h5>
            <p class="card-text">Name: {{ customer.firstName }} {{ customer.lastName }}</p>
            <p class="card-text">Phone: {{ customer.phoneNumber }}</p>
            <p class="card-text">Email: {{ customer.email }}</p>
            <p class="card-text">Address: {{ customer.address }}</p>
          </div>
        </div>
        <div class="card mb-3" v-for="guest in guests" :key="guest.id">
          <div class="card-body">
            <h5 class="card-title">Guest Information</h5>
            <p class="card-text">Name: {{ guest.firstName }} {{ guest.lastName }}</p>
            <p class="card-text">Email: {{ guest.email }}</p>
          </div>
        </div>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="btn btn-primary">Pay Now</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        loading: true,
        reservation: {},
        customer: {},
        guests: []
      };
    },
    mounted() {
        const reservationId = this.$route.params.id;
        this.fetchReservationDetails(reservationId);
    },
    methods: {
      fetchReservationDetails(reservationId) {
        fetch(`http://localhost:8080/reservations/${reservationId}`)
          .then(response => response.json())
          .then(data => {
            this.reservation = data;
            return fetch(`http://localhost:8080/customers/${this.reservation.customerId}`);
          })
          .then(response => response.json())
          .then(data => {
            this.customer = data;
            const guestPromises = this.reservation.guestIds.map(id => fetch(`http://localhost:8080/guests/${id}`).then(response => response.json()));
            return Promise.all(guestPromises);
          })
          .then(guests => {
            this.guests = guests;
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching reservation details:', error);
            this.loading = false;
          });
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  