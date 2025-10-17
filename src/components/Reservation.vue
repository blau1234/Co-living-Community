<template>
  <div class="reservation-overlay" @click.self="$emit('close')">
    <div class="reservation-card">
      
      <button class="close-btn" @click="$emit('close')">×</button>

      <div class="reservation-content">
         <div class="header-section">
          <img src="/pic/book-cover.jpg" alt="Book Cover" class="book-image">
          <div class="event-info">
            <h3>{{ activity.name }}</h3>
            <div class="book-title">
              <span>Flowers for Algernon</span>
              <span class="author">by Daniel Keyes</span>
            </div>
            <div class="info-item">
              <span class="icon">🕐</span>
              <span>February {{ activity.date }}, 2025 {{ activity.time }}</span>
            </div>
            <div class="participants-info">
              <span class="icon">👥</span>
              <span class="count">{{ registeredCount }}/{{ maxParticipants }}</span>
              <span class="label">registered</span>
            </div>
          </div>
        </div>

       
        <div class="form-section">
          <h4>Registration Information</h4>
          <div class="form-group">
            <label for="name">Name *</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name"
              :class="{ 'error': showErrors && !formData.name }"
              placeholder="Enter your name"
            >
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email"
              :class="{ 'error': showErrors && !isValidEmail }"
              placeholder="Enter your email"
            >
          </div>
        </div>

       
        <div class="description-section">
          <h4>About the Book</h4>
          <p>
            Charlie Gordon is about to embark upon an unprecedented journey. Born with an unusually low IQ, 
            he has been chosen as the perfect subject for an experimental surgery that researchers hope will 
            increase his intelligence-a procedure that has already been highly successful when tested on a 
            lab mouse named Algernon.
          </p>
          <p>
            As the treatment takes effect, Charlie's intelligence expands until it surpasses that of the 
            doctors who engineered his metamorphosis. The experiment appears to be a scientific breakthrough 
            of paramount importance, until Algernon suddenly deteriorates. Will the same happen to Charlie?
          </p>
        </div>

        
        <button 
          class="register-btn" 
          :disabled="registeredCount >= maxParticipants"
          @click="handleRegister"
        >
          {{ registeredCount >= maxParticipants ? 'Full' : 'Register' }}
        </button>
      </div>
    </div>
  </div>


  <div v-if="showSuccess" class="success-overlay" @click="hideSuccess">
    <div class="success-message">
      <span class="success-icon">✓</span>
      <p>Registration Successful!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const maxParticipants = 6
const registeredCount = ref(2)
const showSuccess = ref(false)
const showErrors = ref(false)

const formData = ref({
  name: '',
  email: ''
})

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(formData.value.email)
})

const hideSuccess = () => {
  showSuccess.value = false
}

const handleRegister = () => {
  showErrors.value = true
  
  if (!formData.value.name || !isValidEmail.value) {
    return
  }

  if (registeredCount.value < maxParticipants) {
    registeredCount.value++
    showSuccess.value = true
    formData.value = {
      name: '',
      email: ''
    }
    showErrors.value = false
    setTimeout(() => {
      showSuccess.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.reservation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.reservation-card {
  position: relative;
  width: 600px;
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.header-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.book-image {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.event-info h3 {
  font-size: 1rem;
  color: #333;
  margin: 0;
  width: fit-content;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.book-title {
  margin-top: 3px;
  margin-bottom: 10px;
  color: #333;
}

.book-title span {
  display: block;
  font-size: 1.2rem;
  font-weight: 500;
  color: #444;
}

.author {
  font-size: 0.9rem !important;
  color: #666 !important;
  margin-top: 3px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.8rem;
  line-height: 1.2;
}

.icon {
  font-size: 1.1rem;
}

.form-section {
  margin: 20px 0;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #666;
}

.form-group input.error {
  border-color: #ff4444;
  background-color: #fff8f8;
}

.form-group input.error:focus {
  border-color: #ff0000;
}

.description-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-bottom: 30px;
}

.description-section h4 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 10px 0;
}

.description-section p {
  color: #666;
  line-height: 1.6;
  font-size: 0.7rem;
  text-align: justify;
  margin-bottom: 15px;
}

.description-section p:last-child {
  margin-bottom: 0;
}

.register-btn {
  position: absolute;
  bottom: 25px;
  right: 25px;
  padding: 10px 30px;
  background: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.register-btn:hover:not(:disabled) {
  background: #444;
}

.register-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  animation: fadeIn 0.3s ease;
}

.success-message {
  background: white;
  padding: 20px 40px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: scaleIn 0.3s ease;
}

.success-icon {
  font-size: 2rem;
  color: #4CAF50;
}

.success-message p {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

.participants-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px 12px;
  border-radius: 8px;
  width: fit-content;
}

.participants-info .icon {
  font-size: 1.4rem;
}

.participants-info .count {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.participants-info .label {
  font-size: 0.9rem;
  color: #666;
}
</style>
