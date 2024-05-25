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
    this.contextMenuVisible = false;
    this.contextMenuX = 0;
    this.contextMenuY = 0;
    this.mindmap.nodes.forEach((node, index) => {
      node.zIndex = index;
    });
    // Set the canvas's width and height attributes to match its display size
    this.resizeCanvas();

    // Add an event listener to resize the canvas whenever the window is resized
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('keydown', this.onKeyDown.bind(this));
    this.canvas.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
    document.getElementById('context-menu').addEventListener('click', this.onContextMenuClick.bind(this));
    window.addEventListener('click', this.onWindowClick.bind(this));
  }

  onContextMenu(e) {
    e.preventDefault();

    const x = e.offsetX;
    const y = e.offsetY;
    const clickedNode = this.mindmap.nodes.find(node => this.isPointInNode(x, y, node));

    if (clickedNode) {
      this.selectedNode = clickedNode;
    } else {
      this.selectedNode = null;
    }

    this.contextMenuX = e.clientX;
    this.contextMenuY = e.clientY;
    this.showContextMenu();
    this.render();
  }

  showContextMenu() {
    let contextMenu = document.getElementById('context-menu');
    if (this.selectedNode) {
      contextMenu = document.getElementById('context-menu-on-node');
    }
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${this.contextMenuX}px`;
    contextMenu.style.top = `${this.contextMenuY}px`;
    this.contextMenuVisible = true;
    console.log('Context Menu:', this.contextMenuX, this.contextMenuY);
  }

  hideContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    const contextMenuOnNode = document.getElementById('context-menu-on-node');
    contextMenu.style.display = 'none';
    contextMenuOnNode.style.display = 'none';
    this.contextMenuVisible = false;
  }

  onContextMenuClick(e) {
    const targetId = e.target.id;

    if (targetId === 'create-node') {
      this.selectedNode = this.mindmap.addNode('New Node', this.contextMenuX, this.contextMenuY);
      console.log('Selected Node:', this.selectedNode);
      this.render();
    } else if (targetId === 'delete-node' && this.selectedNode) {
      this.mindmap.removeNode(this.selectedNode);
      this.selectedNode = null;
      this.render();
    } else if (targetId === 'edit-node' && this.selectedNode) {
      const newText = prompt('Enter new text:', this.selectedNode.text);
      if (newText !== null) {
        this.selectedNode.text = newText;
        this.render();
      }
    } else if (targetId === 'connect-nodes') {
      this.isConnectingNodes = true;
    } else if (targetId === 'auto-layer') {
      this.autoLayer();
    }

    this.hideContextMenu();
  }

  autoLayer() {
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

    this.render();
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
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log('Mouse click coordinates:', e.clientX, e.clientY);
    console.log('Canvas coordinates:', rect.left, rect.top);

    const clickedNodes = this.mindmap.nodes
      .filter(node => this.isPointInNode(x, y, node))
      .sort((a, b) => b.zIndex - a.zIndex);
    if (clickedNodes.length > 0) {
      this.selectedNode = clickedNodes[0];
      this.selectedNode.zIndex = this.mindmap.nodes.length;
      this.isDrawing = true;
      this.startX = x - clickedNodes[0].x;
      this.startY = y - clickedNodes[0].y;

      if (this.isConnectingNodes) {
        if (this.nodeToConnect) {
          this.mindmap.connectNodes(this.nodeToConnect, clickedNodes[0]);
          this.isConnectingNodes = false;
          this.nodeToConnect = null;

        } else {
          this.nodeToConnect = clickedNodes[0];
        }
      }
    } else {
      this.selectedNode = null;
      if (this.isConnectingNodes) {
        this.isConnectingNodes = false;
        this.nodeToConnect = null;
      }
    }
    this.render();
  }

  onMouseUp() {
    this.isDrawing = false;
    setTimeout(() => {
      this.selectedNode = null;
    }, 100);
  }

  onDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log('Mouse click coordinates:', e.clientX, e.clientY);
    console.log('Canvas coordinates:', rect.left, rect.top);
    console.log('x:', x, 'y:', y);

    const clickedNode = this.mindmap.nodes.find(node => this.isPointInNode(x, y, node));
    let inputField = document.createElement('input');
    inputField.style.position = 'absolute';

    if (clickedNode) {
      inputField.style.left = `${clickedNode.x + clickedNode.width / 2 - inputField.offsetWidth / 2}px`;
      inputField.style.top = `${clickedNode.y + clickedNode.height / 2 - inputField.offsetHeight / 2}px`;
      inputField.value = clickedNode.text;
    } else {
      const newNode = this.mindmap.addNode('New Node', x, y);
      this.render();
      inputField.style.left = `${newNode.x + newNode.width / 2 - inputField.offsetWidth / 2}px`;
      inputField.style.top = `${newNode.y + newNode.height / 2 - inputField.offsetHeight / 2}px`;
      inputField.value = newNode.text;
    }

    this.canvas.parentNode.appendChild(inputField);
    inputField.focus();

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (clickedNode) {
          clickedNode.text = inputField.value;
        } else {
          newNode.text = inputField.value;
        }
        this.canvas.parentNode.removeChild(inputField);
        this.render();
      }
    });

    inputField.addEventListener('blur', () => {
      this.canvas.parentNode.removeChild(inputField);
    });
  }

  onWindowClick(e) {
    if (!this.contextMenuVisible) return;

    const contextMenu = document.getElementById('context-menu');
    const isClickInsideContextMenu = contextMenu.contains(e.target);

    if (!isClickInsideContextMenu) {
      this.hideContextMenu();
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

      node.render(this.ctx);
      node.renderConnections(this.ctx, this.mindmap.connectors);

      if (node === this.selectedNode) {
        this.ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
        this.ctx.fillRect(node.x, node.y, node.width, node.height);
      }
    });
  }

  // To change the size of the canvas when the window is resized
  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.render();
  }
}

export default Canvas;
