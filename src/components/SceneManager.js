import { ProjectMode } from './ProjectMode';
import { IFCMode } from './IFCMode';
import { CityMode } from './CityMode';

export class SceneManager {
    constructor() {
        this.currentMode = null;
        this.projectMode = new ProjectMode();
        this.ifcMode = new IFCMode();
        this.cityMode = new CityMode();
        this.container = null;
        this.activeMode = null;
        this.camera = null;
        this.renderer = null;
    }

    initialize(container) {
        this.container = container;
    }

    async switchMode(modeName) {
        try {
           
            const previousMode = this.activeMode;
            
            
            this.activeMode = null;
            
           
            if (previousMode) {
                previousMode.dispose();
                this.container.innerHTML = '';
            }

            
            switch (modeName.toLowerCase()) {
                case 'project':
                    this.activeMode = this.projectMode;
                    break;
                case 'ifc':
                    this.activeMode = this.ifcMode;
                    break;
                case 'city':
                    this.activeMode = this.cityMode;
                    break;
                default:
                    console.error('Unknown mode:', modeName);
                    return;
            }

            
            await this.activeMode.initialize(this.container);
            this.currentMode = modeName.toLowerCase();
            
        } catch (error) {
            console.error('error in switchMode:', error);
        }
    }

    update() {
        if (this.activeMode) {
            this.activeMode.update();
        }
    }

    onWindowResize() {
        if (this.activeMode && this.activeMode.camera && this.activeMode.renderer) {
            
            this.activeMode.camera.aspect = window.innerWidth / window.innerHeight;
            this.activeMode.camera.updateProjectionMatrix();

            
            this.activeMode.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

export default SceneManager;