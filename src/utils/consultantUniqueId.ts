export const generateUniqueId = (id: string) => {
  return `CONS${String(id).padStart(5, "0")}`;
};
