export default class EquipmentController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    res.status(200).json(await this.service.getAll());
  }

  async getById(req, res) {
    this.#sendEquipment(res, await this.service.getById(req.params.id));
  }

  async create(req, res) {
    res.status(201).json(await this.service.create(req.body));
  }

  async update(req, res) {
    this.#sendEquipment(res, await this.service.update(req.params.id, req.body));
  }

  async reserve(req, res) {
    this.#sendEquipment(res, await this.service.reserve(req.params.id, req.body));
  }

  async release(req, res) {
    this.#sendEquipment(res, await this.service.release(req.params.id, req.body));
  }

  async delete(req, res) {
    const equipment = await this.service.delete(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Équipement introuvable." });
    res.status(204).end();
  }

  #sendEquipment(res, equipment) {
    if (!equipment) return res.status(404).json({ message: "Équipement introuvable." });
    return res.status(200).json(equipment);
  }
}
