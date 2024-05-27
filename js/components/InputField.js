export default class InputField {
  constructor(parentNode, canvas, onEnter, onBlur) {
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.className = 'node-input';
    this.inputField.style.position = 'absolute';
    this.inputField.style.width = '200px';
    this.inputField.addEventListener('keydown', onEnter);
    this.inputField.addEventListener('blur', onBlur);
    parentNode.appendChild(this.inputField);
    this.canvas = canvas;
    // Position inputField in the center of the screen horizontally

    this.inputField.style.left = `${window.innerWidth - this.inputField.style.width / 2}px`;
    // Position inputField in the upper part of the canvas

    this.inputField.style.top = `${this.canvas.offsetTop + this.canvas.offsetHeight * 0.03}px`;
  }

  focus() {
    this.inputField.focus();
  }

  setValue(value) {
    this.inputField.value = value;
  }

  getValue() {
    return this.inputField.value;
  }

  remove() {
    this.inputField.remove();
  }
}
