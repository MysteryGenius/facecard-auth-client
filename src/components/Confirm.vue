<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full" v-if="$store.state.authorized">
    <div>
      <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
        FacePass
      </h2>
      <p class="m-6 text-center">Welcome, you will now be redirected back</p>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    mounted() {
      window.open(`http://${this.$store.state.redirect_url}/auth/${this.$store.state.jwt}`); 
    },
  }
</script>
