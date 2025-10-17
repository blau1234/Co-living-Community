<template>
  <div class="green-space">
    <!--close button -->
    <button class="close-btn" @click="$emit('close')">×</button>
    
    <!-- top area: title, image and introduction -->
    <div class="header-section">
      <div class="intro-container">
        <div class="left-content">
          <h2>Co-Living space</h2>
          <div class="text-content">
            <p>
              Welcome to our vibrant Co-living space, a green oasis in the heart of our co-living community. 
              This shared space offers residents a perfect spot for relaxation, social gatherings, and various community activities. 
              With comfortable seating areas, garden plots, and stunning city views, it's designed to foster connection and wellbeing.
            </p>
          </div>
        </div>
        <img src="/pic/rooftop.jpg" alt="Rooftop Garden" class="space-image">
      </div>
    </div>

    <!-- divider -->
    <div class="divider"></div>

    <!-- activity calendar area -->
    <div class="calendar-section">
      <h3>Monthly Activities</h3>
      <div class="calendar-grid">
        <div v-for="(day, index) in weeklyActivities" :key="index" class="day-column">
          <div class="day-header" :style="{ backgroundColor: day.color }">
            {{ day.name }}
          </div>
          <div class="activities-container">
            <div v-for="(activity, actIndex) in day.activities" 
                 :key="actIndex" 
                 class="activity-card"
                 @click="showReservation(activity)"
                 style="cursor: pointer;">
              <span class="date">Feb {{ activity.date }}</span>
              <span class="activity-icon">{{ activity.icon }}</span>
              <span class="activity-name" :class="{ 'fusion-lab': activity.name === 'ITBE Fusion Lab' }">
                {{ activity.name }}
              </span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <Reservation 
    v-if="selectedActivity"
    :activity="selectedActivity"
    @close="selectedActivity = null"
  />
</template>

<script setup>
import { ref } from 'vue'
import Reservation from './Reservation.vue'

const selectedActivity = ref(null)

const weeklyActivities = [
  {
    name: 'Sunday',
    color: '#B0C4DE',
    activities: [
      { date: '1', name: 'Music Jam', time: '2:00 PM', icon: '🎸' },
      { date: '8', name: 'Jazz Concert', time: '4:00 PM', icon: '🎷' },
      { date: '15', name: 'Piano Recital', time: '3:00 PM', icon: '🎹' },
      { date: '22', name: 'Acoustic Night', time: '5:00 PM', icon: '🎵' }
    ]
  },
  {
    name: 'Monday',
    color: '#FFB6C1',
    activities: [
      { date: '2', name: 'Morning Yoga', time: '8:00 AM', icon: '🧘' },
      { date: '9', name: 'Dance Workshop', time: '6:00 PM', icon: '💃' },
      { date: '16', name: 'Meditation', time: '9:00 AM', icon: '🧘‍♀️' },
      { date: '23', name: 'Fitness Class', time: '7:00 PM', icon: '💪' }
    ]
  },
  {
    name: 'Tuesday',
    color: '#98FB98',
    activities: [
      { date: '3', name: 'Book Club', time: '7:00 PM', icon: '📚' },
      { date: '10', name: 'Poetry Reading', time: '6:30 PM', icon: '📖' },
      { date: '17', name: 'Writing Workshop', time: '5:00 PM', icon: '✍️' },
      { date: '24', name: 'Literature Talk', time: '7:30 PM', icon: '🗣️' }
    ]
  },
  {
    name: 'Wednesday',
    color: '#87CEEB',
    activities: [
      { date: '4', name: 'Community Dinner', time: '6:30 PM', icon: '🍽️' },
      { date: '11', name: 'Cooking Class', time: '4:00 PM', icon: '👨‍🍳' },
      { date: '18', name: 'Wine Tasting', time: '7:00 PM', icon: '🍷' },
      { date: '25', name: 'Baking Workshop', time: '3:00 PM', icon: '🥖' }
    ]
  },
  {
    name: 'Thursday',
    color: '#DDA0DD',
    activities: [
      { date: '5', name: 'Art Class', time: '5:00 PM', icon: '🎨' },
      { date: '12', name: 'Pottery Workshop', time: '4:00 PM', icon: '🏺' },
      { date: '19', name: 'Photography Club', time: '6:00 PM', icon: '📸' },
      { date: '26', name: 'Sketching Session', time: '5:30 PM', icon: '✏️' }
    ]
  },
  {
    name: 'Friday',
    color: '#F0E68C',
    activities: [
      { date: '6', name: 'Game Night', time: '7:30 PM', icon: '🎮' },
      { date: '13', name: 'Movie Night', time: '8:00 PM', icon: '🎬' },
      { date: '20', name: 'Board Games', time: '7:00 PM', icon: '🎲' },
      { date: '27', name: 'Karaoke Night', time: '8:30 PM', icon: '🎤' }
    ]
  },
  {
    name: 'Saturday',
    color: '#FFA07A',
    activities: [
      { date: '7', name: 'Weekend Brunch', time: '11:00 AM', icon: '🥞' },
      { date: '14', name: 'Garden Workshop', time: '10:00 AM', icon: '🌱' },
      { date: '21', name: 'ITBE Fusion Lab', time: '9:00 AM', icon: '🎓' },
      { date: '28', name: 'Food Festival', time: '12:00 PM', icon: '🍱' }
    ]
  }
]

