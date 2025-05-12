export const makeSlug = (text: string) => {
  const array = text.toLowerCase().split(" ");
  return array.join("-");
}