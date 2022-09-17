export const getItem = (itemName: string): unknown | null => {
  const item = localStorage.getItem(itemName);
  return item ? JSON.parse(item) : null;
};

export const setItem = (itemName: string, value: unknown): void => {
  localStorage.setItem(itemName, JSON.stringify(value));
};

export const removeItem = (itemName: string): void => {
  localStorage.removeItem(itemName);
};
