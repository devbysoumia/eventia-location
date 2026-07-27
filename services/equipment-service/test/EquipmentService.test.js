import test from "node:test";
import assert from "node:assert/strict";
import EquipmentService from "../src/domain/EquipmentService.js";

test("reserve soustrait une quantité disponible de façon atomique", async () => {
  const repository = {
    reserve: async (id, quantity) => ({ id, availableQuantity: 5 - quantity }),
    findById: async () => null
  };
  const result = await new EquipmentService(repository).reserve("equipment-1", { quantity: 2 });
  assert.equal(result.availableQuantity, 3);
});

test("reserve refuse une quantité insuffisante", async () => {
  const repository = {
    reserve: async () => null,
    findById: async () => ({ availableQuantity: 1 })
  };
  await assert.rejects(
    () => new EquipmentService(repository).reserve("equipment-1", { quantity: 2 }),
    (error) => error.status === 409
  );
});

test("release exige une quantité entière positive", async () => {
  const repository = { release: async () => ({}) };
  assert.throws(
    () => new EquipmentService(repository).release("equipment-1", { quantity: 0 }),
    TypeError
  );
});
