import Node from './components/node.js';
import Connector from './components/connector.js';

class MindMap {
  constructor() {
    this.nodes = [];
    this.connectors = [];
  }

  addNode(text, x, y) {
    const node = new Node(text, x, y);
    this.nodes.push(node);
    console.log(node)
    return node;
  }

  removeNode(node) {
    const index = this.nodes.indexOf(node);
    if (index !== -1) {
      this.nodes.splice(index, 1);
      this.removeConnectors(node);
    }
  }

  removeConnectors(node) {
    this.connectors = this.connectors.filter(
      (connector) => connector.node1 !== node && connector.node2 !== node
    );
  }

  connectNodes(node1, node2) {
    const connector = new Connector(node1, node2);
    this.connectors.push(connector);
  }

  getData() {
    return {
      nodes: this.nodes.map((node) => node.getData()),
      connectors: this.connectors.map((connector) => connector.getData()),
    };
  }

  loadData(data) {
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
}

export default MindMap;
