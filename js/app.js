import MindMap from './mindmap.js'
import Storage from './data/storage.js'
import Canvas from './components/Canvas.js'
import ToolBar from './components/ToolBar.js'

const mindmap = new MindMap()
const storage = new Storage()

// Localstorage
const savedData = storage.loadData()
if(savedData) {
  mindmap.loadData(savedData)
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
