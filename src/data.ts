export const productColors = [
  { name: "أحمر", hex: "#FF0000" },
  { name: "أخضر", hex: "#008000" },
  { name: "أزرق", hex: "#0000FF" },
  { name: "أسود", hex: "#000000" },
  { name: "أبيض", hex: "#FFFFFF" },
  { name: "أصفر", hex: "#FFFF00" },
  { name: "وردي", hex: "#FFC0CB" },
  { name: "أرجواني", hex: "#800080" },
  { name: "برتقالي", hex: "#FFA500" },
  { name: "بني", hex: "#A52A2A" },
  { name: "رمادي", hex: "#808080" },
  { name: "بيج", hex: "#F5F5DC" },
];

export const productSizes = [
  { name: "Medium", value: "M" },
  { name: "Large", value: "L" },
  { name: "XLarge", value: "XL" },
  { name: "2XLarge", value: "2XL" },
  { name: "3XLarge", value: "3XL" },
  { name: "4XLarge", value: "4XL" },
  { name: "5XLarge", value: "5XL" },
];

export const getColorName = (hexCode: string) => {
  const color = productColors.find(
    (item) => item.hex.toLowerCase() === hexCode.toLowerCase()
  );
  return color ? color.name : "لون غير معروف";
};
