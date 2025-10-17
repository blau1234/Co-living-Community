import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { RGBELoader } from 'three/addons/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { HotAirBalloons } from './HotAirBalloons';
import { LocationPins } from './LocationPins';
import { FunctionalityViewer } from './FunctionalityViewer';
import { SustainabilityViewer } from './SustainabilityViewer';
import { PubSpaceViewer } from './PubSpaceViewer';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class ProjectMode {
    constructor(scene, camera, controls, container) {
        this.scene = scene || new THREE.Scene();
        this.camera = camera;
        this.controls = controls;
        
        this.functionalityViewer = null;
        this.locationPins = null;
        this.renderer = null;
        this.composer = null;
        this.outlinePass = null;
        this.hotAirBalloons = null;
        this.environmentMap = null;
        this.targetPosition = new THREE.Vector3(25, 0, -30);
        this.handleResize = null;
        

    }

    init() {
      
        if (!this.locationPins) {
            this.initLocationPins();
        }
    }

    initialize(container) {
       
        if (!this.scene) {
            this.scene = new THREE.Scene();
        }

      
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            logarithmicDepthBuffer: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        // camera
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.position.set(-125, 30, -30);
        this.camera.lookAt(this.targetPosition);

        //  controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.setupControls();
        
        //  scene
        this.scene.fog = new THREE.FogExp2(0xeeeeee, 0.0025);
        this.setupLights();
        
        // hdr
        this.loadEnvironmentMap();
        
        // model
        this.loadModels();
        
        // others
        this.functionalityViewer = new FunctionalityViewer(this.scene, this.camera, this.controls);
        this.hotAirBalloons = new HotAirBalloons(this.scene, this.renderer, this.camera);
        this.locationPins = new LocationPins(this.scene, this.camera, this.controls);
        this.sustainabilityViewer = new SustainabilityViewer(this.scene, this.camera, this.controls);
        // window size
        this.handleResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.handleResize);

        
        this.onSceneLoaded();
    }

    setupControls() {
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.1;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 350;
        this.controls.target.copy(this.targetPosition);
        this.controls.update();
    }

    setupLights() {
        const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
        directionalLight.position.set(6.25, 3, 4);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(1024, 1024);
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 30;
        directionalLight.shadow.camera.top = 8;
        directionalLight.shadow.camera.right = 8;
        directionalLight.shadow.camera.bottom = -8;
        directionalLight.shadow.camera.left = -8;
        directionalLight.shadow.normalBias = 0.05;
        directionalLight.shadow.bias = 0;
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    loadEnvironmentMap() {
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(   "./sky/04.hdr",(environmentMap) => {
            environmentMap.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = environmentMap;
            this.scene.backgroundBlurriness = 0;
            this.scene.environment = environmentMap;
        });
    }

    loadModels() {
        const loader = new GLTFLoader();
        
        // 设置 DRACOLoader
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        loader.setDRACOLoader(dracoLoader);
        
        const modelUrl = "./model/site_compressed.glb";
        
        loader.load(
            modelUrl,
            (gltf) => {
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                gltf.scene.position.sub(center);
                gltf.scene.position.y += 8;
                gltf.scene.position.x -= 55;

                const glassMaterial = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    transmission: 0.8,
                    opacity: 0.8,
                    metalness: 0.1,
                    roughness: 0.5,
                    ior: 1.5,
                    thickness: 1,
                    transparent: true,
                    side: THREE.DoubleSide,
                });

                let renderOrder = 0;
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        // 如果是建筑物模型，应用玻璃材质
                        if (child.name.toLowerCase().includes('building')) {
                            child.material = glassMaterial.clone();
                            child.renderOrder = renderOrder++;
                        }
                        
                        // 如果是功能模型，默认隐藏
                        if (child.name.toLowerCase().includes('func')) {
                            child.visible = false;
                        }
                    }
                });

                this.scene.add(gltf.scene);
            },
            (progress) => {
                const percentComplete = (progress.loaded / progress.total) * 100;
                console.log(`模型加载进度: ${Math.round(percentComplete)}%`);
            },
            (error) => {
                console.error('加载模型时发生错误:', error);
            }
        );
    }

    update() {
        if (!this.controls || !this.renderer || !this.camera || !this.scene) {
            return;
        }
        
        this.controls.update();
        this.hotAirBalloons?.update();
        this.renderer.render(this.scene, this.camera);
    }

    startVirtualTour() {
        this.locationPins.startVirtualTour();
    }

    hideVirtualTour() {
        this.locationPins.hideVirtualTour();
    }

    dispose() {
      
        if (this.composer) {
            this.composer.dispose();
        }

     
        if (this.hotAirBalloons) {
            this.hotAirBalloons.dispose();
        }
  
        this.scene.clear();
        
        if (this.renderer) {
            this.renderer.dispose();
        }

       
        if (this.controls) {
            this.controls.dispose();
        }

       
        window.removeEventListener('resize', this.handleResize);
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) {
            return;
        }
        
       
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

       
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

   
    initPubSpaceViewer() {
        if (!this.pubSpaceViewer && this.scene && this.camera && this.controls) {
            this.pubSpaceViewer = new PubSpaceViewer(this.scene, this.camera, this.controls);
        }
    }


    togglePubSpaceMode() {
        
        if (!this.pubSpaceViewer) {
            this.initPubSpaceViewer();
        }

        if (this.pubSpaceViewer) {
            if (!this.pubSpaceViewer.isPubSpaceMode) {
                
                if (this.sustainabilityViewer?.isSustainabilityMode) {
                    this.sustainabilityViewer.exitSustainabilityMode();
                }
               
                this.pubSpaceViewer.showPubSpace();
            } else {
                
                this.pubSpaceViewer.exitPubSpaceMode();
            }
        } else {
            console.warn('PubSpaceViewer 未能正确初始化');
        }
    }

   
    onSceneLoaded() {
        this.initPubSpaceViewer();
    }
}