// ============================================================
// 06. 加一
// ============================================================
// LeetCode 66. Plus One
// 给定非负整数数组表示的大整数，加一后返回。
// 时间复杂度：O(n)，空间复杂度：O(1)（不含返回结果）

// 方法1：从末尾遍历进位（推荐）
function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      // 当前位小于 9，加 1 后无进位，直接返回
      digits[i]++;
      return digits;
    }
    // 当前位为 9，置 0 并继续向高位进位
    digits[i] = 0;
  }
  // 所有位都进位（如 999 -> 1000），需要在最高位补 1
  return [1, ...digits];
}

// 方法2：转换为数字计算（仅适用于不溢出的情况）
// 注意：当数字过大时（如超过 Number.MAX_SAFE_INTEGER）会丢失精度，故不推荐
function plusOneByNumber(digits: number[]): number[] {
  // 将数组转为数字，加 1 后再转回数组
  let num = 0;
  for (const d of digits) {
    num = num * 10 + d;
  }
  num++;
  return num
    .toString()
    .split("")
    .map((ch) => parseInt(ch, 10));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 06. 加一 =====");
console.log("进位法 [1,2,3]:", plusOne([1, 2, 3])); // 期望结果 [1,2,4]
console.log("进位法 [4,3,2,1]:", plusOne([4, 3, 2, 1])); // 期望结果 [4,3,2,2]
console.log("进位法 [9]:", plusOne([9])); // 期望结果 [1,0]
console.log("进位法 [9,9,9]:", plusOne([9, 9, 9])); // 期望结果 [1,0,0,0]
console.log("进位法 [0]:", plusOne([0])); // 期望结果 [1]
console.log("数字法 [1,2,3]:", plusOneByNumber([1, 2, 3])); // 期望结果 [1,2,4]
console.log("数字法 [9,9]:", plusOneByNumber([9, 9])); // 期望结果 [1,0,0]

export {};
