class ContextMenu {
  constructor(canvas, inputField) {
    this.inputField = inputField;
    this.canvas = canvas;
    this.contextMenuVisible = false;
    this.contextMenuX = 0;
    this.contextMenuY = 0;
    this.initEvents();
  }

  initEvents() {
    this.canvas.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
    document.getElementById('context-menu').addEventListener('click', this.onContextMenuClick.bind(this));
    document.getElementById('context-menu-on-node').addEventListener('click', this.onContextMenuClickOnNode.bind(this));
    document.getElementById('node-type-context-menu').addEventListener('click', this.onNodeTypeContextMenuClick.bind(this));
    window.addEventListener('click', this.onWindowClick.bind(this));
  }

  onContextMenu(e) {
    this.onWindowClick(e);

    e.preventDefault();

    const x = e.offsetX;
    const y = e.offsetY;
    const clickedNode = this.canvas.mindmap.nodes.find(node => this.canvas.isPointInNode(x, y, node));

    if (clickedNode) {
      this.canvas.selectedNode = clickedNode;
    } else {
      this.canvas.selectedNode = null;
    }

    this.contextMenuX = e.clientX;
    this.contextMenuY = e.clientY;
    this.showContextMenu();
    this.canvas.render();
  }

  showContextMenu() {
    let contextMenu = document.getElementById('context-menu');
    if (this.canvas.selectedNode) {
      contextMenu = document.getElementById('context-menu-on-node');
    }
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${this.contextMenuX}px`;
    contextMenu.style.top = `${this.contextMenuY}px`;
    this.contextMenuVisible = true;
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
      this.showNodeTypeContextMenu(e.clientX, e.clientY);
    }
    this.hideContextMenu();
  }

  onContextMenuClickOnNode(e) {
    const targetId = e.target.id;

    if (targetId === 'delete-node' && this.canvas.selectedNode) {
      this.canvas.mindmap.removeNode(this.canvas.selectedNode);
      this.canvas.selectedNode = null;
      this.canvas.render();
    } else if (targetId === 'edit-node' && this.canvas.selectedNode) {
      this.canvas.showInputField();
      // this.canvas.inputField.setValue(this.canvas.selectedNode.text);
      // this.canvas.inputField.focus();
      this.canvas.render();
    } else if (targetId === 'connect-nodes') {
      this.canvas.connectingNodes = this.canvas.selectedNode;
    }
    this.hideContextMenu();
  }

  onWindowClick(e) {
    if (!this.contextMenuVisible) return;

    const contextMenu = document.getElementById('context-menu');
    const nodeTypeContextMenu = document.getElementById('node-type-context-menu');
    const isClickInsideContextMenu = contextMenu.contains(e.target);

    if (!isClickInsideContextMenu) {
      this.hideContextMenu();
    }
    if (!nodeTypeContextMenu.contains(e.target)) {
      this.hideNodeTypeContextMenu();
    }
  }

  onNodeTypeContextMenuClick(e) {
    this.contextMenuVisible = true;
    const targetId = e.target.id;

    let canvasOffset = this.canvas.canvas.getBoundingClientRect();
    if (targetId === 'create-rectangle-node') {
      this.canvas.selectedNode = this.canvas.mindmap.addNodeRectangle('New Node', e.clientX - canvasOffset.x,
        e.clientY - canvasOffset.y);
    } else if (targetId === 'create-oval-node') {
      this.canvas.selectedNode = this.canvas.mindmap.addNodeOval('New Node', e.clientX - canvasOffset.x,
        e.clientY - canvasOffset.y);
    } else {
      return;
    }
    this.canvas.showInputField();
    // this.canvas.inputField.setValue(this.canvas.selectedNode.text);
    // this.canvas.inputField.focus();
    this.canvas.render();

    this.hideNodeTypeContextMenu();
  }

  hideNodeTypeContextMenu() {
    const contextMenu = document.getElementById('node-type-context-menu');
    contextMenu.style.display = 'none';
    this.contextMenuVisible = false;
  }

  showNodeTypeContextMenu(x, y) {
    const contextMenu = document.getElementById('node-type-context-menu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    this.contextMenuVisible = true;
  }
}

export default ContextMenu;
