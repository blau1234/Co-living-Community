import * as THREE from 'three';
import { gsap } from 'gsap';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

export class FunctionalityViewer {
    constructor(scene, camera, controls, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.isAnimating = false;
        this.isFunctionalityMode = false;
        
        this.initialCameraPosition = camera.position.clone();
        this.initialControlsTarget = controls.target.clone();
        
        this.hoveredMesh = null;
        this.infoPanel = this.createInfoPanel();
        this.setupMouseEvents();
        
        this.createExitButton();

        this._previousAutoRotate = false;

        this.funcGroups = [];
        this.funcPins = [];

        this.initFuncPins();

        this.renderer = renderer;
    }

    createExitButton() {
        const exitButton = document.createElement('button');
        exitButton.innerHTML = '×';
        exitButton.style.cssText = `
            position: fixed;
            top: 2vh;
            right: 2vh;
            width: 36px;
            height: 36px;
            background-color: white;
            color: #333;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            line-height: 1;
            padding: 0;
        `;
        
        exitButton.addEventListener('mouseover', () => {
            exitButton.style.backgroundColor = '#f5f5f5';
        });
        
        exitButton.addEventListener('mouseout', () => {
            exitButton.style.backgroundColor = 'white';
        });
        
        exitButton.addEventListener('click', () => {
            this.exitFunctionalityMode();
        });
        
        document.body.appendChild(exitButton);
        this.exitButton = exitButton;
    }

    createInfoPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(panel);
        return panel;
    }

    setupMouseEvents() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        this.funcMeshes = [];
        
        this.scene.traverse((object) => {
            if (object.isMesh && object.name.toLowerCase().includes('func')) {
                this.funcMeshes.push(object);
            }
        });

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.funcMeshes, false);

            let found = false;
            if (intersects.length > 0) {
                const intersect = intersects[0];
                if (intersect.object.name.toLowerCase().includes('func')) {
                    this.highlightMesh(intersect.object);
                    found = true;
                }
            }

            if (!found && this.hoveredMesh) {
                this.unhighlightMesh();
            }
        });

        window.addEventListener('click', (event) => {
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.funcMeshes, false);

            let found = false;
            if (intersects.length > 0) {
                const intersect = intersects[0];
                if (intersect.object.name.toLowerCase().includes('func')) {
                    this.showInfo(event.clientX, event.clientY);
                    found = true;
                }
            }

            if (!found) {
                this.hideInfo();
            }
        });
    }

    highlightMesh(mesh) {
        if (this.hoveredMesh === mesh) return;
        
        if (this.hoveredMesh) {
            this.unhighlightMesh();
        }

        this.hoveredMesh = mesh;
        mesh.material.emissive = new THREE.Color(0x666666);
        mesh.material.emissiveIntensity = 1;
    }

    unhighlightMesh() {
        if (this.hoveredMesh) {
            this.hoveredMesh.material.emissive = new THREE.Color(0x000000);
            this.hoveredMesh.material.emissiveIntensity = 0;
            this.hoveredMesh = null;
        }
    }

    showInfo(x, y) {
        this.infoPanel.innerHTML = 'Social Housing: 10000㎡';
        this.infoPanel.style.display = 'block';
        this.infoPanel.style.left = `${x + 10}px`;
        this.infoPanel.style.top = `${y + 10}px`;
    }

    hideInfo() {
        this.infoPanel.style.display = 'none';
    }

    createLabel(object) {
        const group = new THREE.Group();
        
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'black';
        context.font = '48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        const labelText = object.name.split('_')[1] || 'Function';
        context.fillText(labelText, canvas.width/2, canvas.height/3);
        context.fillText('10000㎡', canvas.width/2, canvas.height * 2/3);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        
        sprite.scale.set(10, 5, 1);
        
        console.log('Label Debug:', {
            objectName: object.name,
            position: object.position,
            cameraPosition: this.camera.position,
            cameraFOV: this.camera.fov,
            spriteScale: sprite.scale,
            canvasSize: { width: canvas.width, height: canvas.height }
        });
        
        const adjustScale = (e) => {
            if (e.key === '+') {
                sprite.scale.x *= 1.1;
                sprite.scale.y *= 1.1;
            } else if (e.key === '-') {
                sprite.scale.x *= 0.9;
                sprite.scale.y *= 0.9;
            }
            console.log('New scale:', sprite.scale);
        };
        
        window.addEventListener('keydown', adjustScale);
        
        group.add(sprite);
        return group;
    }

    createFuncPin(x, y, z, label, area) {
        const pinGroup = new THREE.Group();

        const lineGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array([
            0, 0, 0,
            0, -y, 0
        ]);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x8A7CFF,
            linewidth: 1
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        pinGroup.add(line);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;

        context.fillStyle = 'rgba(255, 251, 251, 0.8)';
        const cornerRadius = 20;
        
        context.beginPath();
        context.moveTo(cornerRadius, 0);
        context.lineTo(canvas.width - cornerRadius, 0);
        context.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
        context.lineTo(canvas.width, canvas.height - cornerRadius);
        context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
        context.lineTo(cornerRadius, canvas.height);
        context.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
        context.lineTo(0, cornerRadius);
        context.quadraticCurveTo(0, 0, cornerRadius, 0);
        context.closePath();
        context.fill();
        
        context.font = 'bold 60px Arial';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width/2, canvas.height/3);

        context.font = 'bold 50px Arial';
        context.fillText(area, canvas.width/2, canvas.height * 2/3);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(4, 2, 1);
        sprite.position.y = 3;
        pinGroup.add(sprite);

        pinGroup.position.set(x, y, z);
        pinGroup.visible = false;
        
        return pinGroup;
    }

    initFuncPins() {
        const pinPositions = [
            { x: 1.5, y: 10, z: -51, label: 'Social Housing', area: '78300㎡' },
            { x: -15.5, y: 6.5, z: -28, label: 'Retail', area: '25400㎡' },
            { x: 5.5, y: 5, z: -39.5, label: 'Office', area: '51400㎡' },
            { x: 0, y: 20, z: -14.5, label: 'Hotel', area: '16800㎡' },
            { x: 1.5, y: 5, z: -5.5, label: 'Flexible Space', area: '540㎡' },
            { x: 31, y: 9, z: -27, label: 'Paketpostareal', area: '20000㎡' }
        ];

        this.funcPins = pinPositions.map(pos => 
            this.createFuncPin(pos.x, pos.y, pos.z, pos.label, pos.area)
        );

        this.funcPins.forEach(pin => this.scene.add(pin));
    }

    showFunctionality() {
        if (this.isFunctionalityMode) return;
        
        this.exitButton.style.display = 'flex';
        
        this.funcGroups.forEach(group => {
            this.scene.remove(group);
        });
        this.funcGroups = [];
        
        const existingLabels = document.querySelectorAll('.function-label-container');
        existingLabels.forEach(label => label.remove());
        
        this.scene.traverse((object) => {
            if (object.isMesh && object.name.toLowerCase().includes('model')) {
                object.visible = false;
            }
        });
        
        this.scene.traverse((object) => {
            if (object.isMesh && object.name.toLowerCase().includes('func')) {
                object.visible = true;
                
                const container = document.createElement('div');
                container.className = 'function-label-container';
                container.style.cssText = `
                    position: fixed;
                    z-index: 1000;
                    display: none;
                    pointer-events: none;
                    transform: translate(-50%, -100%);
                `;
                
                const label = document.createElement('div');
                label.className = 'function-label';
                label.style.cssText = `
                    background: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    text-align: center;
                    min-width: 200px;
                    font-family: Arial, sans-serif;
                `;
                
                const labelText = object.name.split('_')[1] || 'Function';
                label.innerHTML = `
                    <div style="
                        color: #333;
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 4px;
                    ">${labelText}</div>
                    <div style="
                        color: #666;
                        font-size: 16px;
                    ">10000㎡</div>
                `;
                
                container.appendChild(label);
                document.body.appendChild(container);
                
                this.funcGroups.push({
                    container: container,
                    object: object,
                    worldPos: new THREE.Vector3()
                });
            }
        });

        const updateLabels = () => {
            this.funcGroups.forEach(({container, object, worldPos}) => {
                object.getWorldPosition(worldPos);
                
                const screenPos = worldPos.clone().project(this.camera);
                
                const x = (screenPos.x + 1) * window.innerWidth / 2;
                const y = (-screenPos.y + 1) * window.innerHeight / 2;
                
                if (screenPos.z < 1) {
                    container.style.display = 'block';
                    container.style.left = `${x}px`;
                    container.style.top = `${y}px`;
                } else {
                    container.style.display = 'none';
                }
            });
        };
        
        const originalUpdate = this.update.bind(this);
        this.update = () => {
            originalUpdate();
            updateLabels();
        };

        this.funcPins.forEach(pin => pin.visible = true);

        this.animateCamera(
            { x: 0, y: 10, z: 20 },
            () => {
                this.isFunctionalityMode = true;
            }
        );

        this._previousAutoRotate = this.controls.autoRotate;
        this.controls.autoRotate = false;
    }

    hideFunctionality() {
        if (!this.isFunctionalityMode) return;
        
        const labels = document.querySelectorAll('.function-label-container');
        labels.forEach(label => label.remove());
        
        this.scene.traverse((object) => {
            if (object.isMesh && object.name.toLowerCase().includes('func')) {
                object.visible = false;
            }
            if (object.isMesh && object.name.toLowerCase().includes('model')) {
                object.visible = true;
            }
        });

        if (this.funcPins) {
            this.funcPins.forEach(pin => pin.visible = false);
        }
        
        this.isFunctionalityMode = false;
        if (this.exitButton) {
            this.exitButton.style.display = 'none';
        }

        this.resetCamera();
    }

    exitFunctionalityMode() {
        this.hideFunctionality();
    }

    animateCamera(targetPosition, onComplete) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const direction = new THREE.Vector3()
            .subVectors(this.controls.target, this.camera.position)
            .normalize();

        const distance = 30;
        const cameraTargetPosition = new THREE.Vector3()
            .copy(this.camera.position)
            .add(direction.multiplyScalar(distance));

        gsap.to(this.camera.position, {
            duration: 2,
            x: cameraTargetPosition.x,
            y: cameraTargetPosition.y,
            z: cameraTargetPosition.z,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
                if (onComplete) onComplete();
            }
        });
    }

    resetCamera() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const direction = new THREE.Vector3()
            .subVectors(this.controls.target, this.camera.position)
            .normalize();

        const distance = -30;
        const cameraTargetPosition = new THREE.Vector3()
            .copy(this.camera.position)
            .add(direction.multiplyScalar(distance));

        gsap.to(this.camera.position, {
            duration: 2,
            x: cameraTargetPosition.x,
            y: cameraTargetPosition.y,
            z: cameraTargetPosition.z,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }

    update() {
    }

    getFunctionArea(functionName) {
        const areaMap = {
            'Social Housing': '19000㎡',
            'Commercial': '15000㎡',
            'Office': '25000㎡',
            'Hotel': '12000㎡',
            'Flexible Space': '8000㎡',
            'Paketpostareal': '30000㎡'
        };
        return areaMap[functionName] || '0㎡';
    }
} 