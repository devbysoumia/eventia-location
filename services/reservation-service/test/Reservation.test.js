import test from "node:test";
import assert from "node:assert/strict";
import Reservation from "../src/domain/Reservation.js";
import ReservationService from "../src/domain/ReservationService.js";

test("le prix inclut la date de début et la date de fin", () => {
  const reservation = new Reservation({
    clientId: "client-1",
    equipmentId: "equipment-1",
    quantity: 2,
    startDate: "2026-07-01",
    endDate: "2026-07-03"
  });
  assert.equal(reservation.numberOfDays(), 3);
  assert.equal(reservation.totalPrice(25), 150);
});

test("une date de fin antérieure est invalide", () => {
  const reservation = new Reservation({
    clientId: "client-1",
    equipmentId: "equipment-1",
    quantity: 1,
    startDate: "2026-07-03",
    endDate: "2026-07-01"
  });
  assert.equal(reservation.isValid(), false);
});

test("la création enrichit la réservation et appelle les services", async () => {
  const calls = [];
  const repository = {
    create: async (data) => ({ _id: "reservation-1", ...data })
  };
  const serviceClient = {
    getClient: async () => ({ name: "Soumia", email: "soumia@example.com" }),
    getEquipment: async () => ({ name: "Projecteur", dailyPrice: 50 }),
    reserveEquipment: async (id, quantity) => calls.push(["reserve", id, quantity]),
    releaseEquipment: async () => {},
    notify: async (data) => calls.push(["notify", data.type])
  };
  const result = await new ReservationService(repository, serviceClient).create({
    clientId: "client-1",
    equipmentId: "equipment-1",
    quantity: 2,
    startDate: "2026-07-01",
    endDate: "2026-07-02"
  });
  assert.equal(result.clientName, "Soumia");
  assert.equal(result.equipmentName, "Projecteur");
  assert.equal(result.totalPrice, 200);
  assert.deepEqual(calls, [
    ["reserve", "equipment-1", 2],
    ["notify", "RESERVATION_CONFIRMED"]
  ]);
});

test("l'annulation remet la quantité et envoie une notification", async () => {
  const calls = [];
  const existing = {
    _id: "reservation-1",
    equipmentId: "equipment-1",
    equipmentName: "Projecteur",
    clientEmail: "soumia@example.com",
    quantity: 2,
    status: "CONFIRMED"
  };
  const repository = {
    findById: async () => existing,
    cancel: async () => ({ ...existing, status: "CANCELLED" })
  };
  const serviceClient = {
    releaseEquipment: async (id, quantity) => calls.push(["release", id, quantity]),
    notify: async (data) => calls.push(["notify", data.type])
  };
  const result = await new ReservationService(repository, serviceClient).cancel("reservation-1");
  assert.equal(result.status, "CANCELLED");
  assert.deepEqual(calls, [
    ["release", "equipment-1", 2],
    ["notify", "RESERVATION_CANCELLED"]
  ]);
});

test("un échec de notification annule la création et remet l'inventaire", async () => {
  const calls = [];
  const repository = {
    create: async (data) => ({ _id: "reservation-1", ...data }),
    delete: async (id) => calls.push(["delete", id])
  };
  const serviceClient = {
    getClient: async () => ({ name: "Soumia", email: "soumia@example.com" }),
    getEquipment: async () => ({ name: "Projecteur", dailyPrice: 50 }),
    reserveEquipment: async () => {},
    releaseEquipment: async (id, quantity) => calls.push(["release", id, quantity]),
    notify: async () => {
      throw new Error("notification indisponible");
    }
  };
  await assert.rejects(() => new ReservationService(repository, serviceClient).create({
    clientId: "client-1",
    equipmentId: "equipment-1",
    quantity: 2,
    startDate: "2026-07-01",
    endDate: "2026-07-02"
  }));
  assert.deepEqual(calls, [
    ["delete", "reservation-1"],
    ["release", "equipment-1", 2]
  ]);
});
