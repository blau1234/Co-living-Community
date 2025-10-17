<template>
    <transition name="fade">
      <div class="loading-screen" v-if="showLoading">
        <div class="loading-content">
          <!-- Logo -->
          <img 
            :src="'/pic/logo.png'"
            class="rotating-logo" 
            alt="Logo"
          >
          
          <!-- slogan -->
          <div class="name">
            CO-LIVING COMMUNITY 
          </div>

          <!-- slogan -->
          <div class="slogan">
            makes life better
          </div>
          
          <!-- progress bar and percentage container -->
          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            
            <div class="progress-text">
              {{ progress ? Math.floor(progress) : 0 }}%
            </div>
          </div>

          <!-- enter button -->
          <button 
            v-if="loadingComplete"
            @click="handleEnter"
            class="enter-button"
          >
            EXPLORE
          </button>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import * as THREE from 'three'
  
  const progress = ref(0)
  const loadingComplete = ref(false)
  const loadingManager = new THREE.LoadingManager()
  
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progress.value = (itemsLoaded / itemsTotal) * 100
  }
  
  const emit = defineEmits(['loading-complete'])
  const showLoading = ref(true)
  const MIN_LOADING_TIME = 3000 
  let startTime = Date.now()
  
  const handleEnter = () => {
    showLoading.value = false
    emit('loading-complete')
  }
  

  onMounted(() => {
    const textureLoader = new THREE.TextureLoader(loadingManager)
    textureLoader.load('/pic/logo.png')
    

    setTimeout(() => {
      loadingComplete.value = true
    }, MIN_LOADING_TIME)
  })
  </script>
  
  <style scoped>
  .loading-screen {
    background: linear-gradient(to bottom, #e6f3e4, #dff2ff);

    
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .rotating-logo {
    width: 75px;
    height:75px;
    transform-origin: center center;
    animation: rotate 2s linear infinite;
    position: absolute;
    top: 250px;

  }
  .name {
    position: absolute;
    top: 350px;
    font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
    font-weight: 500;
    letter-spacing: 0.1em;
    font-size: 1.1rem;
    color: #333;
    margin: 10px 0 5px 0;
    text-align: center;
    line-height: 1.5;
  }
  .slogan {
    position: absolute;
    top: 400px;
    font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
    font-weight: 300;
    letter-spacing: 0.1em;
    font-size: 1.1rem;
    color: #333;
    margin: 5px 0 10px 0;
    text-align: center;
    line-height: 1.5;
  }
  
  .progress-container {
    position: absolute;
    bottom: 135px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
  }
  
  .progress-bar {
    width: 100%;
    height: 6px;
    background-color: #c9dff3;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #fcfcfc;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 1rem;
    color: #a0a0a0;
    text-align: center;
    margin-top: 15px;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* 添加淡入淡出动画效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 2s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }

  .enter-button {
    position: fixed;
    bottom: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 40px;
    font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
    font-size: 1rem;
    color: #888888;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .enter-button:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -50%) scale(1.15);
  }

  .enter-button:active {
    transform: translate(-50%, -50%) scale(0.95);
  }

  .mute-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;  
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .mute-button:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
  }

  .mute-button:active {
    transform: scale(0.95);
  }
  </style>