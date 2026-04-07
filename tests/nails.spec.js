// TODO test all initialization here
import { describe, beforeAll, it, test, expect, vi } from 'vitest';
import Dog from './services/integration/server/models/dog.js';
import Owner from './services/integration/server/models/owner.js';

let nails;

beforeAll(async () => {
    nails = (await import('./services/integration/server.js')).default;
});

test("finalize is called during model initialization", async () => {
    const owner = await Owner.create({});
    const dog = await owner.createDog({name: "Fido"});
    const dogOwner = await dog.getOwner();
    expect(dogOwner).toBeDefined();
    expect(dogOwner.id).toEqual(owner.id);
})