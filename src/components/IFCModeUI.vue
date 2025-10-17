<template>
  <div class="ifc-mode-ui" :class="{ 'visible': isVisible }">
    <div class="content">
      <h2>IFC Panel</h2>
      

    </div>
  </div>
</template>

<script>
export default {
  name: 'IFCModeUI',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleModelControl(action) {
      console.log('Model control:', action)
    },
    closePanel() {
      this.$emit('update:isVisible', false)
    }
  },
  watch: {
    '$route.name'(newRoute) {
      if (newRoute === 'projectmode' || newRoute === 'citymode') {
        this.closePanel()
      }
    }
  }
}
</script>

<style scoped>
.ifc-mode-ui {
    position: fixed;
  right: 1vh;
  top: 2.5vh;
  width: 300px;
  height: 92vh;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  border-radius: 15px;
  animation: slideIn 0.3s ease-out;
}

.ifc-mode-ui.visible {
  right: 0;
}

.content {
  padding: 0;
}

h2 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  padding: 20px 0;
  text-align: center;
  border-bottom: 1.5px solid #a5a5a5;
}

.section {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h3 {
  font-family: 'Poppins', sans-serif;
  color: #444;
  margin-bottom: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
}

.label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.value {
  font-weight: 500;
  color: #333;
}

.control-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

button {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  color: #444;
}

button:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.element-info {
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 8px;
  min-height: 100px;
}

.element-info p {
  color: #666;
  text-align: center;
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
</style> 