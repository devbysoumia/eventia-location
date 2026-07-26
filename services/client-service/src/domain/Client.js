export default class Client {
  constructor({ name, email, phone } = {}) {
    this.name = typeof name === "string" ? name.trim() : "";
    this.email = typeof email === "string" ? email.trim().toLowerCase() : "";
    this.phone = typeof phone === "string" ? phone.trim() : "";
  }

  isValid() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.name.length > 0
      && emailPattern.test(this.email)
      && this.phone.length > 0;
  }
}
