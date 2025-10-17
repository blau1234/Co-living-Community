import * as THREE from 'three';
import { gsap } from 'gsap';

export class PubSpaceViewer {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.isAnimating = false;
        this.isPubSpaceMode = false;
        
        this.initialCameraPosition = camera.position.clone();
        this.initialControlsTarget = controls.target.clone();
        
        this.createExitButton();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        window.addEventListener('click', this.onMouseClick.bind(this));
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
            this.exitPubSpaceMode();
        });
        
        document.body.appendChild(exitButton);
        this.exitButton = exitButton;
    }

    onMouseClick(event) {
        if (!this.isPubSpaceMode) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            
            if (clickedObject.name.startsWith('glow_')) {
                const event = new CustomEvent('showGreenSpace');
                window.dispatchEvent(event);

                const intersectionPoint = intersects[0].point;
                const offset = new THREE.Vector3(2, 2, 2);
                const newPosition = intersectionPoint.clone().add(offset);
                
                this.controls.enabled = false;

                gsap.to(this.camera.position, {
                    duration: 1.5,
                    x: newPosition.x,
                    y: newPosition.y,
                    z: newPosition.z,
                    ease: "power2.inOut"
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

    showPubSpace() {
        if (this.isPubSpaceMode) return;
        
        this.exitButton.style.display = 'block';
        this.animateCamera(
            30,
            () => {
                this.isPubSpaceMode = true;
                this.highlightPubElements();
            }
        );
    }

    exitPubSpaceMode() {
        if (!this.isPubSpaceMode) return;
        
        this.resetCamera();
        this.isPubSpaceMode = false;
        this.exitButton.style.display = 'none';
        this.resetHighlights();
        this.controls.enabled = true;
    }

    highlightPubElements() {
        let count = 0;
        this.glowEffects = [];
        
        this.scene.traverse((object) => {
            if (object.isMesh) {
                if (object.name.toLowerCase().includes('green') || 
                    object.name.toLowerCase().includes('grass')) {
                    count++;
                    
                    if (Array.isArray(object.material)) {
                        object.userData.originalMaterials = object.material.map(mat => mat.clone());
                    } else {
                        object.userData.originalMaterial = object.material.clone();
                    }
                    
                    const glowMaterial = new THREE.MeshStandardMaterial({
                        color: 0x90EE90, // 浅绿色
                        emissive: 0x90EE90,
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
        const baseColor = new THREE.Color(0x90EE90); // 浅绿色
        
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
        this.scene.traverse((object) => {
            if (object.isMesh && (object.name.toLowerCase().includes('green') || 
                object.name.toLowerCase().includes('grass'))) {
                if (Array.isArray(object.userData.originalMaterials)) {
                    object.material = object.userData.originalMaterials;
                } else if (object.userData.originalMaterial) {
                    object.material = object.userData.originalMaterial;
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