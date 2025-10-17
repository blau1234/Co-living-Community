<template>
    <div class="about-overlay" v-if="isVisible" @click.self="close">
      <div class="about-container">
        <!-- close button -->
        <button class="close-btn" @click="close">×</button>
        
        <!-- project intro -->
        <div class="section project-intro">
          <h2 class="project-title">TUM ITBE Fusion Lab </h2>
          <p class="project-description">
            In this module, students work in interdisciplinary groups (5 students/group), on design and software projects at a scientific level. The goal of the assignment is to create software to solve a typical problem from the application area of the built environment and to apply the software tool to a concrete problem. The tasks are linked to the research-relevant fields of work of the participating chairs and can range, for example, from the processing of recorded sensor data using artificial intelligence methods to questions of additive manufacturing for the built environment.
            <br>
           
          </p>
        </div>
  
        <!-- team members -->
        <div class="section team-members">
          <h2 class="project-title">Team Members</h2>
          <div class="members-container">
            <div v-for="member in teamMembers" :key="member.name" class="member">
              <div class="avatar">
                <img :src="member.avatar" :alt="member.name">
              </div>
              <span class="member-name">{{ member.name }}</span>
              <span class="member-email">{{ member.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    isVisible: Boolean
  })
  
  const emit = defineEmits(['close'])
  
  const teamMembers = [
    { name: 'Yi Zhang', avatar: './pic/member1.png', email: 'yi0731.zhang@tum.de' },
    { name: 'Ying Li', avatar: './pic/member2.png', email: 'ga65hav@mytum.de' },
    { name: 'Jian Ming', avatar: './pic/member3.png', email: 'jian.ming@tum.de' },
    { name: 'Shahzaib Hameed', avatar: './pic/member4.png', email: 'shahzaib.hameed@tum.de' },
    { name: 'Bopitiyage Bopitiya', avatar: './pic/member5.png', email: 'madushan.bopitiya@tum.de' }
  ]
  
  const close = () => {
    emit('close')
  }
  </script>
  
  <style scoped>
  .about-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 5% 10%;
    box-sizing: border-box;
  }
  
  .about-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    background: #ffffff99;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    overflow-x: hidden;
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
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    color: #333;
  }
  
  .section {
    text-align: center;
    padding: 30px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    width: 100%;
    box-sizing: border-box; 
    margin: 0 auto;
  }
  
  .project-intro {
    width: 100%;
    margin-right: 0; 
  }
  
  .team-members {
    
    width: 100%;
    margin-right: 0;
  }
  
  .project-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #ffffff;
    display: inline-block;
  }
  
  .project-description {
    line-height: 1.6;
    color: #333;
    text-align: center;
    padding: 0 15px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .team-members h2 {
    margin-bottom: 25px;
    font-size: 20px;
    color: #333;
  }
  
  .members-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    padding: 20px 0;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
  }
  
  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
    width: 150px;
  }
  
  .avatar {
    width: 75px;   
    height: 75px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .member-name {
    font-size: 16px;
    color: #333;
    white-space: nowrap;  
  }
  
  .member-email {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
  }
  
  /* 自定义滚动条样式 */
  .about-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .about-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .about-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  

  .section h2 {
    font-size: 24px; 
    font-weight: 600;
  }
  

  @media screen and (max-width: 1024px) {
    .members-container {
      gap: 20px;
    }
    
    .member {
      width: 120px; 
    }
    
    .avatar {
      width: 60px;  
      height: 60px;
    }
  }
  
  @media screen and (max-width: 768px) {
    .members-container {
      gap: 15px;
    }
    
    .member {
      width: 100px;
    }
    
    .avatar {
      width: 50px;
      height: 50px;
    }
    
    .member-name {
      font-size: 14px;
    }
    
    .member-email {
      font-size: 10px;
    }
  }
  
  @media screen and (max-width: 480px) {
    .members-container {
      justify-content: space-around;
    }
    
    .member {
      width: 40%; 
      margin-bottom: 15px;
    }
  }
  </style>