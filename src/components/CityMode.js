export class CityMode {
    constructor() {
        this.container = null;
        this.iframe = null;
    }

    initialize(container) {
        this.container = container;
        
         
        this.iframe = document.createElement('iframe');
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.border = 'none';
       
        this.iframe.src = 'https://ion.cesium.com/stories/viewer/?id=8065271b-29f0-4bd1-86db-c8f88820fbcb';
        
        container.appendChild(this.iframe);
    }



    dispose() {
        if (this.iframe && this.container) {
            this.container.removeChild(this.iframe);
            this.iframe = null;
        }
    }


} 