const currentScript = document._currentScript || document.currentScript,
      template = currentScript.ownerDocument.querySelector('#template');

class ImgFallback extends HTMLElement {

    constructor() {
        super();
        const clone = document.importNode(template.content, true);
        this.appendChild(clone);
        this.img = this.querySelector('#img');
        this.img.onerror = this.onError.bind(this);
        this.isFallback = false;
    }

    // observing attributes
    
    static get observedAttributes() {
        return ['src', 'fallback'];
    }    
    
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal === newVal) {
            return;
        }
        this[attrName] = newVal;
    }
    
    // properties
    
    get src() {
        return this.getAttribute('src');
    }
    
    set src(val) {
        this.isFallback = false;
        this.setAttribute('src', val);
        this.img.setAttribute('src', val);
    }
    
    get fallback() {
        return this.getAttribute('fallback');
    }
    
    set fallback(val) {
        this.setAttribute('fallback', val);
    }
    
    // fallback logic
    
    warn(...params) {
        console.warn(...params, '\n', this);
    }
    
    onError() {
        if (this.isFallback) {
            this.warn('Fallback failed:', this.fallback);
            return;
        }
        if (this.fallback) {
            this.warn('Missing image:', this.src, 'Falling back to:', this.fallback);
            this.isFallback = true;
            this.img.setAttribute('src', this.fallback);            
        } else {
            this.warn('Missing image:', this.src, 'No fallback.')
        }
    }    
        
}

customElements.define('img-fallback', ImgFallback);