const showReservation = (activity) => {
  selectedActivity.value = activity
}

defineEmits(['close'])
</script>

<style scoped>
.green-space {
  position: fixed;
  right: 1vh;
  top: 2.5vh;
  width: calc(100vw -  9vh);
  max-width: 800px;
  height: 92vh;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  padding: 20px;
  z-index: 150;
  border-radius: 15px;
  margin-left: 2vh;
  animation: slideIn 0.3s ease-out;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 151;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transform: scale(1.1);
}

.header-section {
  margin-bottom: 0;
}

h2 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
  text-align: left;
  padding-left: 15px;
  margin-top: 8px;
  padding-right: 40px;
}

.intro-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-content {
  flex: 1;
  font-size: 0.7rem;
  line-height: 1.6;
  color: #444;
  padding-left: 15px;
  padding-right: 15px;
}

.text-content p {
  text-align: justify;
  text-justify: inter-word;
  margin: 0;
}

.space-image {
  width: 300px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 8px;
  margin-right: 20px;
}

.divider {
  height: 0.5px;
  background-color: rgba(165, 165, 165, 0.3);
  margin: 20px 0;
  width: 100%;
}

.calendar-section {
  margin-top: 0;
}

h3 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  text-align: left;
  padding-left: 15px;
}

.calendar-grid {
  display: flex;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  width: 100%;
  overflow-x: auto;
}

.day-column {
  flex: 1;
  min-width: 90px;
  max-width: calc(100% / 7);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-header {
  padding: 4px;
  text-align: center;
  border-radius: 6px;
  font-weight: 600;
  color: #333;
  font-size: 0.8rem;
  margin-bottom: 2px;
}

.activities-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 5px;
  gap: 8px;
}

.activity-card {
  background: rgba(255, 255, 255, 0.7);
  padding: 4px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: transform 0.3s ease;
  width: 110%;
  height: 90px;
  box-sizing: border-box;
  justify-content: center;
}

.activity-card:hover {
  transform: translateY(-2px);
}

.date {
  font-size: 0.6rem;
  color: #666;
  font-weight: 600;
  height: 14px;
  display: flex;
  align-items: center;
  margin: 0;
}

.activity-icon {
  font-size: 1rem;
  line-height: 1;
  height: 20px;
  display: flex;
  align-items: center;
}

.activity-name {
  font-weight: 600;
  font-size: 0.7rem;
  color: #333;
  text-align: center;
  height: 20px;
  display: flex;
  align-items: center;
  margin: 0;
}

.activity-time {
  font-size: 0.6rem;
  color: #666;
  height: 16px;
  display: flex;
  align-items: center;
  margin: 0;
}

.fusion-lab {
  color: red !important;
  font-weight: bold !important;
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

/* 自定义滚动条 */
.green-space::-webkit-scrollbar {
  width: 6px;
}

.green-space::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.green-space::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}


.calendar-grid::-webkit-scrollbar {
  height: 4px;
}

.calendar-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.calendar-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

@media (max-width: 1024px) {
  .intro-container {
    flex-direction: column;
  }

  .space-image {
    width: 100%;
    max-width: 300px;
    height: 150px;
    margin-top: 15px;
  }

  .calendar-grid {
    gap: 6px;
    padding: 12px;
  }

  .day-column {
    min-width: 85px;
    gap: 3px;
  }
}

@media (max-width: 768px) {
  .calendar-grid {
    gap: 4px;
    padding: 10px;
  }

  .day-column {
    min-width: 80px;
    gap: 2px;
  }

  .activity-card {
    padding: 5px;
  }
}
</style>
