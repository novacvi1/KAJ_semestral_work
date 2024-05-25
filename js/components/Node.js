class Node {
  constructor(text = 'New Node', x = 0, y = 0) {
    this.id = Date.now();
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = 150;
    this.height = 80;
    this.rotation = 0;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  rotate(angle) {
    this.rotation = angle;
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
    this.text = data.text;
    this.x = data.x;
    this.y = data.y;
    this.width = data.width;
    this.height = data.height;
    this.rotation = data.rotation;
    return this;
  }
}

export default Node;
