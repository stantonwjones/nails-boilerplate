import nails from "nails-boilerplate";
import service_config from '../config/service.js';
import { beforeAll, test, expect } from "vitest";

const TEST_USER_EMAIL = "test@test.com";
const TEST_USER_NAME = "JohnDoe";
beforeAll(async () => {
  await nails.MODELS.init( service_config );
});

test("Can create a User", async () => {
  const user = await nails.MODELS.User.create({name: TEST_USER_NAME, email: TEST_USER_EMAIL});

  expect(user.id).toBeDefined();
  const retrievedUser = await nails.MODELS.User.findByPk(user.id);
  expect(retrievedUser.id).toBeDefined();
  expect(retrievedUser.name).toEqual(TEST_USER_NAME);
  expect(retrievedUser.email).toEqual(TEST_USER_EMAIL);
});