import { createApp } from 'vue';
import App from './App.vue';
import SceneManager from './components/SceneManager';

// vue app
const app = createApp(App);
app.mount('#app');

// scene container
const container = document.getElementById('viewerContainer');
const sceneManager = new SceneManager();
sceneManager.initialize(container);

// default project mode
sceneManager.switchMode('project');

// animation loop
function animate() {
    requestAnimationFrame(animate);
    sceneManager.update();
}
animate();

// window resize 
window.addEventListener('resize', () => {
    sceneManager.onWindowResize();
});

// expose to global
window.sceneManager = sceneManager;