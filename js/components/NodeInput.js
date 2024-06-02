class NodeInput {
  constructor(selector, errorSelector, canvas) {
    this.nodeInput = document.querySelector(selector);
    this.inputError = document.getElementById(errorSelector);
    this.canvas = canvas;
    this.initEvents();
  }

  initEvents() {
    this.nodeInput.addEventListener('input', this.onInputChange.bind(this));
  }

  onInputChange() {
    const inputValue = this.nodeInput.value

    // Check if the input is empty or exceeds the maximum length
    if (inputValue.trim() === '') {
      this.inputError.textContent = 'Input cannot be empty';
      this.inputError.style.display = 'block';
    } else if (this.canvas.selectedNode.type === 'oval' && inputValue.length >= 17) {
      this.inputError.innerHTML = 'Input maximum length<br> is 17 characters';
      this.inputError.style.display = 'block';
    } else if (inputValue.length >= 100) {
      this.inputError.innerHTML = 'Input maximum length<br> is 100 characters';
      this.inputError.style.display = 'block';
    } else {
      // If the input is valid, hide the error message and reset the border color
      this.inputError.style.display = 'none';
    }
  }
}

export default NodeInput;
