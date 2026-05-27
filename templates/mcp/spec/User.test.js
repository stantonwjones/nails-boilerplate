import Nails from "@projectinvicta/nails";
import User from "#models/User";
import service_config from '#config/service.js';
import { beforeAll, test, expect } from "vitest";

const TEST_USER_EMAIL = "test@test.com";
const TEST_USER_NAME = "JohnDoe";
beforeAll(async () => {
  // Only initialize the Models.
  await new Nails(service_config).configure();
  // await nails.MODELS.init( service_config );
});

test("Can create a User", async () => {
  const user = await User.create({name: TEST_USER_NAME, email: TEST_USER_EMAIL});

  expect(user.id).toBeDefined();
  const retrievedUser = await User.findByPk(user.id);
  expect(retrievedUser.id).toBeDefined();
  expect(retrievedUser.name).toEqual(TEST_USER_NAME);
  expect(retrievedUser.email).toEqual(TEST_USER_EMAIL);
});