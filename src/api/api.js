class Api {
  controller;

  fetchCells = async (url, radius, payload = []) => {
    this.controller && this.controller.abort();
    this.controller = new AbortController();

    try {
      const response = await fetch(`${url}${radius}`, {
        method: "POST",
        body: JSON.stringify(payload),
        signal: this.controller.signal,
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
}

const api = new Api();

export default api;
