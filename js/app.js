import MindMap from './mindmap.js';
import Storage from './data/Storage.js';
import Canvas from './components/Canvas.js';

const createNodeButton = document.getElementById('create-node-button');

const App = {
  init() {
    this.storage = new Storage();
    this.mindmap = new MindMap();
    this.initLocalStorage();
    this.initPopups();
    this.initLoadingScreen();
    this.initNetworkStatus();
    this.initHamburgerMenu();
    this.initNodeActions();
    this.canvas = new Canvas('mindmap-canvas', this.mindmap);
    this.initCanvasEvents();
  },

  initLocalStorage() {
    const savedData = this.storage.loadData();
    if (savedData) {
      this.mindmap.loadDataFromLocalStorage(savedData);
    }
  },

  initCanvasEvents() {
    this.canvas.initEvents();
  },

  initPopups() {
    const infoPopup = document.getElementById('info-popup');
    const showInfoButton = document.querySelectorAll('.info-button');
    showInfoButton.forEach((button) => {
      button.addEventListener('click', () => {
        infoPopup.classList.add('show');
      });
    });

    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', () => {
      infoPopup.classList.remove('show');
    });

    document.addEventListener('click', (event) => {
      if (!infoPopup.contains(event.target) && !Array.from(showInfoButton).some(button => button === event.target)) {
        infoPopup.classList.remove('show');
      }
    });
  },

  initLoadingScreen() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.right = '0';
    loadingScreen.style.bottom = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.zIndex = '9999'; // Ensure the loading screen is above all other elements
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.backgroundColor = 'white';

    // Create logo div
    const logo = document.createElement('div');
    logo.id = 'logo';

    // Create SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '230');
    svg.setAttribute('viewBox', '0 0 200 200');

    // Create circle and line elements and append to SVG
    const elements = [
      {type: 'circle', attributes: {cx: '100', cy: '100', r: '10', fill: '#4CAF50', class: 'pulse'}},
      {type: 'line', attributes: {x1: '100', y1: '100', x2: '140', y2: '60', stroke: '#4CAF50', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '140', cy: '60', r: '7', fill: '#FFC107'}},
      {type: 'line', attributes: {x1: '140', y1: '60', x2: '160', y2: '30', stroke: '#FFC107', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '160', cy: '30', r: '5', fill: '#FF5722'}},

      {type: 'line', attributes: {x1: '100', y1: '100', x2: '60', y2: '60', stroke: '#4CAF50', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '60', cy: '60', r: '7', fill: '#FFC107'}},
      {type: 'line', attributes: {x1: '60', y1: '60', x2: '40', y2: '30', stroke: '#FFC107', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '40', cy: '30', r: '5', fill: '#FF5722'}},

      {type: 'line', attributes: {x1: '100', y1: '100', x2: '140', y2: '140', stroke: '#4CAF50', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '140', cy: '140', r: '7', fill: '#FFC107'}},
      {type: 'line', attributes: {x1: '140', y1: '140', x2: '160', y2: '170', stroke: '#FFC107', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '160', cy: '170', r: '5', fill: '#FF5722'}},

      {type: 'line', attributes: {x1: '100', y1: '100', x2: '60', y2: '140', stroke: '#4CAF50', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '60', cy: '140', r: '7', fill: '#FFC107'}},
      {type: 'line', attributes: {x1: '60', y1: '140', x2: '40', y2: '170', stroke: '#FFC107', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '40', cy: '170', r: '5', fill: '#FF5722'}},

      {type: 'line', attributes: {x1: '100', y1: '100', x2: '100', y2: '50', stroke: '#4CAF50', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '100', cy: '50', r: '7', fill: '#FFC107'}},
      {type: 'line', attributes: {x1: '100', y1: '50', x2: '100', y2: '20', stroke: '#FFC107', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '100', cy: '20', r: '5', fill: '#FF5722'}},

      {type: 'line', attributes: {x1: '100', y1: '100', x2: '100', y2: '150', stroke: '#4CAF50', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '100', cy: '150', r: '7', fill: '#FFC107'}},
      {type: 'line', attributes: {x1: '100', y1: '150', x2: '100', y2: '180', stroke: '#FFC107', 'stroke-width': '2'}},
      {type: 'circle', attributes: {cx: '100', cy: '180', r: '5', fill: '#FF5722'}}
    ];
    elements.forEach(elementData => {
      const element = document.createElementNS(svgNS, elementData.type);
      Object.keys(elementData.attributes).forEach(key => {
        element.setAttribute(key, elementData.attributes[key]);
      });
      svg.appendChild(element);
    });

    // Create text element and append to SVG
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '100%');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('stroke', 'black');
    text.setAttribute('stroke-width', '1px');
    text.setAttribute('dy', '.3em');
    text.textContent = 'Mindmap App';
    svg.appendChild(text);

    // Append SVG to logo
    logo.appendChild(svg);

    // Append logo to loading screen
    loadingScreen.appendChild(logo);

    // Append loading screen to body
    document.body.prepend(loadingScreen);

    // Change colors after one second
    setTimeout(() => {
      // Select all circles and lines
      const circles = document.querySelectorAll('#loading-screen circle');
      const lines = document.querySelectorAll('#loading-screen line');

      // Change the stroke color of the lines
      lines.forEach(line => {
        line.setAttribute('stroke', '#333'); // Change to the color you want
      });


      // Change the fill color of the circles
      circles.forEach(circle => {
        circle.setAttribute('fill', '#000000'); // Change to the color you want
      });
    }, 1500);

    // Hide loading screen when the page finishes loading
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.style.display = 'none'; // Hide the loading screen after a delay
      }, 2500);
    });
  },

  initNetworkStatus() {
    const networkStatusPopup = document.getElementById('network-status-popup');

    function showNetworkStatusPopup(message) {
      setTimeout(() => {
        networkStatusPopup.textContent = message;
        networkStatusPopup.style.display = 'block';
        setTimeout(() => {
          networkStatusPopup.style.display = 'none';
        }, 2000);
      }, 3000);
    }

    window.addEventListener('online', () => {
      showNetworkStatusPopup('You are online');
    });

    window.addEventListener('offline', () => {
      showNetworkStatusPopup('You are offline');
    });

    if (navigator.onLine) {
      showNetworkStatusPopup('You are online');
    } else {
      showNetworkStatusPopup('You are offline');
    }
  },

  initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-button');
    const drawer = document.getElementById('drawer');
    const backButton = document.getElementById('back-button');

    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    backButton.addEventListener('click', () => {
      drawer.classList.remove('open');
    });

    document.addEventListener('click', (event) => {
      if (!drawer.contains(event.target) && event.target !== hamburger) {
        drawer.classList.remove('open');
      }
    });
  },

  initNodeActions() {
    const deleteNodeButton = document.getElementById('delete-node-button');
    const editNodeButton = document.getElementById('edit-node-button');
    const connectNodesButton = document.getElementById('connect-nodes-button');

    createNodeButton.addEventListener('click', () => {
      const rect = createNodeButton.getBoundingClientRect();
      this.canvas.contextMenu.showNodeTypeContextMenu(rect.left, rect.bottom);
    });

    deleteNodeButton.addEventListener('click', () => {
      if (this.canvas.selectedNode) {
        this.mindmap.removeNode(this.canvas.selectedNode);
        this.canvas.selectedNode = null;
        this.canvas.render();
      }
    });

    editNodeButton.addEventListener('click', () => {
      if (this.canvas.selectedNode) {
        this.canvas.showInputField();
      }
    });

    connectNodesButton.addEventListener('click', () => {
      if (this.canvas.selectedNode) {
        this.canvas.connectingNodes = this.canvas.selectedNode;
      }
    });
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

export default App;
