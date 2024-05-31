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
const showInfoButton = document.getElementById('info-button');

showInfoButton.addEventListener('click', () => {
  infoPopup.classList.add('show');
});

// Hide the pop-up
const closeButton = document.getElementById('close-popup');

closeButton.addEventListener('click', () => {
  infoPopup.classList.remove('show');
});

document.addEventListener('click', (event) => {
  // Check if the click was outside the pop-up
  if (!infoPopup.contains(event.target) && event.target !== showInfoButton) {
    infoPopup.classList.remove('show');
  }
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

