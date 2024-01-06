<template>
    <div class="container mt-4">
      <h2 class="mb-4">Our Hotels</h2>
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="hotel in hotels" :key="hotel.id">
          <div class="card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ hotel.name }}</h5>
              <p class="card-text">{{ hotel.description }}</p>
              <ul class="list-unstyled mt-auto">
                <li>Address: {{ hotel.address }}</li>
                <li>Stars: <span class="stars">{{ '★'.repeat(hotel.stars) }}</span></li>
                <li>Country: {{ hotel.country }}</li>
                <li>City: {{ hotel.city }}</li>
              </ul>
            </div>
            <div class="card-footer">
                <router-link :to="'/hotel/' + hotel.id" class="btn btn-primary">View Rooms</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Hotels',
    data() {
      return {
        hotels: []
      };
    },
    created() {
      this.fetchHotels();
    },
    methods: {
      fetchHotels() {
        fetch('http://localhost:8080/hotels')
          .then(response => response.json())
          .then(data => {
            this.hotels = data;
          })
          .catch(error => {
            console.error('Error fetching hotels:', error);
          });
      },
    }
  };
  </script>
  
  <style scoped>
  .stars {
    color: gold;
  }
  .card:hover {
    -webkit-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
    -moz-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
    box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
    transition: box-shadow 0.3s ease-in-out;
  }
  </style>
  