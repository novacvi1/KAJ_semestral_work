class Storage {
  saveData(state) {
    const stateJson = JSON.stringify(state);
    localStorage.setItem('canvasState', stateJson);
  }

  loadData() {
    const stateJson = localStorage.getItem('canvasState');
    if (stateJson && stateJson.length > 0 && stateJson !== 'undefined') {
      return JSON.parse(stateJson);
    }
    return null;
  }
}

export default Storage;
