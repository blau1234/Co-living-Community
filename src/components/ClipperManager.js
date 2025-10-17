import * as THREE from 'three';
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";


export class ClipperManager {
    constructor(components,fragments) {
        this.components = components;
        this.clipper = null;
        this.world = null;
        this.animationStartTime = null;
        this.fragments=fragments;
        this.modelItems1 = null;
        this.modelItems2 = null;
    }

    initialize(world) {
        this.world = world;
        this.clipper = this.components.get(OBC.Clipper);
        this.clipper.enabled = true;     

        // 初始化edges
        this.edges = this.components.get(OBCF.ClipEdges);
        this.setupEdges();
        
        this.createTimerElement();
    }

    setupEdges() {
        this.clipper.Type = OBCF.EdgesPlane;
        
        // 修改材质颜色
        const grayFill = new THREE.MeshBasicMaterial({ color: "white", side: 2 });
        const blackLine = new THREE.LineBasicMaterial({ color: "red" });
        const blackOutline = new THREE.MeshBasicMaterial({
            color: "red",
            opacity: 0.5,
            side: 5,
            transparent: true,
        });
       
        this.edges.styles.create(
            "thick",
            new Set(),
            this.world,
            blackLine,
            grayFill,
            blackOutline,
        );
    }

    createTimerElement() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "50");
        svg.setAttribute("height", "50");
        svg.style.position = "fixed";
        svg.style.pointerEvents = "none";
        svg.style.display = "none";
        svg.style.zIndex = "1000";

        const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bgCircle.setAttribute("cx", "25");
        bgCircle.setAttribute("cy", "25");
        bgCircle.setAttribute("r", "20");
        bgCircle.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
        bgCircle.setAttribute("stroke", "#666");
        bgCircle.setAttribute("stroke-width", "2");

        const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        progressCircle.setAttribute("cx", "25");
        progressCircle.setAttribute("cy", "25");
        progressCircle.setAttribute("r", "20");
        progressCircle.setAttribute("fill", "none");
        progressCircle.setAttribute("stroke", "#1890ff");
        progressCircle.setAttribute("stroke-width", "2.5");
        const circumference = 2 * Math.PI * 20;
        progressCircle.setAttribute("stroke-dasharray", circumference);
        progressCircle.setAttribute("stroke-dashoffset", circumference);
        progressCircle.setAttribute("transform", "rotate(-90 25 25)");

        const trashIcon = document.createElementNS("http://www.w3.org/2000/svg", "path");
        trashIcon.setAttribute("d", `
            M 19 15
            L 31 15
            L 30.5 35
            C 30.5 36 29.8 36.5 29 36.5
            L 21 36.5
            C 20.2 36.5 19.5 36 19.5 35
            L 19 15
            M 17 15
            L 33 15
            M 21 13.5
            L 21 12
            L 29 12
            L 29 13.5
        `);
        trashIcon.setAttribute("fill", "none");
        trashIcon.setAttribute("stroke", "#666");
        trashIcon.setAttribute("stroke-width", "1.5");
        trashIcon.setAttribute("stroke-linecap", "round");
        trashIcon.setAttribute("stroke-linejoin", "round");

        svg.appendChild(bgCircle);
        svg.appendChild(progressCircle);
        svg.appendChild(trashIcon);
        document.body.appendChild(svg);
        this.timerElement = svg;
        this.progressCircle = progressCircle;
    }

    setupEvents(container) {
        container.ondblclick = () => {
            if (this.clipper.enabled) {
                this.clipper.create(this.world);
                this.clipper.size = 40;
                this.clipper.config.color = new THREE.Color(0x000000);
                this.clipper.config.opacity = 0.3;
            }
        };

        let pressTimer;
        let startX, startY;
        let isLongPressStarted = false;
        
        container.onmousedown = (event) => {
            startX = event.clientX;
            startY = event.clientY;
            
            pressTimer = setTimeout(() => {
                if (this.clipper.enabled) {
                    isLongPressStarted = true;
                    this.timerElement.style.display = "block";
                    this.timerElement.style.left = `${event.clientX - 25}px`;
                    this.timerElement.style.top = `${event.clientY - 25}px`;
                    
                    this.animationStartTime = Date.now();
                    this.animateProgress();
                    
                    setTimeout(() => {
                        if (isLongPressStarted) {
                            this.clipper.delete(this.world);
                            this.timerElement.style.display = "none";
                        }
                    }, 1000);
                }
            }, 500);
        };

        container.onmousemove = (event) => {
            if (pressTimer || isLongPressStarted) {
                const moveX = Math.abs(event.clientX - startX);
                const moveY = Math.abs(event.clientY - startY);
                if (moveX > 5 || moveY > 5) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                    isLongPressStarted = false;
                    this.timerElement.style.display = "none";
                    this.progressCircle.setAttribute("stroke-dashoffset", "157");
                }
            }
        };

        container.onmouseup = container.onmouseleave = () => {
            clearTimeout(pressTimer);
            isLongPressStarted = false;
            this.timerElement.style.display = "none";
            this.progressCircle.setAttribute("stroke-dashoffset", "157");
        };

        window.onkeydown = (event) => {
            if (event.code === "Delete" || event.code === "Backspace") {
                if (this.clipper.enabled) {
                    this.clipper.delete(this.world);
                }
            }
        };
    }

    animateProgress() {
        const animate = () => {
            if (!this.timerElement || this.timerElement.style.display === "none") return;
            
            const progress = (Date.now() - this.animationStartTime) / 1000;
            if (progress <= 1) {
                const circumference = 2 * Math.PI * 20;
                const dashOffset = circumference * (1 - progress);
                this.progressCircle.setAttribute("stroke-dashoffset", dashOffset.toString());
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    clearAll() {
        this.clipper.deleteAll();
    }

    dispose() {
        if (this.clipper) {
            this.clipper.dispose();
            this.clipper = null;
        }
        this.world = null;
        this.modelItems1 = null;
        this.modelItems2 = null;
    }

    setModelItems(items1, items2) {
        if (!items1 || !items2) {
            console.warn('模型项为空');
            return;
        }
        this.modelItems1 = items1;
        this.modelItems2 = items2;
        this.applyEdgesStyles();
    }

    applyEdgesStyles() {
        if (!this.modelItems1 || !this.modelItems2) return;
        if (!this.edges || !this.edges.styles.list.thick) {
            console.warn('Edges styles not properly initialized');
            return;
        }

        try {
            for (const fragID in this.modelItems1) {
                const foundFrag = this.fragments.list.get(fragID);
                if (!foundFrag) continue;
                const { mesh } = foundFrag;
                this.edges.styles.list.thick.fragments[fragID] = new Set(this.modelItems1[fragID]);
                this.edges.styles.list.thick.meshes.add(mesh);
            }

            for (const fragID in this.modelItems2) {
                const foundFrag = this.fragments.list.get(fragID);
                if (!foundFrag) continue;
                const { mesh } = foundFrag;
                this.edges.styles.list.thick.fragments[fragID] = new Set(this.modelItems2[fragID]);
                this.edges.styles.list.thick.meshes.add(mesh);
            }
            
            // 强制更新edges
            this.edges.update();
        } catch (error) {
            console.error('Error applying edges styles:', error);
        }
    }
} 