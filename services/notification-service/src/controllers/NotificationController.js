export default class NotificationController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    res.status(200).json(await this.service.getAll());
  }

  async create(req, res) {
    const notification = await this.service.create(req.body);
    res.status(201).json(notification);
  }
}
