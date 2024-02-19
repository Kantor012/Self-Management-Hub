<template>
  <div class="chat-container">
    <div class="chat-messages">
      <ChatMessage
        v-for="msg in messages"
        :key="msg.id"
        :message="msg.message"
        :sender="msg.username"
        :timestamp="msg.timestamp"
        :class="{ 'user-message': msg.role_id === 1 || msg.role_id === 4, 'it-message': msg.role_id === 2 || msg.role_id === 3 }"
      />
    </div>
    <div class="chat-input">
      <textarea class="textarea"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        @keydown.enter.shift.prevent
        placeholder="Napisz wiadomość..."
      ></textarea>
      <button class="button" @click="sendMessage">Wyślij</button>
    </div>
  </div>
</template>

<script>
import ChatMessage from "@/components/ChatMessage";
import { io } from 'socket.io-client';
import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import { mapGetters, mapState } from 'vuex'

Vue.use(VueCookies)

export default {
  props: {
    id: {
      type: Number,
      required: false,
    }
  },
  components: {
    ChatMessage,
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData']),
  },
  async created() {
    await this.get_messages();
  },
  async mounted() {
    await this.$store.dispatch('idFromCookies');
    await this.$store.dispatch('fetchUserData');
    this.socket = io(`${process.env.SERVER_IP}`);
    this.socket.on('message', (message) => {
      this.messages.push(message);
    });

  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  data() {
    return {
      messages: [],
      newMessage: "",
    };
  },
  methods: {
    isUser: async function () {
      const response = await axios.get(
        `${process.env.SERVER_IP}/v1/users/${this.sender_id}`
      )
      return parseInt(response.data.role_id);
    },
    async get_messages() {
      try {
        const response = await axios?.get(`${process.env.SERVER_IP}/v1/helpdesk/${this.id}/messages`);
        this.messages = response?.data?.messages;
        console.log(this.messages);
      } catch(e) {
        console.log(e)
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() === "") return;
      try {
        const currTimestamp = Date.now();
        const sqldatetime = new Date(currTimestamp).toISOString().slice(0, 19).replace('T', ' ');
        this.socket.emit("message", {
          chatId: this.id,
          message:this.newMessage,
          sender_id: this.getUserData?.id,
          sender: this.getUserData?.name + ' ' + this.getUserData?.surname,
          role_id: this.getUserData?.role_id,
          timestamp: sqldatetime
        });
        await axios.post(`${process.env.SERVER_IP}/v1/helpdesk`, {
          chatId: this.id,
          message: this.newMessage,
          sender_id: this.getUserData?.id,
          sender: this.getUserData?.name + ' ' + this.getUserData?.surname,
          role_id: this.getUserData?.role_id,
          timestamp: sqldatetime
        });
        this.newMessage = "";
        await this.get_messages();
        console.log(this.messages[0]);
      } catch (error) {
        console.error('Błąd podczas wysyłania lub pobierania wiadomości:', error);
      }
    },
    isMessageFromLeft(sender_role_id) {
      const roleIdsToLeft = [2, 3];
      return roleIdsToLeft.includes(sender_role_id);
    },
  },
};
</script>

<style scoped>
.chat-container {
  position: absolute;
  right: 12.5rem;
  display: flex;
  flex-direction: column;
  height: 60vh;
  width: 70%;
  justify-content: center;
  margin: 0 auto;
  border: solid black 1px;
  background-color: #eeeaea;
  max-height: 448px;
  margin-top: 1rem;

}
.chat-input{
  margin-left: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}


.textarea{
  width: 80%;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;

}
.button{
  background: #7197ff;
  font-size: large;
  width: 20%;
  border-radius: 5px;
  margin-right: 2rem;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
}

.user-message {

  background-color: #565656;
  color: #ffffff;
  text-align: left;
  border-radius: 0 100% 100% 0 / 50%;
  font-size: medium;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  margin: 1rem;
  border-radius: 1.125rem 1.125rem 1.125rem 0;
  min-height: 2.25rem;
  width: fit-content;
  max-width: 49%;
  min-width: 30%;
  overflow: hidden;
  overflow-wrap: break-word;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}

.it-message {
  background-color: #7197ff;
  color: #ffffff;
  text-align: right;
  margin-left: auto;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: medium;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  border-radius: 1.125rem 1.125rem 0 1.125rem;
  min-height: 2.25rem;
  width: fit-content;
  max-width: 49%;
  min-width: 30%;
  overflow: hidden;
  overflow-wrap: break-word;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);

}
</style>
