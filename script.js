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
                <img src="${this.getAttribute("image")}" 
                     alt="${this.getAttribute("alt") || this.getAttribute("title")}">
            </picture>
            <small>Author: ${this.getAttribute("author")}</small>
            <p>${this.getAttribute("description")}</p>
            <a href="${this.getAttribute("link")}" target="_blank">More details...</a>
        `;
    }
}

customElements.define("project-card", CardComponent);
/*
//use to add projects to local storage
function addProject(newProject) {
    let localProjects = JSON.parse(localStorage.getItem("projects")) || [];
    localProjects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(localProjects));
    
}

const projectList = [
    {
        "title": "Plateful",
        "image": "../image/recipe_login.png",
        "alt": "log in image of the website",
        "author": "Hoang Le",
        "description": "A website for users to post and view recipes. Users can interact with the recipes by rating, like and favorite the recipes.",
        "link": "https://github.com/nguyenjh/CSE-110-Group-11"
    },
    {
        "title": "Car Accident Prediction",
        "image": "../image/ML.png",
        "alt": "an overview about the project",
        "author": "Hoang Le",
        "description": "Machine learning models that predicting car accidents in NYC.",
        "link": "https://github.com/devPach4545/CSE_151A"
    },
    {
        "title": "NFA to DFA Converter",
        "image": "../image/nfa.jpg",
        "alt": "a picture of how the converter works",
        "author": "Hoang Le",
        "description": "Build a converter that convert NFA to DFA using Python. Code samples available upon request.",
        "link": "https://github.com/hoangle2404/CSE100R/tree/main"
    },
    {
        "title": "Huffman Coding",
        "image": "../image/compress.png",
        "alt": "exmple of how huffman coding works",
        "author": "Hoang Le",
        "description": "Compress and uncompress a file using C++. Code samples available upon request.",
        "link": "https://github.com/hoangle2404/CSE100R/tree/main"
    },
    {
        "title": "Graph Algorithms",
        "image": "../image/graph.png",
        "alt": "exmple of how huffman coding works",
        "author": "Hoang Le",
        "description": "Implement different graphing algorithms like BFS, DFS,etc using C++. Code samples available upon request.",
        "link": "https://github.com/hoangle2404/CSE100R/tree/main"
    }
];
  
projectList.forEach(project => addProject(project));
*/

// Populate Projects
function loadProject(projects) {

    const container = document.getElementById("card-container");
    container.innerHTML = ""; 

    if (projects.length === 0) {
        container.innerHTML = "<p>There is no project currently.</p>";
        return;
    }

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
    const localData = localStorage.getItem("projects");
    if (localData) {
        const projects = JSON.parse(localData);
        loadProject(projects);
    } else {
        console.log("There is no local project currently.");
        loadProject([]);
    }
}

async function loadRemoteData() {
    const response = await fetch("https://api.jsonbin.io/v3/b/67d22be48a456b796674abae");
    if(!response.ok)
    {
        console.log('Fail to fetch data');
        return;
    }
    const data = await response.json();
    const projects = data.record;
    loadProject(projects);
}

document.getElementById("local").addEventListener("click", loadLocalData);
document.getElementById("remote").addEventListener("click", loadRemoteData);
//window.addEventListener("DOMContentLoaded", loadLocalData);