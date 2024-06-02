import BaseNode from "./BaseNode.js";

const tempDiv = document.createElement('div');
tempDiv.className = 'node-text';
tempDiv.style.display = 'none';
document.body.appendChild(tempDiv);
const computedStyles = window.getComputedStyle(tempDiv);

class OvalNode extends BaseNode {
  constructor(text, x, y) {
    super(text ? text.substring(0, 10) : '', x, y); // Limit the text input to 10 letters
    this.radiusX = 100; // Set the horizontal radius for the oval
    this.radiusY = 50; // Set the vertical radius for the oval
    this.type = 'oval';
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.font = computedStyles.fontSize + ' ' + computedStyles.fontFamily;
    ctx.fillStyle = computedStyles.color;
    ctx.fillText(this.text, -this.radiusX + 10, 0);
    ctx.restore();
  }

  loadData(data) {
    super.loadData(data);
    this.text = this.text.substring(0, 10); // Ensure the text is limited to 10 letters when loading data
    return this;
  }
}

export default OvalNode;
