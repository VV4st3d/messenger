export const copyText = (text: string, callback?: () => void) => {
  navigator.clipboard.writeText(text);
  callback?.();
};
