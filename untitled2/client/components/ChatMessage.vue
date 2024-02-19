<template>
  <div>
    {{ sender }}
    <br />
    {{ message }}
    <br />
    {{timestamp}}
  </div>
</template>

<script>
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import { mapGetters, mapState } from 'vuex'
import axios from 'axios'
Vue.use(VueCookies)

export default {
  props: {
    timestamp: String,
    message: String,
    sender_id: Number,
    sender: String,
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData']),
  },
  async mounted() {
    await this.$store.dispatch('idFromCookies')
    await this.$store.dispatch('fetchUserData')
  },
  methods: {
  },
}
</script>

<style scoped>


.message {
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  display: inline-block;
}

.message-sender {
  font-size: 12px;
  text-align: right;
}
</style>
