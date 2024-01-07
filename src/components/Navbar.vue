<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/corgi.png" alt="Corgi" style="height: 30px; margin-right: 10px;">
        StayEz
      </router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/customer" class="nav-link">Customer</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
  
  <script>
  export default {
    name: 'Navbar'
  }
  </script>
  
<style scoped>

</style>