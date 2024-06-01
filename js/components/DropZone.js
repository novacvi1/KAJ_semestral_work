class DropZone {
  constructor(dropZoneSelector, dropAreaSelector, canvasInstance) {
    this.dropZone = document.querySelector(dropZoneSelector);
    this.dropArea = document.querySelector(dropAreaSelector);
    this.canvasInstance = canvasInstance;

    this.dropZone.addEventListener('dragenter', this.handleDragEnter.bind(this));
    this.dropArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.dropArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.dropArea.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragEnter(event) {
    this.dropArea.style.display = 'block';
    event.preventDefault();
    this.showPlaceholder();
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDragLeave() {
    this.dropArea.style.display = 'none';
    this.canvasInstance.hidePlaceholder();
  }

  handleDrop(event) {
    event.preventDefault();
    this.hidePlaceholder();
    this.dropArea.style.display = 'none';
    const files = event.dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.canvasInstance.loadCanvasStateFromFileDrop(file);
    }
  }

  showPlaceholder() {
    document.getElementById('canvas-placeholder-on-drag').style.display = 'block';
  }

  hidePlaceholder() {
    document.getElementById('canvas-placeholder-on-drag').style.display = 'none';
  }
}

export default DropZone;
