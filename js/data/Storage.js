class Storage {
  saveData(data) {
    localStorage.setItem('mindmap', JSON.stringify(data))
  }

  loadData() {
    const data = localStorage.getItem('mindmap')
    return data ? JSON.parse(data) : null
  }
}

export default Storage
