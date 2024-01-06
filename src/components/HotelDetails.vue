<template>
    <div class="container mt-4">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
        <div v-else>
            <h2 class="mb-4">{{ hotel.name }} - Rooms</h2>
            <div class="row">
                <div class="col-md-4" v-for="room in rooms" :key="room.id">
                <div class="card mb-4 room-card">
                    <div class="card-body">
                    <h5 class="card-title">Room {{ room.number }} - {{ room.type }}</h5>
                    <p class="card-text">
                        Guests: {{ room.guestsCount }}<br>
                        Price per night: ${{ room.pricePerNight }}<br>
                    </p>
                    </div>
                    <div class="card-footer">
                    <router-link :to="'/reserve/' + room.id" class="btn btn-primary">Reserve</router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
  </template>
  
  <script>
  export default {
    props: {
        id: {
        type: Number,
        required: true,
        },
    },
    data() {
      return {
        hotel: null,
        rooms: [],
        loading: true,
      }
    },
    created() {
      this.fetchHotelDetails();
    },
    methods: {
      fetchHotelDetails() {
        fetch(`http://localhost:8080/hotels/${this.id}`)
          .then(response => response.json())
          .then(data => {
            this.hotel = data;
            return Promise.all(this.hotel.roomIds.map(id => fetch(`http://localhost:8080/rooms/${id}`)));
          })
          .then(responses => Promise.all(responses.map(res => res.json())))
          .then(rooms => {
            this.rooms = rooms;
            this.loading = false;
          })
          .catch(error => {
            console.error('Error fetching hotel details:', error);
            this.loading = false;
          });
      }
    }
  };
  </script>