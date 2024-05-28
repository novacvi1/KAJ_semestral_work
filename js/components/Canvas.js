import InputField from './InputField.js';
import Storage from '../data/Storage.js';

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
    this.storage = new Storage();

    // Set the canvas's width and height attributes to match its display size
    this.resizeCanvas();
    document.getElementById('save-map').addEventListener('click', () => this.saveCanvasState());
    document.getElementById('load-map').addEventListener('click', () => this.loadCanvasState());

    // Add an event listener to resize the canvas whenever the window is resized
    window.addEventListener('resize', () => this.resizeCanvas());

    document.getElementById('new-map').addEventListener('click', () => this.newMap());
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    this.canvas.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
    document.getElementById('context-menu').addEventListener('click', this.onContextMenuClick.bind(this));
    document.getElementById('context-menu-on-node').addEventListener('click', this.onContextMenuClickOnNode.bind(this));
    window.addEventListener('click', this.onWindowClick.bind(this));
  }

  // Right-click on canvas
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
      let canvasOffset = this.canvas.getBoundingClientRect();
      this.selectedNode = this.mindmap.addNode('New Node', this.contextMenuX - canvasOffset.x,
        this.contextMenuY - canvasOffset.y);
      this.createInputField();
      this.inputField.setValue(this.selectedNode.text);
      this.inputField.focus();
      this.render();
    }
    this.hideContextMenu();
  }

  onContextMenuClickOnNode(e) {
    const targetId = e.target.id;

    if (targetId === 'delete-node' && this.selectedNode) {
      this.mindmap.removeNode(this.selectedNode);
      this.selectedNode = null;
      this.render();
    } else if (targetId === 'edit-node' && this.selectedNode) {
      this.createInputField();
      this.inputField.setValue(this.selectedNode.text);
      this.inputField.focus();
      this.render();
    } else if (targetId === 'connect-nodes') {
      this.isConnectingNodes = true;
    }
    this.hideContextMenu();
  }

  onKeyDown(e) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && this.isHidden()) {
      if (this.selectedNode) {
        this.mindmap.removeNode(this.selectedNode);
        this.selectedNode = null;
        this.render();
      }
    }
  }

  isHidden() {
    if (this.inputField && this.inputField.inputField) {
      return this.inputField.inputField !== document.activeElement;
    } else {
      return true;
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

    const clickedNodes = this.mindmap.nodes
      .filter(node => this.isPointInNode(x, y, node))
      .sort((a, b) => b.zIndex - a.zIndex);
    if (clickedNodes.length > 0) {
      // If a node is clicked, set it as the selected node and delete previous selection
      if (this.selectedNode) this.selectedNode.selectedNode = null;
      this.selectedNode = clickedNodes[0];
      this.selectedNode.zIndex = this.mindmap.nodes.length;
      this.isDrawing = true;
      this.startX = x - clickedNodes[0].x;
      this.startY = y - clickedNodes[0].y;

      // Bring the selected node to the front
      this.mindmap.nodes = this.mindmap.nodes.filter(node => node !== this.selectedNode);
      this.mindmap.nodes.push(this.selectedNode);

      console.log(clickedNodes.zIndex);

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
  }

  onDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.createInputField();

    const clickedNode = this.mindmap.nodes.find(node => this.isPointInNode(x, y, node));
    if (clickedNode) {
      this.inputField.setValue(clickedNode.text);
    } else {
      const newNode = this.mindmap.addNode('New Node', x, y);
      this.selectedNode = newNode;
      this.render();
      this.inputField.setValue(newNode.text);
    }
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

  onInputFieldEnterOrEscape(e) {
    if (e.key === 'Enter') {
      this.selectedNode.text = this.inputField.getValue();
      try {
        this.inputField.remove();
      } catch (e) {
      }
      this.render();
    }
    if (e.key === 'Escape') {
      this.onInputFieldBlur()
    }

    // Remove the input event listener when the input field is removed
    this.inputField.inputField.removeEventListener('input', this.inputField.inputField.oninput);
  }

  onInputFieldBlur() {
    try {
      this.inputField.remove();
    } catch (e) {
    }
  }

  createInputField() {
    this.inputField = new InputField(
      this.canvas.parentNode,
      this.canvas,
      this.onInputFieldEnterOrEscape.bind(this),
      this.onInputFieldBlur.bind(this)
    );

    this.inputField.focus();

    // Add an input event listener to resize the node when the input field's value changes
    this.inputField.inputField.addEventListener('input', () => {
      this.selectedNode.text = this.inputField.getValue();
      this.render();
    });
  }

  newMap() {
    this.mindmap.nodes = [];
    this.mindmap.connectors = [];
    localStorage.removeItem('canvasState');
    this.render();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const guideMessage = document.getElementById('guide-message');
    if (this.mindmap.nodes.length === 0) {
      // Show guide message when there are no nodes
      guideMessage.style.display = 'flex';
    } else {
      // Hide guide message when nodes exist
      guideMessage.style.display = 'none';
      // First, render all connectors
      this.mindmap.connectors.forEach(connector => {
        connector.render(this.ctx);
      });

      // Then, render all nodes
      this.mindmap.nodes.forEach(node => {
        node.render(this.ctx);

        if (node === this.selectedNode) {
          this.ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
          this.ctx.fillRect(node.x, node.y, node.width, node.height);
        }
      });
    }
    this.saveCanvasState();
  }

  saveCanvasState() {
    const mindmapData = this.mindmap.getData();
    this.storage.saveData(mindmapData);
  }

  loadCanvasState() {
    const loadedData = this.storage.loadData();
    if (loadedData) {
      this.mindmap.loadData(loadedData);
      // Redraw the canvas based on the loaded state
      this.render();
    }
  }

  // To change the size of the canvas when the window is resized
  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.render();
  }
}

export default Canvas;
