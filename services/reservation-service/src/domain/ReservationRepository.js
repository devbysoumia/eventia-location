export default class ReservationRepository {
  constructor(model) {
    this.model = model;
  }

  findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(reservation) {
    return this.model.create(reservation);
  }

  delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  cancel(id) {
    return this.model.findOneAndUpdate(
      { _id: id, status: "CONFIRMED" },
      { status: "CANCELLED" },
      { new: true, runValidators: true }
    );
  }
}
