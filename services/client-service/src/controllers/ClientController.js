export default class ClientController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    res.status(200).json(await this.service.getAll());
  }

  async getById(req, res) {
    const client = await this.service.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client introuvable." });
    }
    res.status(200).json(client);
  }

  async create(req, res) {
    const client = await this.service.create(req.body);
    res.status(201).json(client);
  }

  async update(req, res) {
    const client = await this.service.update(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ message: "Client introuvable." });
    }
    res.status(200).json(client);
  }

  async delete(req, res) {
    const client = await this.service.delete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client introuvable." });
    }
    res.status(204).end();
  }
}
