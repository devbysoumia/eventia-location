import axios from "axios";

export default class ServiceClient {
  constructor({
    clientServiceUrl = "http://localhost:4001",
    equipmentServiceUrl = "http://localhost:4002",
    notificationServiceUrl = "http://localhost:4004"
  } = {}) {
    this.clientApi = axios.create({ baseURL: clientServiceUrl, timeout: 5000 });
    this.equipmentApi = axios.create({ baseURL: equipmentServiceUrl, timeout: 5000 });
    this.notificationApi = axios.create({ baseURL: notificationServiceUrl, timeout: 5000 });
  }

  async getClient(id) {
    return (await this.clientApi.get(`/api/clients/${id}`)).data;
  }

  async getEquipment(id) {
    return (await this.equipmentApi.get(`/api/equipments/${id}`)).data;
  }

  async reserveEquipment(id, quantity) {
    return (await this.equipmentApi.put(`/api/equipments/${id}/reserve`, { quantity })).data;
  }

  async releaseEquipment(id, quantity) {
    return (await this.equipmentApi.put(`/api/equipments/${id}/release`, { quantity })).data;
  }

  async notify(notification) {
    return (await this.notificationApi.post("/api/notifications", notification)).data;
  }
}
