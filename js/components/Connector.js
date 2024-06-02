class Connector {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
    this.color = '#000';
    this.width = 2;
  }

  render(ctx) {
    let dy = this.node2.y - this.node1.y;
    let dx = this.node2.x - this.node1.x;
    let t = Math.atan2(dy, dx);

    let x1, y1, x2, y2;
    if (this.node1.type === 'oval') {
      x1 = this.node1.x + this.node1.radiusX * Math.cos(t);
      y1 = this.node1.y + this.node1.radiusY * Math.sin(t);
    } else {
      x1 = this.node1.x + (this.node1.width / 2);
      y1 = this.node1.y + (this.node1.height / 2);
    }

    if (this.node2.type === 'oval') {
      x2 = this.node2.x + this.node2.radiusX * Math.cos(t + Math.PI);
      y2 = this.node2.y + this.node2.radiusY * Math.sin(t + Math.PI);
    } else {
      x2 = this.node2.x + (this.node2.width / 2);
      y2 = this.node2.y + (this.node2.height / 2);
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.stroke();
  }

  getData() {
    return {
      node1Id: this.node1.id,
      node2Id: this.node2.id,
      color: this.color,
      width: this.width,
    };
  }

  loadData(data, nodeMap) {
    this.node1 = nodeMap[data.node1Id];
    this.node2 = nodeMap[data.node2Id];
    this.color = data.color;
    this.width = data.width;
    return this;
  }
}

export default Connector;
