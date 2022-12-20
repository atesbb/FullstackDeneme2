export const toSentenceCase = (str: string) => {
  const lower = str.toLowerCase().replace(/_/g, ' ');
  return str.charAt(0).toUpperCase() + lower.slice(1);
};
