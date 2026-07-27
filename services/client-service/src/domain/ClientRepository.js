export default class ClientRepository {
  constructor(model) {
    this.model = model;
  }

  findAll() {
    return this.model.find().sort({ name: 1 });
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(client) {
    return this.model.create(client);
  }

  update(id, client) {
    return this.model.findByIdAndUpdate(id, client, {
      new: true,
      runValidators: true
    });
  }

  delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}
