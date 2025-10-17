<template>
  <div class="collapse-button" @click="toggleCollapse" :class="{ 'collapsed': isCollapsed }">
    <span class="arrow-icon" :class="{ 'rotated': isCollapsed }">◀</span>
  </div>
  
  <div class="collapsed-content" :class="{ 'show': isCollapsed }">
    <div class="sidebar-header collapsed-header">
      <img :src="'./pic/logo.png'" class="sidebar-logo" alt="Logo">
      <div class="sidebar-name">CO-LIVING COMMUNITY</div>
    </div>
  </div>
  
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <!-- Logo and project name -->
    <div class="sidebar-header">
      <img :src="'./pic/logo.png'" class="sidebar-logo" alt="Logo">
      <div class="sidebar-name">CO-LIVING COMMUNITY</div>
    </div>


    <nav class="sidebar-nav">
      <!--  submode and submenu -->
      <div v-for="(mode, modeIndex) in modes" :key="modeIndex" class="mode-section">
        <button 
          class="mode-button"
          :class="{ active: activeModeIndex === modeIndex }"
          @click="toggleMode(modeIndex)"
        >
          <img :src="mode.icon" class="mode-icon" alt="">
          {{ mode.name }}
          <span 
            v-if="mode.items.length > 0" 
            class="arrow" 
            :class="{ rotated: activeModeIndex === modeIndex }"
          >▼</span>
        </button>

        <!-- submenu, only show when there are items -->
        <transition name="expand">
          <div v-if="mode.items.length > 0" v-show="activeModeIndex === modeIndex" class="sub-menu">
            <template v-if="modeIndex === 0">
              <button 
                v-for="(item, index) in mode.items" 
                :key="index"
                class="nav-button"
                :class="{ active: activeSubIndex === index && activeModeIndex === modeIndex }"
                @click="handleItemClick(modeIndex, index)"
              >
                {{ item.name }}
              </button>
            </template>
            
            <template v-else-if="modeIndex === 2">
              <div class="projection-buttons">
                <button 
                  class="nav-button projection-button"
                  :class="{ active: activeSubIndex === 0 }"
                  @click="handleItemClick(modeIndex, 0)"
                >
                  Perspective
                </button>
                <button 
                  class="nav-button projection-button"
                  :class="{ active: activeSubIndex === 1 }"
                  @click="handleItemClick(modeIndex, 1)"
                >
                  Orthographic
                </button>
              </div>
              
              <!-- loop through each button, and place its submenu immediately after IFC Hider -->
              <div v-for="(item, index) in mode.items.slice(2)" :key="index + 2">
                <button 
                  class="nav-button"
                  :class="{ 
                    'active': activeSubIndex === index + 2 && activeModeIndex === modeIndex,
                    'has-submenu': item.subitems
                  }"
                  @click="handleItemClick(modeIndex, index + 2)"
                >
                  {{ item.name }}
                  <span v-if="item.subitems" 
                    class="arrow" 
                    :class="{ rotated: showIfcHiderSubmenu }"
                  >▼</span>
                </button>
                
                <!-- IFC Hider submenu - only show when the current item is IFC Hider -->
                <transition name="expand">
                  <div v-if="item.subitems && showIfcHiderSubmenu" class="ifc-hider-submenu">
                    <button 
                      v-for="(subitem, subIndex) in ifcHiderSubitems"
                      :key="subIndex"
                      class="nav-button submenu-button"
                      @click="handleIfcHiderClick(subitem.name)"
                    >
                      {{ subitem.name }}
                    </button>
                  </div>
                </transition>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </nav>
    <div class="sidebar-bottom">
      <div class="bottom-line" />
      <div class="bottom-text">TUM ITBE GROUP6</div>
      <br>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeModeIndex = ref(0)
const activeSubIndex = ref(0)
const isSustainabilityActive = ref(false)
const currentMode = ref('project')
const isCollapsed = ref(false)
const showIfcHiderSubmenu = ref(false)


