import Notification from "./Notification.js";

export default class NotificationService {
  constructor(repository) {
    this.repository = repository;
  }

  getAll() {
    return this.repository.findAll();
  }

  create(data) {
    const notification = new Notification(data);
    if (!notification.isValid()) {
      throw new TypeError("Le destinataire et le message sont requis.");
    }
    return this.repository.create(notification);
  }
}
