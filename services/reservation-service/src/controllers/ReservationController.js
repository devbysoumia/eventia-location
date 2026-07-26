export default class ReservationController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    res.status(200).json(await this.service.getAll());
  }

  async create(req, res) {
    res.status(201).json(await this.service.create(req.body));
  }

  async cancel(req, res) {
    const reservation = await this.service.cancel(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable." });
    res.status(200).json(reservation);
  }
}
