import "@testing-library/jest-dom";

// Provide URL.createObjectURL in jsdom (not available by default)
if (!URL.createObjectURL) {
  URL.createObjectURL = (blob) => `blob:mock-${blob?.size ?? 0}`;
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => {};
}
