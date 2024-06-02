import BaseNode from "./BaseNode.js";

class RectangleNode extends BaseNode {
  constructor(text, x, y) {
    super(text, x, y);
    this.type = 'rectangle';
  }

  loadData(data) {
    super.loadData(data);
    return this;
  }
}

export default RectangleNode;
