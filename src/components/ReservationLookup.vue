<template>
    <div class="container mt-4">
      <h2 class="mb-3">Look Up Reservations</h2>
      <form @submit.prevent="fetchCustomerReservations">
        <div class="mb-3">
          <label for="customerEmail" class="form-label">Your Email</label>
          <input type="email" id="customerEmail" class="form-control" v-model="customerEmail" placeholder="Enter your email" required>
        </div>
        <button type="submit" class="btn btn-primary">Search Reservations</button>
      </form>
  
      <div v-if="loading" class="text-center mt-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
  
      <div v-else>
        <h3 class="mt-4">Your Reservations</h3>
        <div v-if="reservations.length">
          <div class="card mb-3" v-for="reservation in reservations" :key="reservation.id">
            <div class="card-body">
              <h5 class="card-title">Reservation in Room: {{ reservation.roomName }}</h5>
              <p class="card-text">
                Check-In Date: {{ reservation.checkInDate }}<br>
                Check-Out Date: {{ reservation.checkOutDate }}<br>
                Number of Guests: {{ reservation.numberOfGuests }}<br>
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <img src="@/assets/corgi_programmer.png" alt="No reservations" class="img-fluid">
          <p>No reservations found.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        customerEmail: '',
        reservations: [],
        loading: false
      };
    },
    methods: {
      fetchCustomerReservations() {
        this.loading = true;
        fetch(`http://localhost:8080/customers/email/${this.customerEmail}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Customer not found');
            }
            return response.json();
          })
          .then(customerData => {
            return fetch(`http://localhost:8080/reservations/customer/${customerData.id}/hotel/${this.$route.params.id}`);
          })
          .then(response => response.json())
          .then(reservationsData => {
            return Promise.all(reservationsData.map(reservation => {
              return fetch(`http://localhost:8080/rooms/${reservation.roomId}`)
                .then(roomResponse => roomResponse.json())
                .then(roomData => {
                  reservation.roomName = roomData.type;
                  return reservation;
                });
            }));
          })
          .then(reservationsWithRooms => {
            this.reservations = reservationsWithRooms;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    }
  };
  </script>
  