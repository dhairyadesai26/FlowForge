import "@testing-library/jest-dom";

if (!URL.createObjectURL) {
  URL.createObjectURL = (blob) => `blob:mock-${blob?.size ?? 0}`;
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => {};
}
