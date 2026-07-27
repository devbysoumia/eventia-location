export default class EquipmentRepository {
  constructor(model) {
    this.model = model;
  }

  findAll() {
    return this.model.find().sort({ name: 1 });
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(equipment) {
    return this.model.create(equipment);
  }

  update(id, equipment) {
    return this.model.findByIdAndUpdate(id, equipment, { new: true, runValidators: true });
  }

  reserve(id, quantity) {
    return this.model.findOneAndUpdate(
      { _id: id, availableQuantity: { $gte: quantity } },
      { $inc: { availableQuantity: -quantity } },
      { new: true, runValidators: true }
    );
  }

  release(id, quantity) {
    return this.model.findByIdAndUpdate(
      id,
      { $inc: { availableQuantity: quantity } },
      { new: true, runValidators: true }
    );
  }

  delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}