const modes = ref([
  {
    name: 'Project Mode',
    icon: '/pic/menulogo1.png',
    items: [
      { name: 'Project Introduction' },
      { name: 'Design Concept' },
      { name: 'Functionality' },
      { name: 'Virtual Tour' },
      { name: 'Sustainability' },
      { name: 'Public Space & Activities' }
    ]
  },
  {
    name: 'City Mode',
    icon: '/pic/menulogo2.png',
    items: []
  },
  {
    name: 'IFC Mode',
    icon: '/pic/menulogo3.png',
    items: [
      { name: 'Perspective' },
      { name: 'Orthographic' },
      { name: 'Clear All Sections' },
      { 
        name: 'IFC Fliter',
        subitems: [
          { name: 'IfcWall' },
          { name: 'IfcWindow' },
          { name: 'IfcSlab' },
          { name: 'IfcColumn' },
          { name: 'IfcBeam' }
        ]
      },
      { name: 'Download IFC' },
      { name: 'Reset' }
    ]
  },
  {
    name: 'Message Board',
    icon: '/pic/menulogo4.png',
    items: []
  },
  {
    name: 'About',
    icon: '/pic/menulogo5.png',
    items: []
  }
])

const emit = defineEmits(['showAbout', 'menuClick', 'modeChange'])


const ifcHiderSubitems = computed(() => {
  return modes.value[2]?.items[3]?.subitems || []
})


const toggleMode = (modeIndex) => {
  
  if (modeIndex === modes.value.length - 2) {
    emit('menuClick', 'Message Board')
    activeModeIndex.value = modeIndex 
   
    if (window.sceneManager?.projectMode?.sustainabilityViewer?.exitIfActive) {
      window.sceneManager.projectMode.sustainabilityViewer.exitIfActive();
    }
    return
  }
  
  
  if (modeIndex === modes.value.length - 1) {
    emit('showAbout')
   
    if (window.sceneManager?.projectMode?.sustainabilityViewer?.exitIfActive) {
      window.sceneManager.projectMode.sustainabilityViewer.exitIfActive();
    }
    return
  }

  activeModeIndex.value = activeModeIndex.value === modeIndex ? null : modeIndex
  activeSubIndex.value = 0
  

  const modeName = modeIndex !== null ? modes.value[modeIndex].name.toLowerCase().split(' ')[0] : null
  

  if (modeName === 'city' ) {
    isCollapsed.value = true
  }
  

  if (modeName) {
    currentMode.value = modeName
    window.sceneManager.switchMode(modeName)
  }
  

  if (window.sceneManager?.projectMode?.sustainabilityViewer?.exitIfActive) {
    window.sceneManager.projectMode.sustainabilityViewer.exitIfActive();
  }
  
  emit('modeChange', modeName)
}


const handleIfcHiderClick = (itemName) => {

  window.sceneManager.ifcMode.toggleCategory(itemName)
}


const handleItemClick = (modeIndex, index) => {
  const item = modes.value[modeIndex].items[index]
  
  if (modeIndex === 0) { // Project Mode
  
    if (window.sceneManager?.projectMode) {
      
      if (window.sceneManager.projectMode.pubSpaceViewer?.isPubSpaceMode) {
        window.sceneManager.projectMode.pubSpaceViewer.exitPubSpaceMode()
      }
      
    
      if (window.sceneManager.projectMode.functionalityViewer?.isFunctionalityMode) {
        window.sceneManager.projectMode.functionalityViewer.exitFunctionalityMode()
      }
      
     
      if (window.sceneManager.projectMode.locationPins?.isVirtualMode) {
        window.sceneManager.projectMode.locationPins.hideVirtualTour()
      }
      
      
      if (window.sceneManager.projectMode.sustainabilityViewer?.exitIfActive) {
        window.sceneManager.projectMode.sustainabilityViewer.exitIfActive()
      }
    }

   
    if (item.name === 'Virtual Tour') {
      if (window.sceneManager?.projectMode?.locationPins) {
        window.sceneManager.projectMode.locationPins.startVirtualTour()
      } else if (window.sceneManager?.projectMode?.initLocationPins) {
        window.sceneManager.projectMode.initLocationPins()
        window.sceneManager.projectMode.locationPins.startVirtualTour()
      }
    } else if (item.name === 'Functionality') {
      if (window.sceneManager?.projectMode?.functionalityViewer) {
        window.sceneManager.projectMode.functionalityViewer.showFunctionality()
      }
    } else if (item.name === 'Sustainability') {
      isSustainabilityActive.value = true
      if (window.sceneManager?.projectMode?.sustainabilityViewer) {
        window.sceneManager.projectMode.sustainabilityViewer.showSustainability()
      } else if (window.sceneManager?.projectMode?.initSustainabilityViewer) {
        window.sceneManager.projectMode.initSustainabilityViewer()
        window.sceneManager.projectMode.sustainabilityViewer.showSustainability()
      }
    } else if (item.name === 'Public Space & Activities') {
      if (window.sceneManager?.projectMode) {
        window.sceneManager.projectMode.togglePubSpaceMode()
      }
    }
  } else if (modeIndex === 2) { // IFC Mode
    
    if (window.sceneManager?.projectMode?.pubSpaceViewer?.isPubSpaceMode) {
      window.sceneManager.projectMode.pubSpaceViewer.exitPubSpaceMode()
    }

    
    if (window.sceneManager?.projectMode?.functionalityViewer?.isFunctionalityMode) {
      window.sceneManager.projectMode.functionalityViewer.exitFunctionalityMode()
    }
    
    if (window.sceneManager?.projectMode?.locationPins?.isVirtualMode) {
      window.sceneManager.projectMode.locationPins.hideVirtualTour()
    }
    if (index === 3) { // IFC Hider
      showIfcHiderSubmenu.value = !showIfcHiderSubmenu.value
      return
    }
    if (index === 0) { // Perspective
      window.sceneManager.ifcMode.world.camera.projection.set('Perspective')
    } else if (index === 1) { // Orthographic
      window.sceneManager.ifcMode.world.camera.projection.set('Orthographic')
    } else if (index === 2) { // Clear All Clippers
      window.sceneManager.ifcMode.clearAllClippers()
    } else if (index === 4) { // Download IFC
      window.sceneManager.ifcMode.downloadIFC()
    } else if (index === 5) { // Reset
      currentMode.value = 'ifc'
      window.sceneManager.switchMode('ifc')
      emit('modeChange', 'ifc')
    }
  }
  
  activeSubIndex.value = index
  
  emit('menuClick', item.name)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 1vh;
  top: 1.5vh;
  
  width: 300px;
  height: calc(100vh - 6vh); 
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  padding: 20px 20px 20px 30px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 100;
  border-radius: 15px;
  transition: transform 0.3s ease;
  margin-bottom: 1.5vh;
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  position: relative;
}

