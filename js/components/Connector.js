class Connector {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
    this.color = '#000';
    this.width = 2;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.node1.x + this.node1.width / 2, this.node1.y + this.node1.height / 2);
    ctx.lineTo(this.node2.x + this.node2.width / 2, this.node2.y + this.node2.height / 2);
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
