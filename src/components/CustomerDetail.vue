<template>
    <div class="container mt-4">
      <h2>Edit Customer Details</h2>
      <form @submit.prevent="fetchAndUpdateCustomer">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-control" v-model="customer.email" required>
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" id="firstName" class="form-control" v-model="customer.firstName" required>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" id="lastName" class="form-control" v-model="customer.lastName" required>
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input type="tel" id="phoneNumber" class="form-control" v-model="customer.phoneNumber" required>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input type="text" id="address" class="form-control" v-model="customer.address" required>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
      </form>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        customer: {
          id: null,
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          address: '',
        }
      };
    },
    methods: {
      fetchAndUpdateCustomer() {
        // Fetch the customer by email
        fetch(`http://localhost:8080/customers/email/${this.customer.email}`)
          .then(response => {
            if (response.status === 404) {
              throw new Error('Customer not found');
            }
            return response.json();
          })
          .then(customerData => {
            this.customer.id = customerData.id;
            return this.updateCustomer();
          })
          .catch(error => {
            Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      },
      updateCustomer() {
        return fetch(`http://localhost:8080/customers/${this.customer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.customer)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update customer');
          }
          return response.json();
        })
        .then(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Customer details updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.$router.push('/');
        });
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  