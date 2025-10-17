import * as THREE from 'three';

export class HotAirBalloons {
    constructor(scene, renderer, camera) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.balloons = [];
        this.flags = [];
        this.flagAnimationEnabled = true;
        this.humClickCount = 0; // HUM Surprise
        this.balloonClickCount = 0; // Balloon Surprise
        this.sbanClickCount = 0; // SBAN Surprise
        this.flagClickCount = 0; // Flag Surprise
        this.tumClickCount = 0; // TUM Surprise
        
        // car animation
        this.car1Animation = {
            isMoving: false,
            startPosition: null,
            startTime: null
        };
        
        this.car2Animation = {
            isMoving: false,
            startPosition: null,
            startTime: null
        };
        
        this.initBalloons();
        this.initFlags();
        
        
        this.setupClickHandler();
    }

    createHotAirBalloon() {
        const balloonGroup = new THREE.Group();
        
        const balloonGeometry = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7);
        const balloonMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFF4BD,
            roughness: 0.4,
            metalness: 0.1
        });
        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
        balloonGroup.add(balloon);
    
        const basketGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
        const basketMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });
        const basket = new THREE.Mesh(basketGeometry, basketMaterial);
        basket.position.y = -4.5;
        balloonGroup.add(basket);
    
        const ropePositions = [
            [-0.7, 0, -0.7],
            [0.7, 0, -0.7],
            [-0.7, 0, 0.7],
            [0.7, 0, 0.7]
        ];
    
        ropePositions.forEach(pos => {
            const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
            const ropeMaterial = new THREE.MeshStandardMaterial({
                color: 0x463E3F,
                roughness: 0.8
            });
            const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
            rope.position.set(pos[0], -2.5, pos[2]);
            balloonGroup.add(rope);
        });
        
        return balloonGroup;
    }

    initBalloons() {
        const numBalloons = 3;
        
        for (let i = 0; i < numBalloons; i++) {
            const balloon = this.createHotAirBalloon();
            
            balloon.position.set(
                Math.random() * 180 - 100,
                30 + Math.random() * 10,
                Math.random() * 180 - 100
            );
            
            const scale = 0.8 + Math.random() * 2;
            balloon.scale.set(scale, scale, scale);
            
            this.balloons.push({
                mesh: balloon,
                speed: 0.025 + Math.random() * 0.05,
                direction: new THREE.Vector3(
                    Math.random() - 0.5,
                    0,
                    Math.random() - 0.5
                ).normalize(),
                initialY: balloon.position.y,
                floatOffset: Math.random() * Math.PI * 2
            });
            
            this.scene.add(balloon);
        }
    }

    initFlags() {
        const flagGeometry = new THREE.BoxGeometry(10, 5, 0.1);
        
       
        const frontCanvas = document.createElement('canvas');
        frontCanvas.width = 512;  
        frontCanvas.height = 256;
        
        
        const frontContext = frontCanvas.getContext('2d');
        const frontGradient = frontContext.createLinearGradient(0, 0, 0, frontCanvas.height);
        frontGradient.addColorStop(0, '#99C2FF');  
        frontGradient.addColorStop(1, '#CC8FFF'); 
        frontContext.fillStyle = frontGradient;
        frontContext.fillRect(0, 0, frontCanvas.width, frontCanvas.height);
        
            
        frontContext.fillStyle = '#FFFFFF';         
        frontContext.strokeStyle = '#6666CC';  
        frontContext.lineWidth = 1;  
        frontContext.font = 'bold 80px Arial';
        frontContext.textAlign = 'center';
        frontContext.textBaseline = 'middle';
        frontContext.fillText('I ❤ Munich', frontCanvas.width/2, frontCanvas.height/2);
        
     
        const backCanvas = document.createElement('canvas');
        const backContext = backCanvas.getContext('2d');
        backCanvas.width = 512;
        backCanvas.height = 256;
        
      
        const backGradient = backContext.createLinearGradient(0, 0, 0, backCanvas.height);
        backGradient.addColorStop(0, '#99C2FF');  
        backGradient.addColorStop(1, '#CC8FFF');  
        backContext.fillStyle = backGradient;
        backContext.fillRect(0, 0, backCanvas.width, backCanvas.height);
     
        backContext.fillStyle = '#FFFFFF';  
        backContext.strokeStyle = '#6666CC'; 
        backContext.lineWidth = 1;  
        backContext.font = 'bold 80px Arial';
        backContext.textAlign = 'center';
        backContext.textBaseline = 'middle';
        backContext.fillText('Co-Living', backCanvas.width/2, backCanvas.height/2);
        
        const frontTexture = new THREE.CanvasTexture(frontCanvas);
        const backTexture = new THREE.CanvasTexture(backCanvas);
        
       
        const flagMaterials = [
            new THREE.MeshBasicMaterial({ color: 0xcccccc }), // right
            new THREE.MeshBasicMaterial({ color: 0xcccccc }), // left
            new THREE.MeshBasicMaterial({ color: 0xcccccc }), // top
            new THREE.MeshBasicMaterial({ color: 0xcccccc }), // bottom
            new THREE.MeshBasicMaterial({ map: frontTexture }), // front
            new THREE.MeshBasicMaterial({ map: backTexture })  // back
        ];
        
        const flag = new THREE.Mesh(flagGeometry, flagMaterials);
        flag.position.set(30, 18, -15);  
        flag.rotation.y = Math.PI / 2;
        
        this.flags.push({
            mesh: flag,
            initialY: flag.position.y,  
            floatOffset: Math.random() * Math.PI * 2,
            initialX: flag.position.x   
        });
        
        this.scene.add(flag);
    }

    update() {
        
        const time = Date.now() * 0.0005; 
        
       
        if (this.balloons.length > 0) {
            for (let i = 0; i < this.balloons.length; i++) {
                const balloon = this.balloons[i];
                
                balloon.mesh.position.x += balloon.direction.x * balloon.speed;
                balloon.mesh.position.z += balloon.direction.z * balloon.speed;
                
                
                balloon.mesh.position.y = balloon.initialY + Math.sin(time + balloon.floatOffset) * 0.3;
                
                
                const boundary = 100;
                if (Math.abs(balloon.mesh.position.x) > boundary) {
                    balloon.mesh.position.x *= -0.99;
                }
                if (Math.abs(balloon.mesh.position.z) > boundary) {
                    balloon.mesh.position.z *= -0.99;
                }
            }
        }
        
        if (this.flagAnimationEnabled && this.flags.length > 0) {
            const flag = this.flags[0];
            
            flag.mesh.position.y = flag.initialY + Math.sin(time) * 0.3;
            flag.mesh.rotation.y = time * 0.15;
        }

        
        this.updateCar1Animation();
        this.updateCar2Animation();
    }

    updateCar1Animation() {
        const car1 = this.scene.getObjectByName('car1');
        if (!car1) return;

        if (!this.car1Animation.isMoving) {
            this.car1Animation.isMoving = true;
            this.car1Animation.startPosition = car1.position.clone();
            this.car1Animation.startTime = Date.now();
        }

        const elapsedTime = (Date.now() - this.car1Animation.startTime) / 1000; 
        const duration = 10; 
        const distance = 130; 

        if (elapsedTime < duration) {
           
            const progress = elapsedTime / duration;
            car1.position.z = this.car1Animation.startPosition.z + (distance * progress);
        } else {
            
            car1.position.z = this.car1Animation.startPosition.z;
            this.car1Animation.isMoving = false;
        }
    }

    updateCar2Animation() {
        const car2 = this.scene.getObjectByName('car2');
        if (!car2) return;

        if (!this.car2Animation.isMoving) {
            
            this.car2Animation.isMoving = true;
            this.car2Animation.startPosition = car2.position.clone();
            this.car2Animation.startTime = Date.now();
        }

        const elapsedTime = (Date.now() - this.car2Animation.startTime) / 1000; 
        const duration = 16; 
        const distance = 130; 

        if (elapsedTime < duration) {
            
            const progress = elapsedTime / duration;
            car2.position.z = this.car2Animation.startPosition.z - (distance * progress);
        } else {
            
            car2.position.z = this.car2Animation.startPosition.z;
            this.car2Animation.isMoving = false;
        }
    }

    dispose() {
        if (this.balloons) {
            this.balloons.forEach(balloon => {
                if (balloon.mesh) {
                    if (balloon.mesh.geometry) balloon.mesh.geometry.dispose();
                    if (balloon.mesh.material) balloon.mesh.material.dispose();
                    this.scene.remove(balloon.mesh);
                }
            });
            this.balloons = [];
        }
        
        if (this.flags) {
            this.flags.forEach(flag => {
                if (flag.mesh) {
                    if (flag.mesh.geometry) flag.mesh.geometry.dispose();
                    if (Array.isArray(flag.mesh.material)) {
                        flag.mesh.material.forEach(material => {
                            if (material.map) material.map.dispose();
                            material.dispose();
                        });
                    }
                    this.scene.remove(flag.mesh);
                }
            });
            this.flags = [];
        }
        
        const messages = document.querySelectorAll('.flag-message');
        messages.forEach(msg => msg.remove());
    }

    setupClickHandler() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        document.addEventListener('click', (event) => {
            if (!this.camera) {
                console.warn('相机对象未找到');
                return;
            }
            
            const clickX = event.clientX;
            const clickY = event.clientY;
            
            mouse.x = (clickX / window.innerWidth) * 2 - 1;
            mouse.y = -(clickY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            
            const flagMeshes = this.flags.map(flag => flag.mesh);
            const balloonMeshes = this.balloons.map(balloon => balloon.mesh);
            const allObjects = [...flagMeshes, ...balloonMeshes];
            
            this.scene.traverse((object) => {
                if (object.isMesh && (object.name.includes('HUM') || object.name.includes('SBAN') || object.name.includes('TUM'))) {
                    allObjects.push(object);
                }
            });
            
            const intersects = raycaster.intersectObjects(allObjects, true);
            
            if (intersects.length > 0) {
                const hitObject = intersects[0].object;
                
                if (hitObject.name.toLowerCase().includes('tum')) {
                    this.triggerTumEffect(hitObject, { x: clickX, y: clickY });
                } else if (flagMeshes.includes(hitObject)) {
                    this.triggerFlagAnimation();
                } else if (hitObject.name.includes('HUM')) {
                    this.triggerBalloonAnimation({
                        mesh: hitObject,
                        initialY: hitObject.position.y,
                        clickPosition: { x: clickX, y: clickY }
                    });
                } else if (hitObject.name.includes('SBAN')) {
                    this.triggerSbanEffect(hitObject);
                } else {
                    const balloonIndex = this.balloons.findIndex(b => 
                        b.mesh === hitObject || b.mesh.children.includes(hitObject)
                    );
                    if (balloonIndex !== -1) {
                        this.triggerBalloonAnimation(this.balloons[balloonIndex]);
                    }
                }
            }
        });
    }

    triggerFlagAnimation() {
        const flag = this.flags[0].mesh;
        
        const originalY = this.flags[0].initialY; 
        const originalRotation = flag.rotation.y;
        
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                flag.position.y = originalY + Math.sin(progress * Math.PI * 2) * 5;
                flag.rotation.y = originalRotation + progress * Math.PI * 4;
                requestAnimationFrame(animate);
            } else {
                flag.position.y = originalY;
                flag.rotation.y = originalRotation;
            }
        };
        
        animate();
        
        const emojis = ['😊', '🌈', '✨', '🎈', '🎉'];
        const emojiCount = 15; 
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'flag-message';
            emoji.style.cssText = `
                position: fixed;
                font-size: 24px;
                user-select: none;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const rect = this.flags[0].mesh.position;
            const screenPosition = this.getScreenPosition(rect);
            
            const startX = screenPosition.x + (Math.random() - 0.5) * 100;
            const startY = screenPosition.y;
            
            emoji.style.left = startX + 'px';
            emoji.style.top = startY + 'px';
            
            document.body.appendChild(emoji);
            
            const angle = (Math.random() - 0.5) * Math.PI / 2; 
            const speed = 2 + Math.random() * 2; 
            const rotationSpeed = (Math.random() - 0.5) * 8; 
            let rotation = 0;
            let currentY = startY;
            let currentX = startX;
            
            const animateEmoji = () => {
                currentY += Math.cos(angle) * speed;
                currentX += Math.sin(angle) * speed;
                rotation += rotationSpeed;
                
                emoji.style.transform = `translate(0, ${currentY - startY}px) rotate(${rotation}deg)`;
                emoji.style.left = currentX + 'px';
                emoji.style.opacity = Math.max(0, 1 - (currentY - startY) / 200);
                
                if (currentY - startY < 200 && emoji.parentNode) {
                    requestAnimationFrame(animateEmoji);
                } else if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            };
            
            requestAnimationFrame(animateEmoji);
        }

        const goodLuckText = document.createElement('div');
        goodLuckText.textContent = 'Good Luck!';
        goodLuckText.className = 'flag-message';
        goodLuckText.style.cssText = `
            position: fixed;
            font-size: 36px;
            font-weight: bold;
            color:rgb(255, 255, 255);
            text-shadow: 2px 2px 4px rgba(255, 141, 141, 0.3);
            user-select: none;
            pointer-events: none;
            z-index: 1000;
            opacity: 50;
            transform: scale(0.5);
            transition: all 0.3s ease-out;
        `;
        
        const flagPosition = this.getScreenPosition(this.flags[0].mesh.position);
        goodLuckText.style.left = `${flagPosition.x}px`;
        goodLuckText.style.top = `${flagPosition.y}px`;
        
        document.body.appendChild(goodLuckText);
        
        setTimeout(() => {
            goodLuckText.style.opacity = '1';
            goodLuckText.style.transform = 'scale(1) translateY(-50px)';
        }, 100);
        
        setTimeout(() => {
            goodLuckText.style.opacity = '0';
            goodLuckText.style.transform = 'scale(1.2) translateY(-100px)';
            setTimeout(() => {
                if (goodLuckText.parentNode) {
                    document.body.removeChild(goodLuckText);
                }
            }, 300);
        }, 1500);

        this.flagClickCount++;
        if (this.flagClickCount === 10) {
            this.triggerHeartRain();
            this.flagClickCount = 0;
        }
    }

    triggerBalloonAnimation(balloon) {
        const originalY = balloon.initialY;
        const originalPosition = balloon.mesh.position.clone();
        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                balloon.mesh.position.y = originalPosition.y + Math.sin(progress * Math.PI) * 10;
                balloon.mesh.rotation.y += 0.1;
                requestAnimationFrame(animate);
            } else {
                balloon.mesh.position.y = originalPosition.y;
            }
        };

        animate();

        const emojis = ['😂', '😂', '🌟', '💫'];
        const emojiCount = 25;

        const screenPosition = balloon.clickPosition || this.getScreenPosition(balloon.mesh.position);

        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'flag-message';
            emoji.style.cssText = `
                position: fixed;
                font-size: 24px;
                user-select: none;
                pointer-events: none;
                z-index: 1000;
            `;

            const startX = screenPosition.x + (Math.random() - 0.5) * 100;
            const startY = screenPosition.y;

            emoji.style.left = startX + 'px';
            emoji.style.top = startY + 'px';

            document.body.appendChild(emoji);

            const angle = (Math.random() - 0.5) * Math.PI / 2; 
            const speed = 2 + Math.random() * 2; 
            const rotationSpeed = (Math.random() - 0.5) * 8; 
            let rotation = 0;
            let currentY = startY;
            let currentX = startX;

            const animateEmoji = () => {
                currentY += Math.cos(angle) * speed;
                currentX += Math.sin(angle) * speed;
                rotation += rotationSpeed;

                emoji.style.transform = `translate(0, ${currentY - startY}px) rotate(${rotation}deg)`;
                emoji.style.left = currentX + 'px';
                emoji.style.opacity = Math.max(0, 1 - (currentY - startY) / 200);

                if (currentY - startY < 200 && emoji.parentNode) {
                    requestAnimationFrame(animateEmoji);
                } else if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            };

            requestAnimationFrame(animateEmoji);
        }

        const celebrationText = document.createElement('div');
        celebrationText.textContent = balloon.mesh.name.includes('HUM') ? 'YOU EAT IT!' : 'YOU GOT IT!';
        celebrationText.className = 'flag-message';
        celebrationText.style.cssText = `
            position: fixed;
            font-size: 36px;
            font-weight: bold;
            color: rgb(255, 255, 255);
            text-shadow: 2px 2px 4px rgba(255, 141, 141, 0.3);
            user-select: none;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.3s ease-out;
        `;

        celebrationText.style.left = `${screenPosition.x}px`;
        celebrationText.style.top = `${screenPosition.y}px`;

        document.body.appendChild(celebrationText);

        setTimeout(() => {
            celebrationText.style.opacity = '1';
            celebrationText.style.transform = 'scale(1) translateY(-50px)';
        }, 100);

        setTimeout(() => {
            celebrationText.style.opacity = '0';
            celebrationText.style.transform = 'scale(1.2) translateY(-100px)';
            setTimeout(() => {
                if (celebrationText.parentNode) {
                    document.body.removeChild(celebrationText);
                }
            }, 300);
        }, 1500);

        if (balloon.mesh.name.includes('HUM')) {
            this.humClickCount++;
            if (this.humClickCount === 10) {
                this.triggerBurgerRain();
                this.humClickCount = 0;
            }
        } else {
            this.balloonClickCount++;
            if (this.balloonClickCount === 5) {
                this.triggerStarBalloonRain();
                this.balloonClickCount = 0;
            }
        }
    }

    triggerBurgerRain() {
        const burgerCount = 150; 
        const duration = 3000; 
        
        for (let i = 0; i < burgerCount; i++) {
            const burger = document.createElement('div');
            burger.textContent = '🍔';
            burger.className = 'burger-rain';
            burger.style.cssText = `
                position: fixed;
                font-size: 30px;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: fall ${1.5 + Math.random() * 0.5}s linear;
            `;
            
            document.body.appendChild(burger);
            
            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(105vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (burger.parentNode) {
                    document.body.removeChild(burger);
                }
            }, duration);
        }
    }

    triggerStarBalloonRain() {
        const emojiCount = 150; 
        const duration = 4000; 
        const emojis = ['⭐', '🌟', '✨', '🎈', '🎊']; 
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'star-balloon-rain';
            emoji.style.cssText = `
                position: fixed;
                font-size: 30px;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: starBalloonFall ${1.5 + Math.random() * 0.5}s linear;
            `;
            
            document.body.appendChild(emoji);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes starBalloonFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(105vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            }, duration);
        }
    }

    triggerSbanEffect(object) {
        const screenPosition = this.getScreenPosition(object.position);
        
        const emojis = ['🌟', '✨', '💫', '⭐', '🎉'];
        const emojiCount = 10;
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'flag-message';
            emoji.style.cssText = `
                position: fixed;
                font-size: 24px;
                user-select: none;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const startX = screenPosition.x + (Math.random() - 0.5) * 100;
            const startY = screenPosition.y;
            
            emoji.style.left = startX + 'px';
            emoji.style.top = startY + 'px';
            
            document.body.appendChild(emoji);
            
            const angle = (Math.random() - 0.5) * Math.PI / 2;
            const speed = 2 + Math.random() * 2;
            const rotationSpeed = (Math.random() - 0.5) * 8;
            let rotation = 0;
            let currentY = startY;
            let currentX = startX;
            
            const animateEmoji = () => {
                currentY += Math.cos(angle) * speed;
                currentX += Math.sin(angle) * speed;
                rotation += rotationSpeed;
                
                emoji.style.transform = `translate(0, ${currentY - startY}px) rotate(${rotation}deg)`;
                emoji.style.left = currentX + 'px';
                emoji.style.opacity = Math.max(0, 1 - (currentY - startY) / 200);
                
                if (currentY - startY < 200 && emoji.parentNode) {
                    requestAnimationFrame(animateEmoji);
                } else if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            };
            
            requestAnimationFrame(animateEmoji);
        }
        
        const celebrationText = document.createElement('div');
        celebrationText.textContent = 'SBAN Never Be Late!';  
        celebrationText.className = 'flag-message';
        celebrationText.style.cssText = `
            position: fixed;
            font-size: 36px;
            font-weight: bold;
            color: rgb(255, 255, 255);
            text-shadow: 2px 2px 4px rgba(255, 141, 141, 0.3);
            user-select: none;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.3s ease-out;
        `;
        
        celebrationText.style.left = `${screenPosition.x}px`;
        celebrationText.style.top = `${screenPosition.y}px`;
        
        document.body.appendChild(celebrationText);
        
        setTimeout(() => {
            celebrationText.style.opacity = '1';
            celebrationText.style.transform = 'scale(1) translateY(-50px)';
        }, 100);
        
        setTimeout(() => {
            celebrationText.style.opacity = '0';
            celebrationText.style.transform = 'scale(1.2) translateY(-100px)';
            setTimeout(() => {
                if (celebrationText.parentNode) {
                    document.body.removeChild(celebrationText);
                }
            }, 300);
        }, 1500);

        this.sbanClickCount++;
        if (this.sbanClickCount === 5) {
            this.triggerTrainClockRain();
            this.sbanClickCount = 0;
        }
    }

    triggerTrainClockRain() {
        const emojiCount = 150; 
        const duration = 4000; 
        const emojis = ['🚂', '🚅', '⏰', '🕐', '⌚']; 
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'train-clock-rain';
            emoji.style.cssText = `
                position: fixed;
                font-size: 30px;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: trainClockFall ${1.5 + Math.random() * 0.5}s linear;
            `;
            
            document.body.appendChild(emoji);
            
            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes trainClockFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(105vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            }, duration);
        }
    }

    triggerHeartRain() {
        const emojiCount = 150; 
        const duration = 4000; 
        const emojis = ['❤️', '💖', '💗', '💓', '💕']; 
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'heart-rain';
            emoji.style.cssText = `
                position: fixed;
                font-size: 30px;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: heartFall ${2 + Math.random() * 2}s linear;
            `;
            
            document.body.appendChild(emoji);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes heartFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(105vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            }, duration);
        }
    }

    triggerTumEffect(object, clickPosition) {
        const screenPosition = clickPosition;
        
        const emojis = ['🎓', '📚', '🎯', '🏆', '✨'];
        const emojiCount = 10;
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'flag-message';
            emoji.style.cssText = `
                position: fixed;
                font-size: 24px;
                user-select: none;
                pointer-events: none;
                z-index: 1000;
            `;
            
            const startX = screenPosition.x + (Math.random() - 0.5) * 100;
            const startY = screenPosition.y;
            
            emoji.style.left = startX + 'px';
            emoji.style.top = startY + 'px';
            
            document.body.appendChild(emoji);
            
            const angle = (Math.random() - 0.5) * Math.PI / 2;
            const speed = 2 + Math.random() * 2;
            const rotationSpeed = (Math.random() - 0.5) * 8;
            let rotation = 0;
            let currentY = startY;
            let currentX = startX;
            
            const animateEmoji = () => {
                currentY += Math.cos(angle) * speed;
                currentX += Math.sin(angle) * speed;
                rotation += rotationSpeed;
                
                emoji.style.transform = `translate(0, ${currentY - startY}px) rotate(${rotation}deg)`;
                emoji.style.left = currentX + 'px';
                emoji.style.opacity = Math.max(0, 1 - (currentY - startY) / 200);
                
                if (currentY - startY < 200 && emoji.parentNode) {
                    requestAnimationFrame(animateEmoji);
                } else if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            };
            
            requestAnimationFrame(animateEmoji);
        }
        
        const celebrationText = document.createElement('div');
        celebrationText.textContent = 'ALL 1.0';
        celebrationText.className = 'flag-message';
        celebrationText.style.cssText = `
            position: fixed;
            font-size: 36px;
            font-weight: bold;
            color: rgb(255, 255, 255);
            text-shadow: 2px 2px 4px rgba(255, 141, 141, 0.3);
            user-select: none;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.3s ease-out;
        `;
        
        celebrationText.style.left = `${screenPosition.x}px`;
        celebrationText.style.top = `${screenPosition.y}px`;
        
        document.body.appendChild(celebrationText);
        
        setTimeout(() => {
            celebrationText.style.opacity = '1';
            celebrationText.style.transform = 'scale(1) translateY(-50px)';
        }, 100);
        
        setTimeout(() => {
            celebrationText.style.opacity = '0';
            celebrationText.style.transform = 'scale(1.2) translateY(-100px)';
            setTimeout(() => {
                if (celebrationText.parentNode) {
                    document.body.removeChild(celebrationText);
                }
            }, 300);
        }, 1500);

        this.tumClickCount++;
        if (this.tumClickCount === 10) {
            this.triggerGraduationRain();
            this.tumClickCount = 0;
        }
    }

    triggerGraduationRain() {
        const emojiCount = 150;
        const duration = 4000;
        const emojis = ['🎓', '📚', '🎯', '🏆', '✨'];
        
        for (let i = 0; i < emojiCount; i++) {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.className = 'graduation-rain';
            emoji.style.cssText = `
                position: fixed;
                font-size: 30px;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: -50px;
                animation: graduationFall ${2 + Math.random() * 2}s linear;
            `;
            
            document.body.appendChild(emoji);
            
            // 添加CSS动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes graduationFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(105vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                if (emoji.parentNode) {
                    document.body.removeChild(emoji);
                }
            }, duration);
        }
    }

    getScreenPosition(position) {
        const vector = new THREE.Vector3(position.x, position.y, position.z);
        vector.project(this.camera);
        
        return {
            x: (vector.x * 0.5 + 0.5) * window.innerWidth,
            y: (-vector.y * 0.5 + 0.5) * window.innerHeight
        };
    }
} 