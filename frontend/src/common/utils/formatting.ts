export const removeLineBreaks = (text: string) => {
  return text.replace(/^\s*[\r\n]+|[\r\n]+\s*$/g, "");
};
