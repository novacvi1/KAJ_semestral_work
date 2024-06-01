import InputField from './InputField.js';
import DropZone from './DropZone.js';
import ContextMenu from './ContextMenu.js';
import NodeInput from './NodeInput.js';

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

    this.contextMenu = new ContextMenu(this);
    this.inputField = new InputField(this.canvas, this.onInputFieldEnterOrEscape.bind(this), this.onInputFieldBlur.bind(this));
    this.nodeInput = new NodeInput('.node-input', 'input-error', this);
    new DropZone('.drag-zone', '#drop-area', this);

    this.initEvents();
    this.resizeCanvas();
    this.initButtons();
    this.initHistory();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    this.canvas.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  initButtons() {
    document.querySelectorAll('.save-map').forEach((button) => {
      button.addEventListener('click', () => {
        this.mindmap.saveCanvasStateToFile();
      });
    });
    document.querySelectorAll('.load-map').forEach((button) => {
      button.addEventListener('click', () => {
        document.getElementById('file-input').click();
      });
    });
    document.getElementById('file-input').addEventListener('change', (event) =>
      this.loadCanvasState(event)
    );

    document.querySelectorAll('.new-map').forEach((button) => {
      button.addEventListener('click', () => this.newMap());
    });
  }

  initHistory() {
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        this.mindmap.loadData(event.state);
        this.render();
      }
    });
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
    this.mindmap.saveCanvasStateToLocalStorage();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.render();
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNodes = this.mindmap.nodes
      .filter(node => this.isPointInNode(x, y, node))
      .sort((a, b) => b.zIndex - a.zIndex);

    if (clickedNodes.length > 0) {
      if (this.selectedNode) this.selectedNode.selectedNode = null;
      this.selectedNode = clickedNodes[0];
      this.selectedNode.zIndex = this.mindmap.nodes.length;
      this.isDrawing = true;
      this.startX = x - clickedNodes[0].x;
      this.startY = y - clickedNodes[0].y;

      this.mindmap.nodes = this.mindmap.nodes.filter(node => node !== this.selectedNode);
      this.mindmap.nodes.push(this.selectedNode);

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

  onMouseMove(e) {
    if (this.isDrawing && this.selectedNode) {
      const x = e.offsetX - this.startX;
      const y = e.offsetY - this.startY;
      this.selectedNode.move(x, y);
      this.render();
    }
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

  showInputField() {
    this.inputField.show();
    this.inputField.inputField.addEventListener('input', () => {
      if (this.inputField.getValue().length <= 100 && this.inputField.getValue().trim() !== '') {
        this.selectedNode.text = this.inputField.getValue();
        this.render();
      }
    });
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
      this.onInputFieldBlur();
    }
  }

  onInputFieldBlur() {
    try {
      this.inputField.inputField.style.display = 'none';
      document.querySelector('#input-error').style.display = 'none';
    } catch (e) {}
  }

  newMap() {
    this.mindmap.nodes = [];
    this.mindmap.connectors = [];
    localStorage.removeItem('canvasState');
    this.render();
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
    reader.readAsText(file);
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
}

export default Canvas;
