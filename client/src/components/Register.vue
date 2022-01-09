<template>
  <div>
    <h1>This will put this entry into a 'user' database through the back end, and return the data to the front end browser console</h1>
    <input type="email" name="email" v-model="email" placeholder="email" />
    <input type="password" name="password" v-model="password" placeholder="password" />
    <button @click="register">Register</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'Register',
  data () {
    return {
      email: 'abc',
      password: '123'
    }
  },
  methods: {
    async register () {
      const response = await AuthenticationService.register({
        email: this.email,
        password: this.password
      })
      console.log(response.data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
