import Reservation from "./Reservation.js";

export default class ReservationService {
  constructor(repository, serviceClient) {
    this.repository = repository;
    this.serviceClient = serviceClient;
  }

  getAll() {
    return this.repository.findAll();
  }

  async create(data) {
    const request = new Reservation(data);
    if (!request.isValid()) {
      throw new TypeError("Le client, l'équipement, une quantité entière d'au moins 1 et des dates valides sont requis; la date de fin ne peut pas précéder la date de début.");
    }

    const client = await this.#externalCall(
      () => this.serviceClient.getClient(request.clientId),
      "Client introuvable."
    );
    const equipment = await this.#externalCall(
      () => this.serviceClient.getEquipment(request.equipmentId),
      "Équipement introuvable."
    );
    await this.#externalCall(
      () => this.serviceClient.reserveEquipment(request.equipmentId, request.quantity),
      "Impossible de réserver la quantité demandée."
    );

    let reservation;
    try {
      reservation = await this.repository.create({
        clientId: request.clientId,
        clientName: client.name,
        clientEmail: client.email,
        equipmentId: request.equipmentId,
        equipmentName: equipment.name,
        quantity: request.quantity,
        startDate: request.startDate,
        endDate: request.endDate,
        dailyPrice: equipment.dailyPrice,
        totalPrice: request.totalPrice(equipment.dailyPrice),
        status: "CONFIRMED"
      });
    } catch (error) {
      await this.serviceClient.releaseEquipment(request.equipmentId, request.quantity).catch(() => {});
      throw error;
    }

    try {
      await this.serviceClient.notify({
        recipient: client.email,
        message: `Réservation confirmée pour ${request.quantity} × ${equipment.name}.`,
        type: "RESERVATION_CONFIRMED"
      });
    } catch (error) {
      await this.repository.delete(reservation._id).catch(() => {});
      await this.serviceClient.releaseEquipment(request.equipmentId, request.quantity).catch(() => {});
      throw error;
    }
    return reservation;
  }

  async cancel(id) {
    const existing = await this.repository.findById(id);
    if (!existing) return null;
    if (existing.status === "CANCELLED") return existing;

    await this.#externalCall(
      () => this.serviceClient.releaseEquipment(existing.equipmentId, existing.quantity),
      "Impossible de remettre l'équipement dans l'inventaire."
    );
    const reservation = await this.repository.cancel(id);
    if (!reservation) {
      const error = new Error("La réservation a déjà été annulée.");
      error.status = 409;
      throw error;
    }
    await this.serviceClient.notify({
      recipient: reservation.clientEmail,
      message: `Réservation annulée pour ${reservation.quantity} × ${reservation.equipmentName}.`,
      type: "RESERVATION_CANCELLED"
    });
    return reservation;
  }

  async #externalCall(operation, fallbackMessage) {
    try {
      return await operation();
    } catch (cause) {
      const error = new Error(cause.response?.data?.message || fallbackMessage);
      error.status = cause.response?.status === 404 ? 404 : 409;
      throw error;
    }
  }
}
