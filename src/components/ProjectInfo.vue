<template>
  <div class="project-info" v-if="isVisible">
    <button class="close-btn" @click="$emit('close')">×</button>
    
    <div class="info-header">
      <h2>Project Introduction</h2>
    </div>
    <div class="divider"></div>
    
    <div class="info-content">
      <div class="section main-section">
        <img src="/pic/background.jpg" alt="Project Overview" class="main-image">
        <div class="text-content">
          <p>
            The planning area is located in District 9, Neuhausen-Nymphenburg, within the development corridor 
            between Munich's main train station (Hauptbahnhof), Laim, and Pasing.The most prominent structure in the area is the 124-meter-long, heritage-listed Paketposthalle. 
            This iconic hall, with its striking arch construction spanning 148 meters, covers an area equivalent 
            to two football fields. Originally designed as a package post facility with railway access, it later 
            served as a mail distribution center.
          </p>
          <p>
            In the summer of 2018, Deutsche Post sold two plots of land between Arnulfstraße, Wilhelm-Hale-Straße, 
            and Birketweg. While postal operations are still present on-site, they will eventually be relocated, 
            creating a unique opportunity to repurpose the heritage-listed Paketposthalle with a new public-use concept. 
            The surrounding areas are planned for mixed-use development, including residential buildings, office spaces, 
            hotels, retail, creative industries, and social facilities. This transformation aims to create a vibrant 
            urban district that integrates historic preservation with modern urban needs.
          </p>
        </div>
      </div>

      <div class="section-divider"></div>

      <div class="section content-row section-history">
        <img src="/pic/history.jpg" alt="Paketposthalle" class="section-image">
        <div class="text-content">
          <h3>Background & History</h3>
          <p>
            The Paketpostareal in Munich has a rich history that dates back to its construction between 1965 and 1969. 
            Designed by the Oberpostdirektion München, Initially serving as a post railway station from 1969 to 1997, the site later became a mail distribution center, a function 
            it maintained until 2018. That year marked a significant turning point, as postal operations were relocated to Germering, and the 
            entire property was sold to the Büschl Group. Since then, efforts have been underway to reimagine the 
            future of the historic, landmarked Paketposthalle and its surrounding area. 
          </p>
        </div>
      </div>

      <div class="section-divider"></div>

      <div class="section content-row section-research">
        <div class="text-content">
          <h3>Research about High-rise Buildings</h3>
          <p>
            Munich's traditionally low-rise skyline is at the center of debate over two proposed 154-meter-high 
            towers. Supporters see them as a solution to the housing shortage, 
            while opponents argue they threaten the city's historic character and skyline. Concerns also include 
            environmental impact, high costs, and the risk of setting a precedent for more high-rises, which 
            could fuel real estate speculation.
          </p>
        
        </div>
        <img src="/pic/highrise.jpg" alt="High-rise Buildings" class="section-image">
      </div>

      <div class="section-divider"></div>

      <div class="section content-row section-public">
        <img src="/pic/publicparticipation.jpg" alt="Public Space" class="section-image">
        <div class="text-content">
          <h3>Public Participation</h3>
          <p>
            Before formally initiating the planning process as required by law, the City of Munich voluntarily 
            launched an early public participation phase through a citizen assessment report. In this report, 
            randomly selected Munich residents were informed about the current planning progress and provided 
            recommendations for the community's future development. Their key suggestions focused on sustainability, 
            advocating for sustainable building materials, energy use, and socially inclusive design. Regarding high-rise buildings, they proposed varying heights between 60 and 120 meters and offering 
            more flexible housing with diverse unit types. Open space was another priority, with calls for a mix 
            of commercial and non-commercial areas, flexible-use spaces, and expanded green areas. 
          </p>
        </div>
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
.project-info {
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

.divider {
  height: 0.5px;
  background-color: rgba(165, 165, 165, 0.3);
  margin: 20px 0;
  width: 100%;
}

.info-content {
  padding: 0 20px;
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  color: #666;
  overflow-y: auto;
}

.section {
  margin-bottom: 0; 
}

.section h3 {
  font-family: 'Poppins', 'Nunito Sans', system-ui, sans-serif;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.section p {
  font-size: 0.8rem;
  line-height: 1.6;
  margin-bottom: 12px;
  text-align: justify;
}

.section p:last-child {
  margin-bottom: 0;
}


.info-content::-webkit-scrollbar {
  width: 6px;
}

.info-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.info-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
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

.content-with-image {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 10px;
}

.text-content {
  flex: 1;
  min-width: 0; 
}

.section-image {
  width: 60%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  flex-shrink: 0;
  max-height: 200px;
}

@media (max-width: 768px) {
  .content-with-image {
    flex-direction: column;
  }

  .section-image {
    width: 100%;
    height: auto;
    max-height: 180px;
    margin-bottom: 20px;
  }
}

.main-section {
  margin-bottom: 40px;
}

.main-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
  object-position: center 70%;
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
}

.text-content h3 {
  margin-top: 0;
}

@media (max-width: 768px) {
  .content-row, .content-row.reverse {
    flex-direction: column;
  }

  .main-image {
    height: 180px;
    object-position: center 70%;
  }
}

.section-divider {
  height: 0.5px;
  background-color: rgba(165, 165, 165, 0.3);
  margin: 30px 0;
  width: 100%;
}


.section-history .section-image {
  width: 30%;
  max-height: 250px;
}


.section-research .section-image {
  width: 60%;
  max-height: 250px;
}


.section-public .section-image {
  width: 18%;
  max-height: 300px;
}

@media (max-width: 768px) {
  .section-history .section-image,
  .section-research .section-image,
  .section-public .section-image {
    width: 100%;
    max-height: 180px;
  }
}
</style> 