### Key decisions

- `name` vs `toneName` — `createTone(fn, { name })` stores it as `.toneName` to avoid clashing with the built-in `Function.name` property.
- `toneName` vs tone key — If `.toneName` is provided, it overrides the map key in both runtime and type inference; otherwise, the map key is used.
- Base overrides color data — In base entries, properties returned by base overwrite fields in `ColorData`.
- Immutable output — `createPalette` returns a new object, so the input isn’t mutated.

#### Not implemented (by choice)

- Collision detection for duplicate generated keys.
- Support for arbitrary input models (currently locked to `InputModel`).
- Deep merge for nested base returns (shallow merge only).

#### Testing

Run tests once: `npm test`
Run tests in watch mode: `npm run test:watch`
