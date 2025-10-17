import * as THREE from 'three';
import { gsap } from 'gsap';

export class SustainabilityViewer {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.isAnimating = false;
        this.isSustainabilityMode = false;
        
        this.initialCameraPosition = camera.position.clone();
        this.initialControlsTarget = controls.target.clone();
        
        this.createExitButton();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        window.addEventListener('click', this.onMouseClick.bind(this));
        
        this.createSusInfoPanel();
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
            this.exitSustainabilityMode();
        });
        
        document.body.appendChild(exitButton);
        this.exitButton = exitButton;
    }

    createSusInfoPanel() {
        const infoPanel = document.createElement('div');
        infoPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.5);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1001;
            display: none;
            max-width: 400px;
            width: 90%;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 2vh;
            right: 2vh;
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
        `;
        
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = 'rgba(0, 0, 0, 0.2)';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'rgba(0, 0, 0, 0.1)';
        });
        
        closeBtn.onclick = () => {
            infoPanel.style.display = 'none';
            this.controls.enabled = true;
        };
        
        infoPanel.appendChild(closeBtn);
        document.body.appendChild(infoPanel);
        this.infoPanel = infoPanel;
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            
            if (clickedObject.name.startsWith('glow_')) {
                const intersectionPoint = intersects[0].point;
                
                const direction = new THREE.Vector3()
                    .subVectors(this.camera.position, intersectionPoint)
                    .normalize();
                    
                const distance = 4;
                const newPosition = intersectionPoint.clone()
                    .add(direction.multiplyScalar(distance));
                
                this.controls.enabled = false;

                gsap.to(this.camera.position, {
                    duration: 1.5,
                    x: newPosition.x,
                    y: newPosition.y,
                    z: newPosition.z,
                    ease: "power2.inOut",
                    onComplete: () => {
                        this.showSusInfo(clickedObject.userData.originalMesh);
                    }
                });

                gsap.to(this.controls.target, {
                    duration: 1.5,
                    x: intersectionPoint.x,
                    y: intersectionPoint.y,
                    z: intersectionPoint.z,
                    ease: "power2.inOut"
                });
            }
        }
    }

    showSusInfo(object) {
        const objectName = object.name.toLowerCase();
        if (!objectName.includes('sun') && !objectName.includes('rain')) {
            return;
        }

        const closeBtn = this.infoPanel.querySelector('button');
        this.infoPanel.innerHTML = '';
        this.infoPanel.appendChild(closeBtn);

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            display: flex;
            gap: 20px;
            align-items: center;
        `;

        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            flex: 0 0 120px;
            height: 150px;
            border-radius: 10px;
            overflow: hidden;
        `;

        const image = document.createElement('img');
        image.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        const infoContainer = document.createElement('div');
        infoContainer.style.cssText = `
            flex: 1;
        `;

        if (objectName.includes('sun')) {
            image.src = './pic/solar.png';
            infoContainer.innerHTML = `
                <h3 style="margin: 0 0 15px 0;">Solar Roof</h3>
                <div style="display: grid; gap: 10px;">
                    <div>
                        <strong>Panels Quantity:</strong> 48 solar panels
                    </div>
                    <div>
                        <strong>Single Panel Size:</strong> 1956 × 992 × 40mm
                    </div>
                    <div>
                        <strong>Single Panel Power:</strong> 100w
                    </div>
                    <div>
                        <strong>Total Power:</strong> 4.8kw
                    </div>
                    <div>
                        <strong>Annual Power:</strong> 5,000kWh
                    </div>
                </div>
            `;
        } else {
            image.src = './pic/rain.png';
            infoContainer.innerHTML = `
                <h3 style="margin: 0 0 15px 0;">Rainwater Collection Roof</h3>
                <div style="display: grid; gap: 10px;">
                    <div>
                        <strong>Collection Area:</strong> 2,000㎡
                    </div>
                    <div>
                        <strong>Storage Capacity:</strong> 50,000L
                    </div>
                    <div>
                        <strong>Annual Collection:</strong> 80,000L
                    </div>
                    <div>
                        <strong>Usage:</strong> Greening irrigation, Toilet flushing
                    </div>
                </div>
            `;
        }

        imageContainer.appendChild(image);
        content.appendChild(imageContainer);
        content.appendChild(infoContainer);
        this.infoPanel.appendChild(content);
        this.infoPanel.style.display = 'block';
    }

    showSustainability() {
        if (this.isSustainabilityMode) return;
        
        this.exitButton.style.display = 'block';
        this.animateCamera(
            30,
            () => {
                this.isSustainabilityMode = true;
                this.highlightSustainableElements();
            }
        );
    }

    exitSustainabilityMode() {
        if (!this.isSustainabilityMode) return;
        
        this.resetCamera();
        this.isSustainabilityMode = false;
        this.exitButton.style.display = 'none';
        this.resetHighlights();
    }

    highlightSustainableElements() {
        let count = 0;
        this.glowEffects = [];
        
        this.scene.traverse((object) => {
            if (object.isMesh) {
                if (object.name.toLowerCase().includes('sun') || 
                    object.name.toLowerCase().includes('rain')) {
                    count++;
                    
                    if (Array.isArray(object.material)) {
                        object.userData.originalMaterials = object.material.map(mat => mat.clone());
                    } else {
                        object.userData.originalMaterial = object.material.clone();
                    }
                    
                    const glowMaterial = new THREE.MeshStandardMaterial({
                        color: object.name.toLowerCase().includes('sun') ? 0xff4500 : 0x00ffff,
                        emissive: object.name.toLowerCase().includes('sun') ? 0xff4500 : 0x00ffff,
                        emissiveIntensity: 0.5,
                        metalness: 0.8,
                        roughness: 0.2
                    });
                    
                    if (Array.isArray(object.material)) {
                        object.material = object.material.map(() => glowMaterial);
                    } else {
                        object.material = glowMaterial;
                    }

                    this.createGlowEffect(object);
                }
            }
        });
    }

    createGlowEffect(mesh) {
        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = bbox.getSize(new THREE.Vector3());
        const center = bbox.getCenter(new THREE.Vector3());
        const height = 3;
        
        const glowGeometry = new THREE.BufferGeometry();
        const positions = mesh.geometry.attributes.position;
        const vertices = [];
        const indices = [];
        const colors = [];
        
        const worldMatrix = mesh.matrixWorld;
        
        const baseColor = mesh.name.toLowerCase().includes('sun') ? 
            new THREE.Color(0xff4500) :
            new THREE.Color(0x00ffff);
        
        let maxY = -Infinity;
        for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positions, i);
            vertex.applyMatrix4(worldMatrix);
            if (vertex.y > maxY) maxY = vertex.y;
        }
        
        for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(positions, i);
            vertex.applyMatrix4(worldMatrix);
            
            vertices.push(vertex.x, vertex.y, vertex.z);
            colors.push(baseColor.r, baseColor.g, baseColor.b);
            
            vertices.push(vertex.x, vertex.y + height, vertex.z);
            colors.push(baseColor.r, baseColor.g, baseColor.b);
        }
        
        for (let i = 0; i < positions.count; i++) {
            const current = i * 2;
            const next = ((i + 1) % positions.count) * 2;
            
            indices.push(current, current + 1, next + 1);
            indices.push(current, next + 1, next);
        }
        
        glowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        glowGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        glowGeometry.setIndex(indices);
        glowGeometry.computeVertexNormals();
        
        const material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const glowEffect = new THREE.Mesh(glowGeometry, material);
        
        glowEffect.name = `glow_${mesh.name}`;
        glowEffect.userData.originalMesh = mesh;
        
        this.scene.add(glowEffect);
        this.glowEffects.push(glowEffect);
        
        gsap.to(material, {
            opacity: 0.1,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut"
        });
    }

    resetHighlights() {
        let count = 0;
        
        this.scene.traverse((object) => {
            if (object.isMesh && (object.name.toLowerCase().includes('sun') || 
                object.name.toLowerCase().includes('rain'))) {
                if (Array.isArray(object.userData.originalMaterials)) {
                    object.material = object.userData.originalMaterials;
                    count++;
                } else if (object.userData.originalMaterial) {
                    object.material = object.userData.originalMaterial;
                    count++;
                }
            }
        });

        if (this.glowEffects) {
            this.glowEffects.forEach(effect => {
                this.scene.remove(effect);
            });
            this.glowEffects = [];
        }
    }

    animateCamera(distance, onComplete) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const direction = new THREE.Vector3()
            .subVectors(this.controls.target, this.camera.position)
            .normalize();

        const cameraTargetPosition = new THREE.Vector3()
            .copy(this.camera.position)
            .add(direction.multiplyScalar(distance));

        gsap.to(this.camera.position, {
            duration: 1.5,
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
            duration: 1.5,
            x: cameraTargetPosition.x,
            y: cameraTargetPosition.y,
            z: cameraTargetPosition.z,
            ease: "power2.inOut",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
    }
} 