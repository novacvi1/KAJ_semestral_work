export default class InputField {
  constructor(canvas, onEnter, onBlur) {
    this.inputField = document.querySelector('.node-input');
    this.canvas = canvas;
    this.onEnter = onEnter;
    this.onBlur = onBlur;
    this.initEvents();

    // Position inputField
    this.positionInputField();

    // Add event listener for window resize
    window.addEventListener('resize', () => this.positionInputField());
  }

  initEvents() {
    this.inputField.addEventListener('keydown', this.onEnter);
    this.inputField.addEventListener('blur', this.onBlur);
  }

  positionInputField() {
    let computedStyle = window.getComputedStyle(this.inputField);
    let width = computedStyle.width;
    let widthValue = parseInt(width, 10); // Remove "px" and convert to number

    document.querySelector('#input-container').style.left = `${(window.innerWidth - widthValue) / 2}px`;
    document.querySelector('#input-container').style.top = `${this.canvas.offsetTop + this.canvas.offsetHeight * 0.03}px`;
  }

  show() {
    this.inputField.style.display = 'block';
    this.focus();
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
