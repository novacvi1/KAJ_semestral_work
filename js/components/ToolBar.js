class Toolbar {
  constructor(mindmap, canvas) {
    this.mindmap = mindmap;
    this.canvas = canvas;

    //this.addNodeButton = document.getElementById('add-node');
    //this.removeNodeButton = document.getElementById('remove-node');
    //this.saveButton = document.getElementById('save-map');
    //this.loadButton = document.getElementById('load-map');
    //this.connectNodesButton = document.getElementById('connect-nodes');
    //this.deleteNodeButton = document.getElementById('delete-node');
    //this.autoLayerButton = document.getElementById('auto-layer');
  }

  initEvents() {
    //this.addNodeButton.addEventListener('click', this.onAddNodeClick.bind(this));
    //this.removeNodeButton.addEventListener('click', this.onRemoveNodeClick.bind(this));
    //this.saveButton.addEventListener('click', this.onSaveClick.bind(this));
    //this.loadButton.addEventListener('click', this.onLoadClick.bind(this));
    //this.connectNodesButton.addEventListener('click', this.onConnectNodesClick.bind(this));
    //this.deleteNodeButton.addEventListener('click', this.onDeleteNodeClick.bind(this));
    //this.autoLayerButton.addEventListener('click', this.onAutoLayerClick.bind(this));
  }

  onAddNodeClick() {
    this.mindmap.addNode('New Node', 100, 100);
    this.canvas.render();
  }

  onRemoveNodeClick() {
    if (this.canvas.selectedNode) {
      this.mindmap.removeNode(this.canvas.selectedNode);
      this.canvas.selectedNode = null;
      this.canvas.render();
    }
  }

  onSaveClick() {
    const data = this.mindmap.getData();
    const storage = new Storage();
    storage.saveData(data);
  }

  onLoadClick() {
    const storage = new Storage();
    const data = storage.loadData();
    if (data) {
      this.mindmap.loadData(data);
      this.canvas.render();
    }
  }

  onConnectNodesClick() {
    this.canvas.isConnectingNodes = true;
  }

  onDeleteNodeClick() {
    if (this.canvas.selectedNode) {
      this.mindmap.removeNode(this.canvas.selectedNode);
      this.canvas.selectedNode = null;
      this.canvas.render();
    }
  }

  /**
  onAutoLayerClick() {
    const nodes = this.mindmap.nodes;
    nodes.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    nodes.forEach((node, index) => {
      node.zIndex = index;
    });

    this.canvas.render();
  }
  **/

}

export default Toolbar;
