class CustomDialog extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    
    this.shadowRoot.innerHTML = `
      <style>
        /* Styles are encapsulated in the shadow DOM */
        dialog {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          background-color: lightgreen;
        }
        button {
          width:auto;
          height:40px;
        }
      </style>
      <dialog>
        <h2 id="dialogTitle"></h2>
        <p id="dialogContent"></p>
        <button id="closeButton">Close</button>
      </dialog>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#dialogTitle').textContent = this.getAttribute('title');
    this.shadowRoot.querySelector('#dialogContent').textContent = this.getAttribute('content');
    
    this.shadowRoot.querySelector('#closeButton').addEventListener('click', () => this.close());
  }
  
  open() {
    this.shadowRoot.querySelector('dialog').showModal();
  }
  
  close() {
    this.shadowRoot.querySelector('dialog').close();
  }
}

customElements.define('custom-dialog', CustomDialog);

document.getElementById('curiousTrigger')
  .addEventListener('click', () => {
    document.getElementById('curiousDialog').open();
  });

document.getElementById('ambitiousTrigger').addEventListener('click', () => {
    document.getElementById('ambitiousDialog').open();
  });