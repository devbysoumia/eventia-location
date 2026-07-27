export default class NotificationRepository {
  constructor(model) {
    this.model = model;
  }

  findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  create(notification) {
    return this.model.create(notification);
  }
}
