import Equipment from "./Equipment.js";

export default class EquipmentService {
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
    return this.repository.create(this.#validatedEquipment(data));
  }

  update(id, data) {
    return this.repository.update(id, this.#validatedEquipment(data));
  }

  delete(id) {
    return this.repository.delete(id);
  }

  async reserve(id, data) {
    const quantity = this.#validatedQuantity(data?.quantity);
    const equipment = await this.repository.reserve(id, quantity);
    if (equipment) return equipment;
    const exists = await this.repository.findById(id);
    if (!exists) return null;
    const error = new Error("Quantité disponible insuffisante.");
    error.status = 409;
    throw error;
  }

  release(id, data) {
    return this.repository.release(id, this.#validatedQuantity(data?.quantity));
  }

  #validatedEquipment(data) {
    const equipment = new Equipment(data);
    if (!equipment.isValid()) {
      throw new TypeError("Le nom, la catégorie, un prix positif ou nul et une quantité entière positive ou nulle sont requis.");
    }
    return equipment;
  }

  #validatedQuantity(value) {
    const quantity = Number(value);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new TypeError("La quantité doit être un entier supérieur ou égal à 1.");
    }
    return quantity;
  }
}
