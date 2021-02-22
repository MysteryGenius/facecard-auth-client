<template>
    <div>
        <button v-on:click="show()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out">
          New
        </button>
        <modal name="formModal" height="auto" @closed="beforeClose" :scrollable=true :adaptive=true> 
            <form class="w-full max-w-lg m-6 md:p-0 p-4 space-y-4" @submit.prevent novalidate>
                <h2 class="text-xl text-center underline font-semibold">{{this.title}}</h2>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div class="mt-1">
                    <input id="email" type="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="email" v-model="user.email" required>
                  </div>
                </div>
                <div>
                  <label for="first_name" class="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div class="mt-1">
                    <input id="first_name" type="text" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="password" v-model="user.first_name" required>
                  </div>
                </div>
                <div>
                  <label for="last_name" class="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div class="mt-1">
                    <input id="last_name" type="text" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="password" v-model="user.last_name" required>
                  </div>
                </div>
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div class="mt-1">
                    <input id="password" type="password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="password" v-model="user.password" required>
                  </div>
                </div>

                <div>
                  <label for="platform_roles" class="block text-sm font-medium text-gray-700">Platform Role</label>
                  <select id="platform_roles" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="user.role">
                    <option class="text-gray-600 text-bold" value="-1" selected disabled>Select a role</option>
                    <option v-for="(role, index) in platform_roles" :key="index">{{role}}</option>
                  </select>
                </div>

                <div>
                  <label for="platform_roles" class="block text-sm font-medium text-gray-700">Image Features</label>
                  <vueDropzone :options="dropzoneOptions" id="dz" ref="dropzone" class="appearance-none block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"></vueDropzone>
                </div>

                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" @click="save" 
                    :class="{ 'opacity-50 cursor-not-allowed': loading }">Save</button>
                <div class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto inline-block cursor-pointer" v-if="id>0" v-on:click="deleteUser()">Delete</div>
                <div class="text-green-600">{{ feedback }}</div>
                <ul>
                    <li class="text-pink-600 italic" v-for="(error, index) in errors" :key="index">{{error}}</li>
                </ul>
            </form>
        </modal>
    </div>
</template>

<script>
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css';
    function newUser () {
        return {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role: -1
        }
    }
    export default {
        components: {
            vueDropzone: vue2Dropzone
        },
        data() {
            return {
                user: newUser(),
                errors: [],
                feedback: '',
                platform_roles: ['admin', 'user'],
                title: 'New User',
                id: -1,
                loading: false,
                dropzoneOptions: {
                url: '/import-topics',
                    success(file, res) {
                        file.filename = res;
                    }
                },
            };
        },
        props: ['initial'],
        watch: {
            initial: function () {
                this.id = this.initial; 
                if (this.initial > 0) {
                    this.id = this.initial;
                    this.$http.get(`http://localhost:5000/users/${this.id}`)
                        .then(res => {
                            this.user = res.data;
                        });

                    this.title = "Edit User";
                    this.show();
                }
            }
        },
        beforeRouteLeave (to, from, next) {
            this.user = newUser();
            next();
        },
        methods: {
            slate() {
                this.errors = [];
                this.user = newUser();
                this.feedback = '';
                this.id = -1;
                this.title = 'New User';
                this.$emit('refresh-list', true);
            },
            deleteUser() {
                this.$http.delete(`http://localhost:5000/users/${this.id}`)
                    .then(res => {
                        if (res.status === 200) {
                            this.slate();
                            this.hide();
                            this.feedback = 'Deleted';
                        }
                    })
                    .catch(error=>{
                        this.slate();
                        let messages = Object.values(error.response.data.errors);
                        this.errors = [].concat.apply([], messages);
                    })
            },
            async save() {
                this.loading = true;
                let url = 'http://localhost:5000/users/add';
                if (this.id > 0) {
                    url = `http://localhost:5000/users/${this.id}`;
                }
                this.$http.post(url, this.user)
                    .then(res => {
                        if (res.status === 200) {
                            this.slate();   
                            this.feedback = 'Changes saves.';
                        }
                    })
                    .catch(error=>{
                      console.log(error)
                        this.slate();
                        let messages = Object.values(error.response.data.errors);
                        this.errors = [].concat.apply([], messages);
                    })

                this.loading = false;
                  
            },

            show () {
                this.$modal.show('formModal');
            },
            hide () {
                this.$modal.hide('formModal');
            },
            beforeClose () {
                this.slate();
            }
        }
    }
    
</script>

<style scoped>
    form {
        margin: 10px auto;
    }
    textarea {
        width: 240px;
    }
</style>
