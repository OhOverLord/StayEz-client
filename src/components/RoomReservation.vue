<template>
    <div class="container mt-4">
        <div v-if="showErrorAlert" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <h2 class="mb-3">Reserve Room {{ room.number }} - {{ room.type }}</h2>
        <form @submit.prevent="makeReservation">
            <h3>Reservation Details</h3>
            <div class="mb-3">
                <label for="checkInDate" class="form-label">Check-In Date</label>
                <input type="date" id="checkInDate" class="form-control" v-model="reservation.checkInDate" required>
            </div>
            <div class="mb-3">
                <label for="checkOutDate" class="form-label">Check-Out Date</label>
                <input type="date" id="checkOutDate" class="form-control" v-model="reservation.checkOutDate" required>
            </div>
          <!-- Customer Details Form -->
          <div class="mb-3">
            <h3>Customer Details</h3>
            <div class="mb-3">
              <label for="customerFirstName" class="form-label">First Name</label>
              <input type="text" id="customerFirstName" class="form-control" v-model="customer.firstName" placeholder="First Name" required>
            </div>
            <div class="mb-3">
              <label for="customerLastName" class="form-label">Last Name</label>
              <input type="text" id="customerLastName" class="form-control" v-model="customer.lastName" placeholder="Last Name" required>
            </div>
            <div class="mb-3">
              <label for="customerPhoneNumber" class="form-label">Phone Number</label>
              <input type="tel" id="customerPhoneNumber" class="form-control" v-model="customer.phoneNumber" placeholder="Phone Number" required>
            </div>
            <div class="mb-3">
              <label for="customerEmail" class="form-label">Email</label>
              <input type="email" id="customerEmail" class="form-control" v-model="customer.email" placeholder="Email" required>
            </div>
            <div class="mb-3">
              <label for="customerAddress" class="form-label">Address</label>
              <input type="text" id="customerAddress" class="form-control" v-model="customer.address" placeholder="Address" required>
            </div>
          </div>
  
          <!-- Guest Details Form -->
          <div class="mb-3 border p-3">
            <h3>Guest Details</h3>
            <div v-for="(guest, index) in guests" :key="index" class="p-3 mb-3 bg-light">
              <div class="mb-3">
                <label :for="'guestFirstName' + index" class="form-label">Guest First Name</label>
                <input type="text" :id="'guestFirstName' + index" class="form-control" v-model="guest.firstName" placeholder="Guest First Name" required>
              </div>
              <div class="mb-3">
                <label :for="'guestLastName' + index" class="form-label">Guest Last Name</label>
                <input type="text" :id="'guestLastName' + index" class="form-control" v-model="guest.lastName" placeholder="Guest Last Name" required>
              </div>
              <div class="mb-3">
                <label :for="'guestEmail' + index" class="form-label">Guest Email</label>
                <input type="email" :id="'guestEmail' + index" class="form-control" v-model="guest.email" placeholder="Guest Email" required>
              </div>
              <button type="button" class="btn btn-danger" @click="removeGuest(index)">Remove Guest</button>
            </div>
            <button type="button" class="btn btn-primary" @click="addGuest" :disabled="guests.length >= room.guestsCount">
              Add Guest
            </button>
          </div>
          
          <!-- Reservation Button -->
          <div class="mt-3 text-end">
            <button type="submit" class="btn btn-success" :disabled="!guests.length">
              Make Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';

  export default {
    props: {
      id: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        showSuccessAlert: false,
        showErrorAlert: false,
        reservationMessage: '',
        errorMessage: '',
        loading: true,
        room: null,
        customer: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          address: '',
        },
        guests: [],
        reservation: {
            checkInDate: '',
            checkOutDate: '',
            numberOfGuests: 0,
            status: 'NEW',
            roomId: null,
            customerId: null,
            guestIds: []
        },
      };
    },
    created() {
      this.fetchRoomDetails();
    },
    methods: {
      fetchRoomDetails() {
        fetch(`http://localhost:8080/rooms/${this.id}`)
          .then(response => response.json())
          .then(data => {
            this.room = data;
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching room details:', error);
            this.loading = false;
          });
      },
      addGuest() {
        if (this.guests.length < this.room.guestsCount) {
          this.guests.push({
            firstName: '',
            lastName: '',
            email: '',
          });
        } else {
          alert('Cannot add more guests than the room can accommodate');
        }
      },
      removeGuest(index) {
        this.guests.splice(index, 1);
      },
      makeReservation() {
      this.createCustomer().then(customerData => {
        this.reservation.customerId = customerData.id;
        this.reservation.roomId = this.room.id;
        this.reservation.numberOfGuests = this.guests.length;

        const guestPromises = this.guests.map(guest => this.createGuest(guest));
        Promise.all(guestPromises).then(guestData => {
          this.reservation.guestIds = guestData.map(g => g.id);
          this.createReservation(this.reservation).then(reservationData => {
            Swal.fire({
              title: 'Success!',
              text: 'Your reservation has been made.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.$router.push('/reservation-details/' + reservationData.id);
            });
          });
        });
      }).catch(error => {
        Swal.fire({
          title: 'Error!',
          text: error.toString(),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    },
    createCustomer() {
      return fetch(`http://localhost:8080/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.customer)
      })
      .then(response => response.ok || response.status === 409 ? response.json() : Promise.reject(response))
    },
    createGuest(guest) {
      return fetch(`http://localhost:8080/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guest)
      })
      .then(response => response.ok || response.status === 409 ? response.json() : Promise.reject(response))
    },
    createReservation(reservation) {
      return fetch(`http://localhost:8080/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      })
      .then(response => response.ok ? response.json() : Promise.reject(response))
    },
  },
  };
  </script>
  
  <style scoped>
  </style>  