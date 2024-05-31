import Node from './components/node.js';
import Connector from './components/connector.js';
import storage from "./data/storage.js";

const destroySound = new Audio('./node_destruction_sound.mp3');


class MindMap {
  constructor() {
    this.nodes = [];
    this.connectors = [];
  }

  addNode(text, x, y) {
    const node = new Node(text, x, y);
    this.nodes.push(node);
    this.saveCanvasState();
    return node;
  }

  removeNode(node) {
    const index = this.nodes.indexOf(node);
    if (index !== -1) {
      this.nodes.splice(index, 1);
      this.removeConnectors(node);
    }
    this.saveCanvasState();

    // Play the sound
    destroySound.play().catch(error => {});

    // Stop the sound after 1 second
    setTimeout(() => {
      destroySound.pause();
      destroySound.currentTime = 0; // Reset the audio to the start
    }, 1000);
  }

  removeConnectors(node) {
    this.connectors = this.connectors.filter(
      (connector) => connector.node1 !== node && connector.node2 !== node
    );
  }

  connectNodes(node1, node2) {
    const connector = new Connector(node1, node2);
    this.connectors.push(connector);
    this.saveCanvasState();
  }

  getData() {
    return {
      nodes: this.nodes.map((node) => node.getData()),
      connectors: this.connectors.map((connector) => connector.getData()),
    };
  }

  loadDataFromLocalStorage(data) {
    // Load nodes
    this.nodes = data.nodes.map((nodeData) => new Node().loadData(nodeData));

    // Create a map of node ids to node instances
    const nodeMap = this.nodes.reduce((map, node) => {
      map[node.id] = node;
      return map;
    }, {});
    console.log(this.nodes)

    // Load connectors
    this.connectors = data.connectors.map(
      (connectorData) => new Connector().loadData(connectorData, nodeMap)
    );
  }

  saveCanvasStateToFile() {
    const mindmapData = this.getData();
    const stateJson = JSON.stringify(mindmapData);
    const blob = new Blob([stateJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "canvas_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  loadData(state) {
    // Clear the current state
    this.nodes = [];
    this.connectors = [];

    // Load nodes
    this.nodes = state.nodes.map((nodeData) => new Node().loadData(nodeData));

    // Create a map of node ids to node instances
    const nodeMap = this.nodes.reduce((map, node) => {
      map[node.id] = node;
      return map;
    }, {});

    // Load connectors
    this.connectors = state.connectors.map(
      (connectorData) => new Connector().loadData(connectorData, nodeMap)
    );
  }

  saveCanvasState(){
    const mindMapData = this.getData();
    storage.saveData(mindMapData)
    history.pushState(mindMapData, '', '#'+Date.now());
  }
}

export default MindMap;
