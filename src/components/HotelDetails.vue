<template>
    <div class="container mt-4">
        <div v-if="!hotel" class="loader"></div>
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
          })
          .catch(error => {
            console.error('Error fetching hotel details:', error);
          });
      }
    }
  };
  </script>
  

<style scoped>
.room-card:hover {
  -webkit-box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  transition: box-shadow 0.3s ease-in-out;
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(0,0,0, 0.2);
  border-right: 1.1em solid rgba(0,0,0, 0.2);
  border-bottom: 1.1em solid rgba(0,0,0, 0.2);
  border-left: 1.1em solid #000;
  transform: translateZ(0);
  animation: load8 1.1s infinite linear;
}

@keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>