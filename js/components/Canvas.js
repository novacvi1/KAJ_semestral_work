import InputField from './InputField.js';

const dropZone = document.querySelector('.drag-zone');
// Select the input field and the error message div
const nodeInput = document.querySelector('.node-input');
const inputError = document.getElementById('input-error');


class Canvas {
  constructor(canvasId, mindmap) {
    this.mindmap = mindmap;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.selectedNode = null;
    this.startX = 0;
    this.startY = 0;
    this.connectingNodes = false;
    this.contextMenuVisible = false;
    this.contextMenuX = 0;
    this.contextMenuY = 0;
    this.mindmap.nodes.forEach((node, index) => {
      node.zIndex = index;
    });
    this.inputField = new InputField(this.canvas, this.onInputFieldEnterOrEscape.bind(this), this.onInputFieldBlur.bind(this));
    // Set the canvas's width and height attributes to match its display size
    this.resizeCanvas();

    const dropArea = document.getElementById('drop-area');

    dropZone.addEventListener('dragenter', (event) => {
      dropArea.style.display = 'block';
      event.preventDefault();
      this.showPlaceholder();
    });

    dropArea.addEventListener('dragover', (event) => {
      event.preventDefault(); // This line is important
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.style.display = 'none';
      this.hidePlaceholder();
    });

    dropArea.addEventListener('drop', (event) => {
      event.preventDefault();
      this.hidePlaceholder();
      dropArea.style.display = 'none';
      const files = event.dataTransfer.files; // The files that were dropped

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.loadCanvasStateFromFileDrop(file); // Function to handle the file
      }
    });

    nodeInput.addEventListener('input', () => {
      const inputValue = nodeInput.value

      // Check if the input is empty or exceeds the maximum length
      if (inputValue.trim() === '') {
        inputError.textContent = 'Input cannot be empty';
        inputError.style.display = 'block';
      } else if (inputValue.length > 100) {
        inputError.textContent = 'Input exceeds the maximum length of 100 characters';
        inputError.style.display = 'block';
      } else {
        // If the input is valid, hide the error message and reset the border color
        inputError.style.display = 'none';
      }
    });

    document.querySelectorAll('.save-map').forEach((button) => {button.addEventListener('click', () => {
      this.mindmap.saveCanvasStateToFile()});
    });
    document.querySelectorAll('.load-map').forEach((button) => {button.addEventListener('click', () => {
      document.getElementById('file-input').click()});
    });
    document.getElementById('file-input').addEventListener('change', (event) =>
      this.loadCanvasState(event));

    // Add an event listener to resize the canvas whenever the window is resized
    window.addEventListener('resize', () => this.resizeCanvas());

    document.querySelectorAll('.new-map').forEach((button) => {
      button.addEventListener('click', () =>
        this.newMap());
    });

    // History state
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        //this.newMap()
        this.mindmap.loadData(event.state);
        this.render();
      }
    });
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

    // Touch events
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  // Right-click on canvas
  onContextMenu(e) {
    // Close opened context menu
    this.onWindowClick(e);

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

  // Show the placeholder
  showPlaceholder() {
    document.getElementById('canvas-placeholder-on-drag').style.display = 'block';
  }

  // Hide the placeholder
  hidePlaceholder() {
    document.getElementById('canvas-placeholder-on-drag').style.display = 'none';
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
      this.showInputField();
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
      this.showInputField();
      this.inputField.setValue(this.selectedNode.text);
      this.inputField.focus();
      this.render();
    } else if (targetId === 'connect-nodes') {
      this.connectingNodes = this.selectedNode;
    }
    this.hideContextMenu();
  }

  showErrorModal(message) {
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const closeErrorButton = document.getElementById('close-error-button');

    errorMessage.textContent = message;
    errorModal.classList.add('show');

    closeErrorButton.addEventListener('click', hideErrorModal);
    window.addEventListener('click', outsideClickHandler);

    function hideErrorModal() {
      errorModal.classList.remove('show');
      closeErrorButton.removeEventListener('click', hideErrorModal);
      window.removeEventListener('click', outsideClickHandler);
    }

    function outsideClickHandler(event) {
      if (!errorModal.contains(event.target)) {
        hideErrorModal();
      }
    }
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

      if (this.connectingNodes) {
        if (this.selectedNode !== this.connectingNodes) {
          this.mindmap.connectNodes(this.selectedNode, this.connectingNodes);
          this.connectingNodes = false;
          this.selectedNode = null;
        }
      }
    } else {
      this.selectedNode = null;
      if (this.connectingNodes) {
        this.connectingNodes = false;
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

    this.showInputField();

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
      if (this.inputField.getValue().length <= 100 && this.inputField.getValue().trim() !== '') {
        this.selectedNode.text = this.inputField.getValue();
        try {
          this.inputField.inputField.style.display = 'none';
        } catch (e) {}
        this.render();
      }
    }
    if (e.key === 'Escape') {
      this.onInputFieldBlur()
    }
  }

  onInputFieldBlur() {
    try {
      this.inputField.inputField.style.display = 'none';
      document.querySelector('#input-error').style.display = 'none';
    } catch (e) {
    }
  }

  showInputField() {
    this.inputField.inputField.style.display = 'block';

    this.inputField.focus();

    // Add an input event listener to resize the node when the input field's value changes
    this.inputField.inputField.addEventListener('input', () => {
      // Check if the input is empty or exceeds the maximum length
      if (this.inputField.getValue().length <= 100 && this.inputField.getValue().trim() !== '') {
        this.selectedNode.text = this.inputField.getValue();
        this.render();
      }
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
    //this.mindmap.saveCanvasState();
  }

  loadCanvasState(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        try {
          const json = JSON.parse(content);
          this.mindmap.loadDataFromLocalStorage(json);
          this.render();
        } catch (error) {
          this.showErrorModal('Error parsing JSON, wrong file input! Use only files saved by this app.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the file input value to allow the same file to be selected again
    event.target.value = '';
  }

  loadCanvasStateFromFileDrop(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const json = JSON.parse(content);
        this.mindmap.loadDataFromLocalStorage(json);
        this.render();
      } catch (error) {
        this.showErrorModal('Error parsing JSON, wrong file input! Use only files saved by this app.');
      }
    };
    reader.readAsText(file); // Read the file as text
  }

  onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.canvas.dispatchEvent(mouseEvent);
  }

  onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.canvas.dispatchEvent(mouseEvent);
  }

  onTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    this.canvas.dispatchEvent(mouseEvent);
  }

  // To change the size of the canvas when the window is resized
  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.render();
  }
}

export default Canvas;
