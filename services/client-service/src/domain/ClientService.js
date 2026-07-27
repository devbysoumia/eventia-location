import Client from "./Client.js";

export default class ClientService {
  constructor(repository) {
    this.repository = repository;
  }

  getAll() {
    return this.repository.findAll();
  }

  getById(id) {
    return this.repository.findById(id);
  }

  create(data) {
    return this.repository.create(this.#validatedClient(data));
  }

  update(id, data) {
    return this.repository.update(id, this.#validatedClient(data));
  }

  delete(id) {
    return this.repository.delete(id);
  }

  #validatedClient(data) {
    const client = new Client(data);
    if (!client.isValid()) {
      throw new TypeError("Le nom, un courriel valide et le téléphone sont requis.");
    }
    return client;
  }
}
