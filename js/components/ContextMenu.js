class ContextMenu {
  constructor(canvas) {
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
      let canvasOffset = this.canvas.canvas.getBoundingClientRect();
      this.canvas.selectedNode = this.canvas.mindmap.addNode('New Node', this.contextMenuX - canvasOffset.x,
        this.contextMenuY - canvasOffset.y);
      this.canvas.showInputField();
      this.canvas.inputField.setValue(this.canvas.selectedNode.text);
      this.canvas.inputField.focus();
      this.canvas.render();
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
      this.canvas.inputField.setValue(this.canvas.selectedNode.text);
      this.canvas.inputField.focus();
      this.canvas.render();
    } else if (targetId === 'connect-nodes') {
      this.canvas.connectingNodes = this.canvas.selectedNode;
    }
    this.hideContextMenu();
  }

  onWindowClick(e) {
    if (!this.contextMenuVisible) return;

    const contextMenu = document.getElementById('context-menu');
    const isClickInsideContextMenu = contextMenu.contains(e.target);

    if (!isClickInsideContextMenu) {
      this.hideContextMenu();
    }
  }
}

export default ContextMenu;
