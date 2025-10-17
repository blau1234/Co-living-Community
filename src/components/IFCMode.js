import * as THREE from 'three';
import * as OBC from "@thatopen/components";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ClipperManager } from './ClipperManager';
import * as OBCF from "@thatopen/components-front";
import { HighlightManager } from './HighlightManager';
import { HideManager } from './HideManager';

export class IFCMode {
    constructor() {
        this.components = null;
        this.world = null;
        this.fragments = null;
        this.clipperManager = null;
        this.casters = null;
        this.highlightManager = null;
        this.classifier = null;
        this.hideManager = null;
        this.dimensions = null;
    }

    async initialize(container) {
        
        this.dispose();
        
        // initialize components
        this.components = new OBC.Components();
        this.components.init();

        // create world component
        const worlds = this.components.get(OBC.Worlds);
        this.world = worlds.create();

        // set scene, renderer and camera
        this.world.scene = new OBC.SimpleScene(this.components);
        this.world.scene.setup();
        this.world.renderer = new OBC.SimpleRenderer(this.components, container);
        this.world.camera = new OBC.OrthoPerspectiveCamera(this.components);
        this.world.camera.projection.set("Perspective");
        this.world.camera.controls.maxPolarAngle = Math.PI / 2;
        
        // set camera position
        this.world.camera.controls.setLookAt(-300,175,-300, -20, 0, 0);

        // add grid (optional)
        const grids = this.components.get(OBC.Grids);
        grids.create(this.world);

        // initialize fragments manager
        this.fragments = this.components.get(OBC.FragmentsManager);

        // initialize classifier - initialize early
        this.classifier = this.components.get(OBC.Classifier);

        // initialize raycaster and clipper
        this.casters = this.components.get(OBC.Raycasters);
        this.casters.get(this.world);

        // initialize clipper manager
        this.clipperManager = new ClipperManager(this.components,this.fragments);
        this.clipperManager.initialize(this.world);
        this.clipperManager.setupEvents(container);

       
        if (this.components && this.world) {
            this.highlightManager = new HighlightManager(this.components);
            this.highlightManager.initialize(this.world);
        }
        
       
        if (this.classifier) {
            this.hideManager = new HideManager(this.components);
            this.hideManager.initialize(this.classifier);
        }

        // show instructions
        this.showInstructions();
        
        // then load model
        await this.loadModel();
    }

    async loadModel() {
       
        if (!this.fragments || !this.components) {
            console.error("components not initialized");
            return;
        }
        
        if (this.fragments.groups.size) {
            return;
        }
        
        try {
            // load model of two fragments cause of the size limit of the file
            const file1 = await fetch(  '/model/1.frag');
            const file2 = await fetch("/model/2.frag");
            const data1 = await file1.arrayBuffer();
            const data2 = await file2.arrayBuffer();
            const buffer1 = new Uint8Array(data1);
            const buffer2 = new Uint8Array(data2);
            const group1 = this.fragments.load(buffer1);
            const group2 = this.fragments.load(buffer2);
            
            // create a parent group
            const parentGroup = new THREE.Group();
            
            // add two model groups to the parent group
            parentGroup.add(group1);
            parentGroup.add(group2);                     
            parentGroup.position.set(0, 67, 0);      
        
            this.world.scene.three.add(parentGroup);
            this.world.meshes.add(parentGroup);
            



            if (!this.classifier) {
                this.classifier = this.components.get(OBC.Classifier);
            }

                
            this.classifier.byModel(group1.uuid, group1);
            this.classifier.byEntity(group1);
            const modelItems1 = this.classifier.find({ models: [group1.uuid] });
            this.classifier.byModel(group2.uuid, group2);
            this.classifier.byEntity(group2);
            const modelItems2 = this.classifier.find({ models: [group2.uuid] });
            
            
            if (this.clipperManager && typeof this.clipperManager.setModelItems === 'function') {
                this.clipperManager.setModelItems(modelItems1, modelItems2);
            } else {
                console.warn('ClipperManager not initialized or missing setModelItems method');
            }
        } catch (error) {
            console.error("error loading IFC model:", error);
        }
    }
    


    update() {
        this.world.renderer.update();
    }

