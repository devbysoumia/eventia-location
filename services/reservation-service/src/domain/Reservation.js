const DAY_IN_MS = 24 * 60 * 60 * 1000;

export default class Reservation {
  constructor({ clientId, equipmentId, quantity, startDate, endDate } = {}) {
    this.clientId = clientId;
    this.equipmentId = equipmentId;
    this.quantity = Number(quantity);
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  isValid() {
    return Boolean(this.clientId)
      && Boolean(this.equipmentId)
      && Number.isInteger(this.quantity)
      && this.quantity >= 1
      && !Number.isNaN(this.startDate.getTime())
      && !Number.isNaN(this.endDate.getTime())
      && this.endDate >= this.startDate;
  }

  numberOfDays() {
    const start = Date.UTC(
      this.startDate.getUTCFullYear(),
      this.startDate.getUTCMonth(),
      this.startDate.getUTCDate()
    );
    const end = Date.UTC(
      this.endDate.getUTCFullYear(),
      this.endDate.getUTCMonth(),
      this.endDate.getUTCDate()
    );
    return Math.floor((end - start) / DAY_IN_MS) + 1;
  }

  totalPrice(dailyPrice) {
    return this.numberOfDays() * this.quantity * Number(dailyPrice);
  }
}
