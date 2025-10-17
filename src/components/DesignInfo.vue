<template>
  <div class="design-info" v-if="isVisible">
    <button class="close-btn" @click="$emit('close')">×</button>
    
    <div class="info-header">
      <h2>Design Concept</h2>
    </div>
    <div class="divider"></div>

    <div class="info-content">
      <!-- 1. Design Insight Section -->
      <div class="section section-insight">
        <div class="text-content">
          <h3>Design Insight</h3>
          <p>Through in-depth site analysis, we recognized that the key lies in connecting people, architecture, and the environment</p>
        </div>
        <img src="/pic/designinsight.jpg" alt="Design Insight" class="section-image">
      </div>

      <div class="section-divider"></div>

      <!-- Design Concept Section -->
      <div class="section">
        <div class="text-content">
          <h3>Project Concept</h3>
          <p>Our design concept centers on "connection," utilizing architectural space design and fusion technology to create a vibrant co-living community where people, buildings, and the environment are organically connected</p>
        </div>
        <img src="/pic/designconcept.jpg" alt="Design Concept" class="section-image">
      </div>

      <div class="section-divider"></div>

      <!-- 3. Urban Context Section -->
      <div class="section">
        <div class="text-content">
          <h3>Urban Context</h3>
          <p>A continuous green corridor runs along the railway area leading to our site, creating 
            a natural landscape that enhances the urban environment. To preserve and strengthen 
            this ecological connection, our planning aims to seamlessly integrate and extend 
            this green space into the development.</p>
        </div>
        <img src="/pic/urbancontext.png" alt="Urban Context" class="section-image">
      </div>

      <div class="section-divider"></div>

      <!-- Design Derivation Section -->
      <div class="section">
        <div class="text-content">
          <h3>Design Derivation</h3>
          <p>Focusing on our site, two main roads provide direct access, ensuring strong connectivity 
            to the surrounding urban fabric. At the heart of the development is the historic and 
            iconic depot, which serves as a defining architectural landmark...</p>
          <p>Beyond this, our design approach is deeply informed by the surrounding city context 
            and its existing spatial patterns...</p>
        </div>
        <img src="/pic/designderivation.jpg" alt="Design Derivation" class="section-image">
      </div>

      <div class="section-divider"></div>

      <!-- 5. Design Comparison Section -->
      <div class="section section-comparison">
        <div class="text-content">
          <h3>Design Comparison</h3>
          <p>Firstly, the height of the towers has been reduced...</p>
          <p>Additionally, more rooftop green spaces have been incorporated...</p>
          <p>Furthermore, the enclosed inner courtyard has been redesigned...</p>
        </div>
        <img src="/pic/designcomparision.jpg" alt="Design Comparison" class="section-image">
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
.design-info {
  position: fixed;
  right: 1vh;
  top: 2.5vh;
  width: calc(100vw - 85px); 
  max-width: 1200px;
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
  margin-left: 15px; 
  animation: slideIn 0.3s ease-out;
}

.info-header {
  padding: 0;
  border-bottom: none;
}

.info-header h2 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
  text-align: left;
  padding-left: 15px;
  margin-top: 8px;
  padding-right: 40px;
}

.divider, .section-divider {
  height: 0.5px;
  background-color: rgba(165, 165, 165, 0.3);
  margin: 30px 0;
  width: 100%;
}

.info-content {
  padding: 0 15px;
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  color: #666;
  overflow-y: auto;
  overflow-x: hidden;
}

.main-section {
  margin-bottom: 0;
}

.main-section-image {
  width: 70%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0;
}

.content-row {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin-bottom: 0;
}

.content-row.reverse {
  flex-direction: row-reverse;
}

.text-content {
  flex: 1;
  padding: 10px 0;
  width: 100%;
}

.section h3 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
  margin-top: 0;
}

.section p {
  font-size: 0.8rem;
  line-height: 1.6;
  margin-bottom: 12px;
  text-align: justify;
}

/* 第一部分样式 */
.section-derivation .section-image {
  width: 35%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 8px;
}

.section-derivation .text-content {
  flex: 1.5;
  padding-right: 20px;
}

/* 第二部分样式 */
.section-comparison .section-image {
  width: 35%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 8px;
}

.section-comparison .text-content {
  flex: 2;
  padding-right: 30px;
}

.section-insight .section-image,
.section-concept .section-image {
  width: 35%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 8px;
}

.section-insight .text-content,
.section-concept .text-content {
  flex: 2;
  padding-right: 30px;
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

@media (max-width: 768px) {
  .content-row, .content-row.reverse {
    flex-direction: column;
  }

  .main-section-image {
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
  }

  .section-derivation .section-image {
    width: 100%;
    max-height: 180px;
  }

  .section-derivation .text-content {
    flex: 1;
    padding-right: 0;
  }

  .section-comparison .text-content {
    flex: 2;
    padding-right: 0;
  }

  .section-insight .section-image,
  .section-concept .section-image {
    width: 100%;
    max-height: 180px;
  }

  .section-insight .text-content,
  .section-concept .text-content {
    padding-right: 0;
  }
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

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
  width: 100%;
  height: auto;
  min-height: 100px;
}

.section-image {
  width: 100%;
  height: auto;
  min-height: 100px;
  max-height: none;
  object-fit: contain;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
}

/* 移除这些不再需要的类 */
.main-section-image,
.content-row,
.content-row.reverse {
  display: none;
}

@media (max-width: 768px) {
  .section-image {
    height: auto;
    min-height: 100px;
  }
}

/* 移除所有特定部分的图片样式覆盖 */
.section-insight .section-image,
.section-concept .section-image,
.section-derivation .section-image,
.section-comparison .section-image {
  width: 100%;
}

@media (max-width: 768px) {
  .section-insight .section-image,
  .section-concept .section-image,
  .section-derivation .section-image,
  .section-comparison .section-image {
    width: 100%;
  }
}
</style> 