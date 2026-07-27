export default class Equipment {
  constructor({ name, category, dailyPrice, availableQuantity } = {}) {
    this.name = typeof name === "string" ? name.trim() : "";
    this.category = typeof category === "string" ? category.trim() : "";
    this.dailyPrice = Number(dailyPrice);
    this.availableQuantity = Number(availableQuantity);
  }

  isValid() {
    return this.name.length > 0
      && this.category.length > 0
      && Number.isFinite(this.dailyPrice)
      && this.dailyPrice >= 0
      && Number.isInteger(this.availableQuantity)
      && this.availableQuantity >= 0;
  }
}
