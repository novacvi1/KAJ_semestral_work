import MindMap from './mindmap.js'
import Storage from './data/storage.js'
import Canvas from './components/Canvas.js'
import ToolBar from './components/ToolBar.js'

const mindmap = new MindMap()
const storage = new Storage()

// Načtení dat z localStorage
const savedData = storage.loadData()
if(savedData) {
  mindmap.loadData(savedData)
}

// Inicializace komponent
const canvas = new Canvas('mindmap-canvas', mindmap)
const toolBar = new ToolBar(mindmap, canvas)

// Nastavení událostí
canvas.initEvents()
toolBar.initEvents()
