import OvalNode from './components/OvalNode.js';
import RectangleNode from './components/RectangleNode.js';
import BaseNode from './components/BaseNode.js';
import Connector from './components/connector.js';
import Storage from './data/Storage.js';

const storage = new Storage();
const destroySound = new Audio('./node_destruction_sound.mp3');


class MindMap {
  constructor() {
    this.rectangleNodes = [];
    this.ovalNodes = [];
    this.connectors = [];
  }

  addNodeRectangle(text, x, y) {
    const node = new RectangleNode(text, x, y);
    this.rectangleNodes.push(node);
    this.saveCanvasStateToHistory();
    return node;
  }

  addNodeOval(text, x, y) {
    const node = new OvalNode(text, x, y);
    this.ovalNodes.push(node);
    this.saveCanvasStateToHistory();
    return node;
  }

  removeNode(node) {
    if (node.type === 'rectangle') {
      const index = this.rectangleNodes.indexOf(node);
      if (index !== -1) {
        this.rectangleNodes.splice(index, 1);
        this.removeConnectors(node);
      }
    } else if (node.type === 'oval') {
      const index = this.ovalNodes.indexOf(node);
      if (index !== -1) {
        this.ovalNodes.splice(index, 1);
        this.removeConnectors(node);
      }
    }
    this.saveCanvasStateToHistory();
    this.playDestroySound();
  }

  removeConnectors(node) {
    this.connectors = this.connectors.filter(
      (connector) => connector.node1 !== node && connector.node2 !== node
    );
  }

  connectNodes(node1, node2) {
    const connector = new Connector(node1, node2);
    this.connectors.push(connector);
    this.saveCanvasStateToHistory();
  }

  getData() {
    return {
      rectangleNodes: this.rectangleNodes.map((node) => node.getData()),
      ovalNodes: this.ovalNodes.map((node) => node.getData()),
      connectors: this.connectors.map((connector) => connector.getData()),
    };
  }

  loadDataFromLocalStorage(data) {
    if (data) {
      if (data.rectangleNodes) {
        this.rectangleNodes = data.rectangleNodes.map((nodeData) => new RectangleNode().loadData(nodeData));
      }
      if (data.ovalNodes) {
        this.ovalNodes = data.ovalNodes.map((nodeData) => new OvalNode().loadData(nodeData));
      }
      if (data.rectangleNodes && data.ovalNodes) {
        const nodeMap = [...this.rectangleNodes, ...this.ovalNodes].reduce((map, node) => {
          map[node.id] = node;
          return map;
        }, {});
        if (data.connectors) {
          this.connectors = data.connectors.map(
            (connectorData) => new Connector().loadData(connectorData, nodeMap)
          );
        }
      }
    }
  }

  saveCanvasStateToFile() {
    const mindmapData = this.getData();
    const stateJson = JSON.stringify(mindmapData);
    const blob = new Blob([stateJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  loadData(state) {
    this.rectangleNodes = state.rectangleNodes.map((nodeData) => new RectangleNode().loadData(nodeData));
    this.ovalNodes = state.ovalNodes.map((nodeData) => new OvalNode().loadData(nodeData));
    const nodeMap = [...this.rectangleNodes, ...this.ovalNodes].reduce((map, node) => {
      map[node.id] = node;
      return map;
    }, {});
    this.connectors = state.connectors.map(
      (connectorData) => new Connector().loadData(connectorData, nodeMap)
    );
  }

  saveCanvasStateToHistory() {
    const mindMapData = this.getData();
    history.pushState(mindMapData, '', '#' + Date.now());
  }

  saveCanvasStateToLocalStorage() {
    storage.saveData(this.getData()); // Save the current state of the mind map to local storage
  }

  playDestroySound() {
    destroySound.play().catch(() => {});
    setTimeout(() => {
      destroySound.pause();
      destroySound.currentTime = 0;
    }, 1000);
  }
}

export default MindMap;