    dispose() {
        try {
            
            if (this.clipperManager) {
                this.clipperManager.clearAll();
                this.clipperManager.dispose();
                this.clipperManager = null;
            }

            
            if (this.highlightManager) {
                this.highlightManager.dispose();
                this.highlightManager = null;
            }

            
            if (this.hideManager) {
                this.hideManager.dispose();
                this.hideManager = null;
            }

            
            if (this.world && this.world.scene && this.world.scene.three) {
                this.world.scene.three.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => {
                                if (material.map) material.map.dispose();
                                if (material.lightMap) material.lightMap.dispose();
                                if (material.bumpMap) material.bumpMap.dispose();
                                if (material.normalMap) material.normalMap.dispose();
                                if (material.specularMap) material.specularMap.dispose();
                                if (material.envMap) material.envMap.dispose();
                                material.dispose();
                            });
                        } else {
                            if (object.material.map) object.material.map.dispose();
                            if (object.material.lightMap) object.material.lightMap.dispose();
                            if (object.material.bumpMap) object.material.bumpMap.dispose();
                            if (object.material.normalMap) object.material.normalMap.dispose();
                            if (object.material.specularMap) object.material.specularMap.dispose();
                            if (object.material.envMap) object.material.envMap.dispose();
                            object.material.dispose();
                        }
                    }
                });

                while(this.world.scene.three.children.length > 0){ 
                    this.world.scene.three.remove(this.world.scene.three.children[0]);
                }
            }

           
            if (this.fragments) {
                this.fragments.dispose();
                this.fragments = null;
            }
            
            if (this.classifier) {
                this.classifier.dispose();
                this.classifier = null;
            }

           
            if (this.world && this.world.renderer) {
                if (this.world.renderer.three) {
                    this.world.renderer.three.dispose();
                    this.world.renderer.three.forceContextLoss();
                    this.world.renderer.three.domElement = null;
                }
                this.world.renderer = null;
            }

          
            if (this.world && this.world.camera) {
                if (this.world.camera.controls) {
                    this.world.camera.controls.dispose();
                }
                this.world.camera = null;
            }

          
            if (this.world) {
                this.world.dispose();
                this.world = null;
            }

            if (this.components) {
                this.components.dispose();
                this.components = null;
            }



        } catch (error) {
            console.warn('IFCMode dispose 过程中出现错误:', error);
        }
    }

    clearAllClippers() {
        this.clipperManager.clearAll();
    }

    async downloadIFC() {
        try {
            
            const response = await fetch('./model/2.ifc');
            const blob = await response.blob();
            
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'test.ifc';  
            
            document.body.appendChild(a);
            a.click();
            
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("error downloading IFC file:", error);
        }
    }

    toggleCategory(category) {
        if (this.hideManager) {
            this.hideManager.toggleCategory(category);
        }
    }

   
    showInstructions() {
        const style = document.createElement('style');
        style.textContent = `
            .instructions-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease-in-out;
            }

            .instructions-content {
                background-color: rgba(255, 255, 255, 0.9);
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 90%;
            }

            .instructions-content h3 {
                margin: 0 0 1.5rem 0;
                color: #2c3e50;
                font-size: 1.5rem;
            }

            .instructions-content ul {
                list-style: none;
                padding: 0;
                margin: 0 0 1.5rem 0;
            }

            .instructions-content li {
                padding: 0.5rem 0;
                color: #333;
                position: relative;
                padding-left: 1.5rem;
            }

            .instructions-content li:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #666;
            }

            .close-btn {
                width: 100%;
                padding: 0.8rem;
                background-color: rgba(255, 255, 255, 0.8);
                color: #333;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.3s;
            }

            .close-btn:hover {
                background-color: rgba(255, 255, 255, 1);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .fade-out {
                animation: fadeOut 0.3s ease-in-out;
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        const modal = document.createElement('div');
        modal.className = 'instructions-modal';
        
        const content = document.createElement('div');
        content.className = 'instructions-content';
        
        const title = document.createElement('h3');
        title.textContent = 'Model Operation Instructions';
        
        const list = document.createElement('ul');
        const instructions = [
            'Drag - Rotate to view model',
            'Click - Get component information',
            'Double click - Create section',
            'Long press - Remove section'
        ];
        
        instructions.forEach(text => {
            const item = document.createElement('li');
            item.textContent = text;
            list.appendChild(item);
        });
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = 'Got it';
        closeBtn.onclick = () => {
            modal.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        content.appendChild(title);
        content.appendChild(list);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        
        document.body.appendChild(modal);
    }
} 