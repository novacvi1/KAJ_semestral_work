class Canvas {
  constructor(canvasId, mindmap) {
    this.mindmap = mindmap;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.selectedNode = null;
    this.startX = 0;
    this.startY = 0;
    this.isConnectingNodes = false;
    this.nodeToConnect = null;
    this.editingNode = null;
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('keydown', this.onKeyDown.bind(this));
    this.canvas.addEventListener('dblclick', this.onDoubleClick.bind(this));
  }

  onKeyDown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedNode) {
        this.mindmap.removeNode(this.selectedNode);
        this.selectedNode = null;
        this.render();
      }
    }
  }

  onMouseMove(e) {
    if (this.isDrawing && this.selectedNode) {
      const x = e.offsetX - this.startX;
      const y = e.offsetY - this.startY;
      this.selectedNode.move(x, y);
      this.render();
    }
  }

  onMouseDown(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    const clickedNode = this.mindmap.nodes.find(node => this.isPointInNode(x, y, node));
    if (clickedNode) {
      this.selectedNode = clickedNode;
      this.isDrawing = true;
      this.startX = x - clickedNode.x;
      this.startY = y - clickedNode.y;

      if (this.isConnectingNodes) {
        if (this.nodeToConnect) {
          this.mindmap.connectNodes(this.nodeToConnect, clickedNode);
          this.isConnectingNodes = false;
          this.nodeToConnect = null;
          this.render();
        } else {
          this.nodeToConnect = clickedNode;
        }
      }
    } else if (this.isConnectingNodes) {
      this.isConnectingNodes = false;
      this.nodeToConnect = null;
    }
  }

  onMouseUp() {
    this.isDrawing = false;
    setTimeout(() => {
      this.selectedNode = null;
    }, 100);
  }

  onDoubleClick(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    const clickedNode = this.mindmap.nodes.find(node => this.isPointInNode(x, y, node));
    if (clickedNode) {
      this.editingNode = clickedNode;
      const newText = prompt('Enter new text:', clickedNode.text);
      if (newText !== null) {
        clickedNode.text = newText;
        this.render();
      }
      this.editingNode = null;
    } else if (!this.isConnectingNodes) {
      const newNode = this.mindmap.addNode('New Node', x, y);
      this.render();
    }
  }

  isPointInNode(x, y, node = this.selectedNode) {
    if (!node) {
      return false;
    }
    return (
      x >= node.x &&
      x <= node.x + node.width &&
      y >= node.y &&
      y <= node.y + node.height
    );
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.mindmap.nodes.forEach(node => {

      if (node === this.selectedNode) {
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
        this.ctx.fillRect(node.x, node.y, node.width, node.height);
      }
      node.render(this.ctx);
    });

    this.mindmap.connectors.forEach(connector => connector.render(this.ctx));
  }
}

export default Canvas;
