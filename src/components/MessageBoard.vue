<template>
  
  <div v-if="showSuccessAlert" class="alert-overlay">
    <div class="alert-box">
      <div class="alert-content">
        <span class="success-icon">✓</span>
        <p>Message submitted successfully!</p>
        <button @click="showSuccessAlert = false" class="alert-btn">OK</button>
      </div>
    </div>
  </div>

  <div class="message-board">
 
    <button class="close-btn" @click="$emit('close')">×</button>
    
    <div class="content-wrapper">
           <div class="input-section">
        <h2>Leave a Message</h2>
        <form @submit.prevent="submitMessage">
          <div class="input-group">
            <label for="name">Name</label>
            <input 
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Your name"
            >
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="Your email"
            >
          </div>

          <div class="input-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="formData.message"
              required
              placeholder="Write your message here..."
              rows="5"
            ></textarea>
          </div>

          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>

   
      <div class="messages-section">
        <h2>Messages</h2>
        <div class="messages-container">
          <div 
            v-for="message in sortedMessages" 
            :key="message.id" 
            class="message-card"
          >
            <div class="message-header">
              <span class="name">{{ message.name }}</span>
              <span class="time">{{ formatDate(message.timestamp) }}</span>
            </div>
            <p class="message-content">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL
const API_URL = 'https://augmented-slice-450410-a5.ew.r.appspot.com'  

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const messages = ref([])


const showSuccessAlert = ref(false)


const fetchMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/messages`)
    messages.value = response.data
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
}


const sortedMessages = computed(() => {
  return [...messages.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})


const formatDate = (date) => {
  return new Date(date).toLocaleString()
}


const submitMessage = async () => {
  try {
    const newMessage = {
      name: formData.value.name,
      email: formData.value.email,
      message: formData.value.message
    }
    
    await axios.post(`${API_URL}/api/messages`, newMessage)
    await fetchMessages() 
    

    formData.value = {
      name: '',
      email: '',
      message: ''
    }
    

    showSuccessAlert.value = true
    
   
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  } catch (error) {
    console.error('Error submitting message:', error)
    alert(`Error submitting message: ${error.message}`)
  }
}


onMounted(() => {
  fetchMessages()
})


defineEmits(['close'])
</script>

<style scoped>
.message-board {
  position: fixed;
  right: 1vh;
  top: 2.5vh;
  width: 95vw; 
  max-width: 1200px;
  height: 92vh;
  background: #ffffff99;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  padding: 20px;
  z-index: 100;
  border-radius: 20px;
  margin-left: auto; 
  animation: slideIn 0.3s ease-out;
  box-sizing: border-box;
}


.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 101;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.content-wrapper {
  display: flex;
  gap: 20px;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
}

.input-section, .messages-section {
  padding: 30px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.input-section {
  flex: 0.4; 
  min-width: 300px; 
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.messages-section {
  flex: 0.6; 
  min-width: 400px; 
}

h2 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

label {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 0.9rem;
  color: #555;
}

input, textarea {
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.7);
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
}

.submit-btn {
  padding: 12px 24px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #000;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-card {
  background: rgba(255, 255, 255, 0.5);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.name {
  font-weight: 600;
  color: #333;
  font-size: 0.7rem;
}

.time {
  color: #666;
  font-size: 0.7rem;
}

.message-content {
  color: #444;
  line-height: 1.5;
  font-size: 0.7rem;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}


.input-section::-webkit-scrollbar,
.messages-section::-webkit-scrollbar {
  width: 6px;
}

.input-section::-webkit-scrollbar-track,
.messages-section::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.input-section::-webkit-scrollbar-thumb,
.messages-section::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}


@media (max-width: 1024px) {
  .message-board {
    width: 95vw; 
    margin-left: auto;
  }

  .content-wrapper {
    gap: 10px;
  }

  .input-section, .messages-section {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .message-board {
    width: 95vw;
  }

  .content-wrapper {
    flex-direction: column;
  }

  .input-section {
    flex: none;
    height: 40%;
  }

  .messages-section {
    flex: none;
    height: 60%;
  }
}


.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

.alert-box {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

.alert-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.success-icon {
  width: 50px;
  height: 50px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.alert-content p {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  color: #333;
  font-size: 1.1rem;
  margin: 0;
}

.alert-btn {
  padding: 8px 24px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  transition: background 0.3s ease;
}

.alert-btn:hover {
  background: #000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
