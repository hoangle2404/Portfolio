// Theme Toggle
const theme_button = document.getElementById('toggle_theme');
const currTheme = localStorage.getItem('theme') || 'light_mode';
document.documentElement.setAttribute('theme', currTheme);
theme_button.textContent = currTheme === 'light_mode' ? 'Toggle Theme ☀' : 'Toggle Theme 🌙';

theme_button.addEventListener('click', () => {
    const theme_info = document.documentElement.getAttribute('theme');
    const newTheme = theme_info === 'light_mode' ? 'dark_mode' : 'light_mode';
    document.documentElement.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    theme_button.textContent = newTheme === 'light_mode' ? 'Toggle Theme ☀' : 'Toggle Theme 🌙';
});

// Custom Element
class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ["title", "image", "alt", "author", "description", "link"];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid;
                    border-radius: 8px;
                    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
                    padding: 16px;
                    background: lightgreen;
                    color: var(--card-text);
                    max-width: 500px;
                    margin: auto;
                    margin-top: 10px;
                    
                }
                h2 {
                    margin: 0 0 8px;
                }
                picture img {
                    width: 100%;
                    border-radius: 8px;
                    max-width: 100%;
                    height: auto;
                }
                p {
                    font-size: 25px;
                    line-height: 1.4;
                }
                a {
                    display: inline-block;
                    margin-top: 10px;
                    color: blue;
                    text-decoration: underline;
                }
            </style>

            <h2>${this.getAttribute("title")}</h2>
            <picture>
                <source media="(orientation: landscape)" srcset="${this.getAttribute("image")}"/>
                <img src="../image/project.png" 
                     alt="${this.getAttribute("alt") || this.getAttribute("title")}">
            </picture>
            <small>Author: ${this.getAttribute("author")}</small>
            <p>${this.getAttribute("description")}</p>
            <a href="${this.getAttribute("link")}" target="_blank">More details...</a>
        `;
    }
}

customElements.define("project-card", CardComponent);

// Load Projects
function loadProject(projects) { 
    const container = document.getElementById("card-container");
    container.innerHTML = "";

    projects.forEach(project => {
        let card = document.createElement("project-card");
        card.setAttribute("title", project.title);
        card.setAttribute("image", project.image);
        card.setAttribute("description", project.description);
        card.setAttribute("link", project.link);
        card.setAttribute("author", project.author);
        container.appendChild(card);
    });
}

function loadLocalData() {
    const container = document.getElementById("card-container");
    const localData = localStorage.getItem("local-projects");
    if (localData) {
        const project = JSON.parse(localData);
        loadProject(project);
    } else {
        container.innerHTML = "<p class='empty-output'>The local storage is empty for now</p>";
    }
}

async function fetchLocal() {
    const container = document.getElementById("card-container");
      const response = await fetch("local.json");
    if (!response.ok) 
    {
        throw new Error("Error fetching local data.");
    }
    const data = await response.json();
    localStorage.setItem("local-projects", JSON.stringify(data));
    loadLocalData();  
  }
 
async function loadRemoteData() { 
    const container = document.getElementById("card-container");
    const response = await fetch("https://api.jsonbin.io/v3/b/67d65da08a456b796676b350");
    if(!response.ok)
    {
        container.innerHTML = "<p class='empty-output'>No remote project found.</p>";
    }
    const data = await response.json();
    const project = data.record;
    loadProject(project);
}

document.getElementById("local").addEventListener("click", () => {
    const localData = localStorage.getItem("local-projects");
    if (localData) {
      loadLocalData();
    } else {
        fetchLocal();
    }
  });
document.getElementById("remote").addEventListener("click", loadRemoteData);
document.addEventListener("DOMContentLoaded", loadLocalData);