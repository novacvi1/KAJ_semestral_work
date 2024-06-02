import MindMap from './mindmap.js';
import Storage from './data/storage.js';
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
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hide');
      }, 1000);
    });
  },

  initNetworkStatus() {
    const networkStatusPopup = document.getElementById('network-status-popup');

    function showNetworkStatusPopup(message) {
      networkStatusPopup.textContent = message;
      networkStatusPopup.style.display = 'block';
      setTimeout(() => {
        networkStatusPopup.style.display = 'none';
      }, 2000);
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
