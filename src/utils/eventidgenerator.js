export const generateEventId = (prefix = "event") => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
};