.sidebar-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 5%;  
  width: 90%; 
  height: 0.5px;
  background-color: #a5a5a5;
}

.sidebar-logo {
  width: 55px;
  height: 55px;
  margin-bottom: 20px;
}

.sidebar-name {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #000000;
  text-align: center;
  letter-spacing: 0.1em;
}

.sidebar-nav {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  overflow-y: auto; 
  flex: 1; 
}


.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}


.mode-section {
  width: 100%;
  margin-bottom: 12px;
}


.mode-button {
  width: 90%;
  padding: 12px 20px;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #555;
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.mode-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mode-button:active {
  transform: translateY(0);
}

.mode-button.active {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.arrow {
  margin-left: auto;
  position: static;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(-180deg);
}


.sub-menu {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  margin: 8px auto;
  padding: 8px;
  width: 85%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


.nav-button {
  width: 100%;
  padding: 10px 15px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #555;
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 2px 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-button:active {
  transform: translateX(2px);
}

.nav-button.active {
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}


.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px; 
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.sidebar-bottom {
  margin-top: auto;
  text-align: center;
}

.bottom-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%; 
  margin: 20px auto;  
  border-bottom: 1.5px solid #bdbcbc;
}

.bottom-text {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 0.85rem;
  color: #8d8d8d;
  margin:0px 0;
  
}

.sidebar-item {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.sidebar-item i {
  margin-right: 10px;
}

/* 修改收起按钮样式 */
.collapse-button {
  position: fixed;
  left: 1vh;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 40px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 102;
  transition: left 0.3s ease;
}

.collapse-button.collapsed {
  left: 1vh;
}

.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}


.projection-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.projection-button {
  flex: 1;
  min-width: 0;
  padding: 8px 5px;
  font-size: 0.85rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.projection-button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.ifc-hider-submenu {
  padding-left: 20px;
  margin: 4px 0; 
}

.submenu-button {
  font-size: 0.85rem;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.7);
  margin: 2px 0; 
}

.has-submenu {
  position: relative;
}

.has-submenu .arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
}

.has-submenu .arrow.rotated {
  transform: rotate(-180deg);
}


.collapsed-content {
  position: fixed;
  left: 1vh;
  top: 2.5vh;
  width: 80px;
  padding: 10px;
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease;
  z-index: 99;
}

.collapsed-content.show {
  opacity: 1;
  transform: translateX(0);
}


.collapsed-header {
  padding: 10px 0 !important;
}

.collapsed-header::after {
  display: none; 
}

.collapsed-header .sidebar-logo {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.collapsed-header .sidebar-name {
  font-size: 0.7rem;
  text-align: left;
  padding: 0 5px;
}

.mode-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style> 