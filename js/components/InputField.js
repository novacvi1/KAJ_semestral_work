export default class InputField {
  constructor(canvas, onEnter, onBlur) {
    this.inputField = document.querySelector('.node-input');
    this.inputField.addEventListener('keydown', onEnter);
    this.inputField.addEventListener('blur', onBlur);
    this.canvas = canvas;

    // Position inputField
    this.positionInputField();

    // Add event listener for window resize
    window.addEventListener('resize', () => this.positionInputField());
  }

  positionInputField() {
    let computedStyle = window.getComputedStyle(this.inputField);
    let width = computedStyle.width;
    let widthValue = parseInt(width, 10); // Remove "px" and convert to number

    document.querySelector('#input-container').style.left = `${(window.innerWidth - widthValue) / 2}px`;
    document.querySelector('#input-container').style.top = `${this.canvas.offsetTop + this.canvas.offsetHeight * 0.03}px`;
    // Position inputField in the center of the screen horizontally
    //this.inputField.style.left = `${(window.innerWidth - widthValue) / 2}px`;

    // Position inputField in the upper part of the canvas
    //this.inputField.style.top = `${this.canvas.offsetTop + this.canvas.offsetHeight * 0.03}px`;
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
}
