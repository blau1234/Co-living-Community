<template>
  <LoadingScreen 
    v-if="isLoading" 
    @loading-complete="handleLoadingComplete"
  />
  <Sidebar 
    v-show="!isLoading" 
    @showAbout="showAbout"
    @menuClick="handleMenuClick"  
  />
  <About :isVisible="isAboutVisible" @close="hideAbout" />
  <SustainabilityInfo :isVisible="isSustainabilityVisible" />
  <ProjectInfo :isVisible="isProjectVisible" @close="hideProject" />
  <DesignInfo :isVisible="isDesignVisible" @close="hideDesign" />
  <CubeInfo 
    :isVisible="isCubeInfoVisible" 
    :cubeData="cubeData" 
    @close="hideCubeInfo" 
  />
  <PanoramaViewer 
    v-if="isPanoramaVisible"
    :isVisible="isPanoramaVisible"
    :panoramaPath="currentPanoramaPath"
    @close="hidePanorama"
  />
  <MusicControl />
  <MessageBoard 
    v-if="isMessageBoardVisible" 
    @close="hideMessageBoard"
  />
  <GreenSpace 
    v-if="showGreenSpace" 
    @close="showGreenSpace = false"
  />
  <Reservation 
    v-if="showReservationDialog" 
    :activity="currentActivity"
    @close="showReservationDialog = false"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import Sidebar from './components/Sidebar.vue'
import About from './components/About.vue'


import MusicControl from './components/MusicControl.vue'
import PanoramaViewer from './components/PanoramaViewer.vue'
import ProjectInfo from './components/ProjectInfo.vue'
import DesignInfo from './components/DesignInfo.vue'
import MessageBoard from './components/MessageBoard.vue'
import GreenSpace from './components/GreenSpace.vue'
import Reservation from './components/Reservation.vue'

const isLoading = ref(true)
const isAboutVisible = ref(false)
const isSustainabilityVisible = ref(false)
const isCubeInfoVisible = ref(false)
const isPanoramaVisible = ref(false)
const currentPanoramaPath = ref('')
const cubeData = ref(null)
const isProjectVisible = ref(false)
const isDesignVisible = ref(false)
const isMessageBoardVisible = ref(false)
const showGreenSpace = ref(false)
const showReservationDialog = ref(false)
const currentActivity = ref(null)

const handleLoadingComplete = () => {
  if (!isLoading.value) return
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const showAbout = () => {
  isAboutVisible.value = true
}

const hideAbout = () => {
  isAboutVisible.value = false
}

const hidePins = () => {
  window.hideVirtualTourPins?.()
}

const handleMenuClick = (menuName) => {
  // 首先隐藏所有面板
  hideAllPanels()
  
  if (menuName === 'Virtual Tour') {
    window.startVirtualTour?.()
  } else if (menuName === 'Sustainability') {
    // 移除了 isSustainabilityVisible.value = true
    // 只保留 ProjectMode.js 中的高亮功能
  } else if (menuName === 'Project Introduction') {
    isProjectVisible.value = true
  } else if (menuName === 'Design Concept') {
    isDesignVisible.value = true
  } else if (menuName === 'Message Board') {
    isMessageBoardVisible.value = true
  } else if (menuName === 'Public Space & Activities') {
    // 删除这行，不再显示 GreenSpace 组件
    // isGreenSpaceVisible.value = true
  } else {
    hidePins()
  }
}

const hideAllPanels = () => {
  isProjectVisible.value = false
  isDesignVisible.value = false
  isSustainabilityVisible.value = false
  isMessageBoardVisible.value = false
  showGreenSpace.value = false
}

const showCubeInfo = (data) => {
  cubeData.value = data
  isCubeInfoVisible.value = true
}

const hideCubeInfo = () => {
  isCubeInfoVisible.value = false
}

const showPanorama = (path) => {
  currentPanoramaPath.value = path
  isPanoramaVisible.value = true
}

const hidePanorama = () => {
  isPanoramaVisible.value = false
  currentPanoramaPath.value = ''
}

const hideMessageBoard = () => {
  isMessageBoardVisible.value = false
}

const hideDesign = () => {
  isDesignVisible.value = false
}

const hideProject = () => {
  isProjectVisible.value = false
}

const handleShowReservation = (event) => {
  currentActivity.value = event.detail.activity
  showReservationDialog.value = true
}

const handleShowGreenSpace = () => {
  showGreenSpace.value = true;
};

onMounted(() => {
  // expose to global
  window.showPanorama = showPanorama
  window.addEventListener('showReservation', handleShowReservation)
  window.addEventListener('showGreenSpace', handleShowGreenSpace)
})

onUnmounted(() => {
  window.removeEventListener('showReservation', handleShowReservation)
  window.removeEventListener('showGreenSpace', handleShowGreenSpace)
})

</script> 