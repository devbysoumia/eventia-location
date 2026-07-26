export default class Notification {
  constructor({ recipient, message, type = "GENERAL", createdAt = new Date() } = {}) {
    this.recipient = typeof recipient === "string" ? recipient.trim() : "";
    this.message = typeof message === "string" ? message.trim() : "";
    this.type = typeof type === "string" && type.trim()
      ? type.trim()
      : "GENERAL";
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  isValid() {
    return this.recipient.length > 0
      && this.message.length > 0
      && !Number.isNaN(this.createdAt.getTime());
  }
}
