// ============================================================
// 003. 整数转罗马数字
// ============================================================
// LeetCode 12. Integer to Roman
// 将整数转换为罗马数字。使用值-符号映射表，从大到小贪心。
// 时间复杂度：O(1)，空间复杂度：O(1)

function intToRoman(num: number): string {
  const valueSymbols: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of valueSymbols) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
    if (num === 0) break;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 整数转罗马数字 =====");
console.log("测试1:", intToRoman(3)); // 预期: "III"
console.log("测试2:", intToRoman(58)); // 预期: "LVIII"
console.log("测试3:", intToRoman(1994)); // 预期: "MCMXCIV"
console.log("测试4:", intToRoman(3749)); // 预期: "MMMDCCXLIX"

export {};
