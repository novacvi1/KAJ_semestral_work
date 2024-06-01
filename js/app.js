import MindMap from './mindmap.js'
import Storage from './data/storage.js'
import Canvas from './components/Canvas.js'
import ToolBar from './components/ToolBar.js'

const mindmap = new MindMap()
const storage = new Storage()

// Localstorage
const savedData = storage.loadData()
if(savedData) {
  mindmap.loadDataFromLocalStorage(savedData)
}

const canvas = new Canvas('mindmap-canvas', mindmap)
const toolBar = new ToolBar(mindmap, canvas)

canvas.initEvents()
toolBar.initEvents()

// Pop-up info
const infoPopup = document.getElementById('info-popup');
document.addEventListener('DOMContentLoaded', () => {
  const showInfoButton = document.querySelectorAll('.info-button');

  showInfoButton.forEach((button) => {
    button.addEventListener('click', () => {
      infoPopup.classList.add('show');
    });
  });

  // Hide the pop-up
  const closeButton = document.getElementById('close-popup');

  closeButton.addEventListener('click', () => {
    infoPopup.classList.remove('show');
  });

  document.addEventListener('click', (event) => {
    // Check if the click was outside the pop-up
    if (!infoPopup.contains(event.target) && !Array.from(showInfoButton).some(button => button === event.target)) {
      infoPopup.classList.remove('show');
    }
  });
});

// Loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hide');
  }, 1000);
});

// Select the network status popup
const networkStatusPopup = document.getElementById('network-status-popup');

// Function to show the network status popup
function showNetworkStatusPopup(message) {
  networkStatusPopup.textContent = message;
  networkStatusPopup.style.display = 'block';
  setTimeout(() => {
    networkStatusPopup.style.display = 'none';
  }, 2000);
}

// Add online and offline event listeners
window.addEventListener('online', () => {
  showNetworkStatusPopup('You are online');
});

window.addEventListener('offline', () => {
  showNetworkStatusPopup('You are offline');
});

// Check the initial network status
if (navigator.onLine) {
  showNetworkStatusPopup('You are online');
} else {
  showNetworkStatusPopup('You are offline');
}

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-button');
  const drawer = document.getElementById('drawer');
  const backButton = document.getElementById('back-button');

  hamburger.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  backButton.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  document.getElementById('create-node-button').addEventListener('click', () => {
    console.log('Create node clicked');
    toolBar.onAddNodeClick();
  });

  document.addEventListener('click', (event) => {
    if (!drawer.contains(event.target) && event.target !== hamburger) {
      drawer.classList.remove('open');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const createNodeButton = document.getElementById('create-node-button');
  const deleteNodeButton = document.getElementById('delete-node-button');
  const editNodeButton = document.getElementById('edit-node-button');
  const connectNodesButton = document.getElementById('connect-nodes-button');

  createNodeButton.addEventListener('click', () => {
    toolBar.onAddNodeClick();
  });

  deleteNodeButton.addEventListener('click', () => {
    if (canvas.selectedNode) {
      mindmap.removeNode(canvas.selectedNode);
      canvas.selectedNode = null;
      canvas.render();
    }
  });

  editNodeButton.addEventListener('click', () => {
    if (canvas.selectedNode) {
      canvas.showInputField();
      canvas.inputField.setValue(canvas.selectedNode.text);
      canvas.inputField.focus();
      canvas.render();
    }
  });

  connectNodesButton.addEventListener('click', () => {
    if (canvas.selectedNode) {
      canvas.connectingNodes = canvas.selectedNode;
    }
  });
});
