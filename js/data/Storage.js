class Storage {
  saveData(state) {
    const stateJson = JSON.stringify(state);
    localStorage.setItem('canvasState', stateJson);
    //localStorage.setItem('mindmap', JSON.stringify(data))
    console.log('saveData', state);
  }

  loadData() {
    const stateJson = localStorage.getItem('canvasState');
    console.log('loadData', stateJson);
    if (stateJson && stateJson.length > 0 && stateJson !== 'undefined') {
      return JSON.parse(stateJson);
    }
    return null;
  }
}

export default Storage
