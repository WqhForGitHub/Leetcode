// ============================================================
// 013. 最大数
// ============================================================
// LeetCode 179. Largest Number
// 给定一组非负整数 nums，重新排列每个数的顺序（拼接）使之组成最大的数字，返回字符串。

// 方法1：自定义比较器排序（O(n log n * k) 时间，O(k) 额外空间）
// 比较两个字符串拼接 a+b 和 b+a，谁大就排前面。
function largestNumber(nums: number[]): string {
  const strs = nums.map((n) => n.toString());
  strs.sort((a, b) => {
    const order1 = a + b;
    const order2 = b + a;
    // 降序：拼接结果大的排前面
    if (order2 > order1) return 1;
    if (order2 < order1) return -1;
    return 0;
  });

  // 处理前导 0（如 [0,0] -> "0"）
  if (strs.length > 0 && strs[0] === "0") return "0";

  return strs.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 最大数 =====");
console.log("[10,2]:", largestNumber([10, 2])); // "210"
console.log("[3,30,34,5,9]:", largestNumber([3, 30, 34, 5, 9])); // "9534330"
console.log("[0,0]:", largestNumber([0, 0])); // "0"
console.log("[1]:", largestNumber([1])); // "1"

export {};
