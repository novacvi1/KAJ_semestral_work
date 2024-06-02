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

    this.inputField = new InputField(this.canvas, this.onInputFieldEnterOrEscape.bind(this), this.onInputFieldBlur.bind(this));
    this.contextMenu = new ContextMenu(this, this.inputField);
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
    window.addEventListener('resize', this.resizeCanvas.bind(this));
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
    if (this.mindmap.rectangleNodes.length === 0 && this.mindmap.ovalNodes.length === 0) {
      // Show guide message when there are no nodes
      guideMessage.style.display = 'flex';
    } else {
      // Hide guide message when nodes exist
      guideMessage.style.display = 'none';
      // First, render all connectors
      this.mindmap.connectors.forEach(connector => {
        connector.render(this.ctx);
      });

      // Then, render all rectangle nodes
      this.mindmap.rectangleNodes.forEach(node => {
        node.render(this.ctx);

        if (node === this.selectedNode) {
          this.ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
          this.ctx.fillRect(node.x, node.y, node.width, node.height);
        }
      });

      // Then, render all oval nodes
      this.mindmap.ovalNodes.forEach(node => {
        node.render(this.ctx);

        if (node === this.selectedNode) {
          this.ctx.beginPath();
          this.ctx.ellipse(node.x, node.y, node.radiusX, node.radiusY, 0, 0, 2 * Math.PI);
          this.ctx.fillStyle = 'rgba(255, 165, 0, 0.2)';
          this.ctx.fill();
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

    const clickedNodes = [...this.mindmap.rectangleNodes, ...this.mindmap.ovalNodes]
      .filter(node => this.isPointInNode(x, y, node))
      .sort((a, b) => b.zIndex - a.zIndex);

    if (clickedNodes.length > 0) {
      if (this.selectedNode) this.selectedNode.selectedNode = null;
      this.selectedNode = clickedNodes[0];
      this.selectedNode.zIndex = this.mindmap.rectangleNodes.length + this.mindmap.ovalNodes.length;
      this.isDrawing = true;
      this.startX = x - clickedNodes[0].x;
      this.startY = y - clickedNodes[0].y;

      if (this.selectedNode.type === 'rectangle') {
        this.mindmap.rectangleNodes = this.mindmap.rectangleNodes.filter(node => node !== this.selectedNode);
        this.mindmap.rectangleNodes.push(this.selectedNode);
      } else if (this.selectedNode.type === 'oval') {
        this.mindmap.ovalNodes = this.mindmap.ovalNodes.filter(node => node !== this.selectedNode);
        this.mindmap.ovalNodes.push(this.selectedNode);
      }

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

    const clickedNode = [...this.mindmap.rectangleNodes, ...this.mindmap.ovalNodes].find(node => this.isPointInNode(x, y, node));
    if (clickedNode) {
      this.showInputField()
    } else {
      this.contextMenu.showNodeTypeContextMenu(e.clientX, e.clientY);
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

  onInputFieldEnterOrEscape(e) {
    if (e.key === 'Enter') {
      if (this.selectedNode.type === 'oval') {
        this.selectedNode.text = this.inputField.getValue().substring(0, 17);
      } else if (this.inputField.getValue().length <= 100 && this.inputField.getValue().trim() !== '') {
        this.selectedNode.text = this.inputField.getValue();
      }
      try {
        this.inputField.inputField.style.display = 'none';
      } catch (e) {}
      this.render();
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
    if (node.type === 'rectangle') {
      return (
        x >= node.x &&
        x <= node.x + node.width &&
        y >= node.y &&
        y <= node.y + node.height
      );
    } else if (node.type === 'oval') {
      const dx = x - node.x;
      const dy = y - node.y;
      return (dx * dx) / (node.radiusX * node.radiusX) + (dy * dy) / (node.radiusY * node.radiusY) <= 1;
    }
  }

  showInputField() {
    this.inputField.show();
    this.inputField.focus();
    this.inputField.inputField.addEventListener('input', () => {
      if (this.inputField.getValue().length <= 100 && this.inputField.getValue().trim() !== '') {
        if (this.selectedNode.type === 'oval') {
          this.selectedNode.text = this.inputField.getValue().substring(0, 17);
          this.render();
        } else {
          this.selectedNode.text = this.inputField.getValue();
          this.render();
        }
      }
    });
    this.inputField.setValue(this.selectedNode.text);
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
      clientY: touch.clientY,
    });

    this.canvas.dispatchEvent(mouseEvent);

    //TODO fix
    const pointerEvent = new PointerEvent('click', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      pointerId: touch.identifier,
      pointerType: 'touch',
      isTrusted: true,
      isPrimary: true,
    });

    // const windowClickEvent = new PointerEvent('click', {
    //   clientX: touch.clientX,
    //   clientY: touch.clientY,
    //   pointerId: 2,
    //   target: this.canvas,
    // });
    // window.dispatchEvent(windowClickEvent);
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
