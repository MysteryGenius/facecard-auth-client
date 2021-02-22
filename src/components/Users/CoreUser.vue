<template>
<div class="container mx-auto">
  <div class="md:flex md:items-center md:justify-between m-10">
    <div class="flex-1 min-w-0">
      <h2 class="text-2xl font-bold sm:leading-7 text-gray-900 sm:text-4xl sm:leading-9 sm:text-left text-center">
        Users
      </h2>
    </div>
    <addUser @save="this.fetchUser()" v-on:refresh-list="slate()" :initial="this.id"/> 
  </div>
  <div class="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
    <div class="flex-1 flex">
      <form class="w-full flex md:ml-0 ">
        <label for="search_field" class="sr-only">Search</label>
        <div class="relative w-full text-gray-400 focus-within:text-gray-600">
          <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none mx-2">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
          </div>
          <input id="search_field" class="block w-full h-full pl-8 pr-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm" placeholder="Search" type="search" v-model="query">
        </div>
      </form>
    </div>
  </div>
    
  <div class="p-6">
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider" v-on:click="sortClick('name')">
                    First Name
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider " v-on:click="sortClick('email')">
                    Last Name
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider" v-on:click="sortClick('platform_role')">
                    Email
                  </th>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider" v-on:click="sortClick('platform_role')">
                    Role
                  </th>
                  <th class="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody>
                <!-- Odd row -->
                <tr class="bg-white" v-for="user in users" :key="user.id">
                  <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
                    {{user.first_name}}
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700 normal-case">
                    {{user.last_name}}
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {{user.email}}
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {{user.role}}
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                    <div class="text-indigo-600 hover:text-indigo-900" v-on:click="usersClick(user.id)">Edit</div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    

</template>

<script>
  import AddUser from './AddUser.vue';
    export default {
      components : {
            addUser: AddUser,
        },
        data() {
          return {
            users: [],
            query: '',
            id: -1,
            pagination: [],
            url: `http://localhost:5000/users/all`,
            sort_by: '',
            ord: true,
          }
        },
        created() {
          this.fetchUsers();
        },
        watch: {
          query() {
            if (this.query === '') this.slate();
            else this.search();
          },
          url() {
            this.fetchUsers()
          },
          ord() {
            this.fetchUsers()
          }
        },
        computed: {
          prevDisabled() {
            return this.pagination.current_page === 1
          },
          nextDisabled() {
            return this.pagination.current_page === this.pagination.last_page
          }
        },
        methods: {
            usersClick(user_id) {
                this.id = user_id;
            },
            fetchUsers() {
              if (this.pagination === []) this.url = `http://localhost:5000/users/all`

              this.$http.get(this.url)
                .then(res => {
                  this.users = res.data;
                  console.log(this.users)
                })
                .catch(error=>{
                  let messages = Object.values(error.response.data.errors);
                  this.errors = [].concat.appcmdly([], messages);
                });

            },
            slate() {
              this.id = -1;
              this.fetchUsers();
            },
            search() {
              this.$http.get('/api/user/search', { params: { query: this.query } })
                .then(res => {
                  this.users = res.data

                  console.log(res)
                })
                .catch(error => {
                  let messages = Object.values(error.response.data.errors);
                  this.errors = [].concat.appcmdly([], messages);
                });
            },
            next() {
              if (!this.nextDisabled) this.url = this.pagination.next_page_url
            },
            prev() {
              if (!this.prevDisabled) this.url = this.pagination.prev_page_url
            },
            showPages() {
              let curr = this.pagination.current_page;
              let last = this.pagination.last_page;

              let pageList = []

              if (curr == 1 && last >= 3) {
                pageList = [curr, curr+1, curr+2]
              }
              else if (curr == 1 && last < 3) {
                pageList = [curr, curr+1]
              }
              else if (curr != 1 && last > 2) {
                pageList = [curr-1, curr, curr+1]
              }
              else if(curr == last && last >= 3) {
                pageList = [curr-2, curr-1, curr]
              }
              else pageList = [curr-1, curr]

              return pageList
            },
            sortClick(sortable) {
              this.ord = !this.ord;
              this.sort_by = sortable;
            }
        }
    }
</script>

<style scoped>
    tr:nth-child(even) {
        background-color: #dddddd;
    }
</style>
