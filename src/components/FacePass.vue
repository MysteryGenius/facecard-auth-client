<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full" v-if="$store.state.authorized">
    <div>
      <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
        FacePass
      </h2>
    </div>
    <form class="mt-8" @submit.prevent novalidate>
      <div class="mt-6">        
        <!-- <video ref="video" id="video" width="640" height="480" class="mb-6 rounded-md" autoplay ></video> -->
        <div id="webcam-container" class="mb-6 rounded-md"></div>
        <div id="label-container"></div>
        <button @click="facepass" :class="{ 'opacity-50 cursor-not-allowed': loading }" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          Sign in
        </button>
      </div>
    </form>
  </div>
  <!-- <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script> -->
</div>
</template>

<script>
  // const URL = "./face-model/";

  // let model, webcam, labelContainer, maxPredictions;
  export default {
    data() {
      return {
        width: 320,    // We will scale the photo width to this
        height: 0,     // This will be computed based on the input stream
        streaming: false,
        video: null,
        canvas: null,
        photo: null,
        startbutton: null,

        // facepassSession: newFacePass(this.$store.state.session_id),
        loading: false,
        errorMessages: [],
        jwt: {},
      }
    },
    mounted() {
      this.video = this.$refs.video;
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
              this.video.src = window.URL.createObjectURL(stream);
              this.video.play();
          });
      }
    },
    methods: {
      async facepass() {
        this.$router.push({ name: 'confirm'})
        this.loading = true;
        this.errorMessages = [];

        let url = 'http://localhost:5000';

        console.log(`Sending request to ${url}/face`)

        // console.log(this.facepassSession)

        await this.$http.post(`${url}/face`, this.$store.state.session_id)
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              this.$store.state.jwt = res.data.access_token
              this.$router.push({ name: 'confirm'})
            }
          })
          .catch(error=>{
            let messages = Object.values(error);
            console.log('error: ')
            console.log(messages)
          })
      },
    },
  }
</script>
