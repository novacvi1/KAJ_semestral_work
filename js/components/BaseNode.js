const tempDiv = document.createElement('div');
tempDiv.className = 'node-text';
tempDiv.style.display = 'none';
document.body.appendChild(tempDiv);
const computedStyles = window.getComputedStyle(tempDiv);


class BaseNode {
  constructor(text = 'New Node', x = 0, y = 0) {
    this.id = Date.now();
    this.text = String(text);
    this.x = x;
    this.y = y;
    this.height = 40;
    this.rotation = 0;
    this.zIndex = 0;
    this.maxWidth = 100;
    this.width = 200;
  }

  render(ctx) {
    // Make the node size dynamic based on the text
    // Measure the width of the text
    tempDiv.innerHTML = this.text;
    tempDiv.style.display = 'inline';
    tempDiv.style.display = 'none';

    // Split the text into characters
    const characters = this.text.split('');
    const lines = [];
    let currentLine = characters[0];

    characters.forEach((character, i) => {
      if (i > 0) {
        const width = ctx.measureText(currentLine + character).width;
        if (width < this.maxWidth) {
          currentLine += character;
        } else {
          lines.push(currentLine);
          currentLine = character;
        }
      }
    });
    lines.push(currentLine);

    const lineHeight = parseFloat(computedStyles.lineHeight);
    const paddingVertical = 14; // Define your padding
    const paddingHorizontal = 10; // Define your padding

    // Adjust the height of the node for each new line
    this.height = ((lines.length) * (lineHeight)) + paddingVertical * 2; // Add padding to the height calculation

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.font = computedStyles.fontSize + ' ' + computedStyles.fontFamily;
    ctx.fillStyle = computedStyles.color;
    ctx.fillStyle = '#000';


    // Draw each line separately
    lines.forEach((line, i) => {
      ctx.fillText(line, -this.width / 2 + paddingHorizontal, (-this.height) / 2 + paddingVertical * 2 + i * (lineHeight));
    });

    ctx.restore();
  }


  move(x, y) {
    this.x = x;
    this.y = y;
  }

  getData() {
    return {
      id: this.id,
      text: this.text,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
    };
  }

  loadData(data) {
    this.id = data.id;
    this.text = String(data.text);
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.rotation = data.rotation;
    return this;
  }
}

export default BaseNode;
