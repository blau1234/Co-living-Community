import * as OBCF from "@thatopen/components-front";

export class HighlightManager {
    constructor(components) {
        this.components = components;
        this.highlighter = null;
        this.idDisplay = null;
        this.dimensions = null;
    }

    initialize(world) {
        this.highlighter = this.components.get(OBCF.Highlighter);
        this.highlighter.setup({ world: world });
        this.highlighter.zoomToSelection = true;
        

        this.idDisplay = document.createElement('div');
        this.idDisplay.style.position = 'fixed';
        this.idDisplay.style.padding = '10px';
        this.idDisplay.style.backgroundColor = 'white';
        this.idDisplay.style.color = 'black';
        this.idDisplay.style.borderRadius = '5px';
        this.idDisplay.style.display = 'none';
        document.body.appendChild(this.idDisplay);

        this.setupEvents();
    }

    setupEvents() {
        this.highlighter.events.select.onHighlight.add((selection) => {
            console.log('selected object:', selection);
            const selectionID = Object.keys(selection);
            
            if (selectionID.length > 0) {
                this.idDisplay.textContent = `FragmentIdMap: ${selectionID.join(', ')}`;
                this.idDisplay.style.display = 'block';
                this.idDisplay.style.right = '20px';
                this.idDisplay.style.top = '20px';
                this.idDisplay.style.left = 'auto';
            }
        });

        this.highlighter.events.select.onClear.add(() => {
            this.idDisplay.style.display = 'none';
        });
    }

    dispose() {
        try {
            if (this.highlighter) {
                this.highlighter.dispose();
                this.highlighter = null;
            }
            
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            
            this.container = null;
            this.world = null;
        } catch (error) {
            console.warn('HighlightManager dispose error:', error);
        }
    }
} 