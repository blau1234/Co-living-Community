import * as OBC from "@thatopen/components";

export class HideManager {
    constructor(components) {
        this.components = components;
        this.hider = this.components.get(OBC.Hider);
        this.hiddenCategories = new Set(); 
    }

    initialize(classifier) {
        this.classifier = classifier;
    }

    toggleCategory(category) {
        const categoryMapping = {
            'IfcWall': 'IFCWALLSTANDARDCASE',
            'IfcWindow': 'IFCWINDOW',
            'IfcSlab': 'IFCSLAB',
            'IfcColumn': 'IFCCOLUMN',
            'IfcBeam': 'IFCBEAM'
        };

        const ifcCategory = categoryMapping[category];
        if (!ifcCategory) return;

        const elements = this.classifier.find({ entities: [ifcCategory] });
        if (!elements || elements.length === 0) {
            console.log(`No elements found for ${ifcCategory} type`);
            return;
        }

        const isHidden = this.hiddenCategories.has(ifcCategory);
        if (isHidden) {
            this.hiddenCategories.delete(ifcCategory);
            this.hider.set(true, elements); //show
        } else {
            this.hiddenCategories.add(ifcCategory);
            this.hider.set(false, elements); // hide
        }
    }

    dispose() {
        this.hider = null;
        this.classifier = null;
        this.hiddenCategories.clear();
    }
} 