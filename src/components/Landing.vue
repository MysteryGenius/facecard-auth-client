<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div>
    <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
      FacePass
    </h2>
    <p class="m-6 text-center">Hang tight!</p>
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
      this.$store.state.redirect_url = this.$route.params.url
      this.$router.push({ name: 'main'})
    },
  }
</script>
