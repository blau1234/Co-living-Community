import * as THREE from 'three';
import { gsap } from 'gsap';

export class LocationPins {
    constructor(scene, camera, controls) {
        this.scene = scene;
        this.camera = camera;
        this.controls = controls;
        this.pins = [];
        this.isAnimating = false;
        this.isVirtualMode = false;
        
       
        this.initialCameraPosition = camera.position.clone();
        this.initialControlsTarget = controls.target.clone();
        
        this.initPins();
        this.setupClickHandler();
        this.createExitButton();
    }

    createPin(x, y, z, label) {
        const pinGroup = new THREE.Group();
    
        const pinGeometry = new THREE.ConeGeometry(0.8, 2, 32);
        const pinMaterial = new THREE.MeshStandardMaterial({
            color: 0x8A7CFF,  
            emissive: 0xB19EFF, 
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
    
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.rotation.x = Math.PI;
        pinGroup.add(pin);
    
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
    
        
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
        
      
        context.font = 'bold 48px Arial';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width/2, canvas.height/2);
    
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

    initPins() {
        this.pin1 = this.createPin(-20, 1, -11, 'Street');
        this.pin2 = this.createPin(1.8, 13, -2, 'Tower');
        this.pin3 = this.createPin(15.6, 8.2, -41, 'Rooftop');
        this.pin4 = this.createPin(-4.5, 10.5, -15, 'Hotel');
        this.pin5 = this.createPin(24.5, 10, 7, 'Office');
        this.pin6 = this.createPin(12, 2, -24, 'Paketpost');
        this.pin7 = this.createPin(-1, 2, -31, 'Lawn');
        this.pin8 = this.createPin(-22, 2, -40, 'Street');
        this.pin9 = this.createPin(6.5, 4.5, -50, 'Apartment');
        this.pin10 = this.createPin(-3, 4.5, -45, 'Rooftop');
        this.pin11 = this.createPin(27, 4.5, -56, 'Rooftop');
        this.pin12 = this.createPin(37, 2, -67, 'Street');

        this.pins = [
            this.pin1, this.pin2, this.pin3, this.pin4, 
            this.pin5, this.pin6, this.pin7, this.pin8,
            this.pin9, this.pin10, this.pin11, this.pin12
        ];
        this.pins.forEach(pin => this.scene.add(pin));
    }

    setupClickHandler() {
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const container = document.getElementById('viewerContainer');

        container.addEventListener('click', (event) => {
          
            if (!this.isVirtualMode) return;
            
            const rect = container.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
            
            raycaster.setFromCamera(pointer, this.camera);
            const intersects = raycaster.intersectObjects(this.pins, true);
            
            if (intersects.length > 0) {
                let clickedPin = intersects[0].object;
                while (clickedPin.parent && this.pins.indexOf(clickedPin) === -1) {
                    clickedPin = clickedPin.parent;
                }
                
                let panoramaPath;
                if (clickedPin === this.pin1) panoramaPath = '/360pic/1.png';
                else if (clickedPin === this.pin2) panoramaPath = '/360pic/2.png';
                else if (clickedPin === this.pin3) panoramaPath = '/360pic/3.png';
                else if (clickedPin === this.pin4) panoramaPath = '/360pic/4.png';
                else if (clickedPin === this.pin5) panoramaPath = '/360pic/5.png';
                else if (clickedPin === this.pin6) panoramaPath = '/360pic/6.png';
                else if (clickedPin === this.pin7) panoramaPath = '/360pic/7.png';
                else if (clickedPin === this.pin8) panoramaPath = '/360pic/8.png';
                else if (clickedPin === this.pin9) panoramaPath = '/360pic/9.png';
                else if (clickedPin === this.pin10) panoramaPath = '/360pic/10.png';
                else if (clickedPin === this.pin11) panoramaPath = '/360pic/11.png';
                else if (clickedPin === this.pin12) panoramaPath = '/360pic/12.png';
                
                if (window.showPanorama) {
                    window.showPanorama(panoramaPath);
                }
            }
        });
    }

    show() {
        this.pins.forEach(pin => pin.visible = true);
    }

    hide() {
        this.pins.forEach(pin => pin.visible = false);
    }

    createExitButton() {
        const exitButton = document.createElement('button');
        exitButton.innerHTML = '×';  // 使用 × 符号
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
            this.hideVirtualTour();
            exitButton.style.display = 'none';
        });
        
        document.body.appendChild(exitButton);
        this.exitButton = exitButton;
    }

    startVirtualTour() {
        if (this.isVirtualMode) return;
        
        this.show();
        this.exitButton.style.display = 'block';
        this.animateCamera(
            { x: -18.8, y: 3, z: -12.6 },
            () => {
                console.log('Virtual tour animation completed');
                this.isVirtualMode = true;
            }
        );
    }

    hideVirtualTour() {
        if (!this.isVirtualMode) return;
        
        this.hide();
        this.resetCamera();
        this.isVirtualMode = false;
        this.exitButton.style.display = 'none';
    }

    animateCamera(targetPosition, onComplete) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // 计算从当前相机位置到目标点的方向向量
        const direction = new THREE.Vector3()
            .subVectors(this.controls.target, this.camera.position)
            .normalize();

        // 设置新的相机位置：沿着视线方向向前移动
        const distance = 30;
        const cameraTargetPosition = new THREE.Vector3()
            .copy(this.camera.position)
            .add(direction.multiplyScalar(distance));

        const timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
                if (onComplete) onComplete();
            }
        });

        // 将duration从2改为0.8秒
        timeline.to(this.camera.position, {
            duration: 2,
            x: cameraTargetPosition.x,
            y: cameraTargetPosition.y,
            z: cameraTargetPosition.z,
            ease: "power2.inOut"
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

        const timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
            }
        });

        timeline.to(this.camera.position, {
            duration: 2,
            x: cameraTargetPosition.x,
            y: cameraTargetPosition.y,
            z: cameraTargetPosition.z,
            ease: "power2.inOut"
        });
    }
} 