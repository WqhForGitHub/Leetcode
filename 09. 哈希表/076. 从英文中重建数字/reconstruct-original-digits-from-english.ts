// ============================================================
// 076. 从英文中重建数字
// ============================================================
// LeetCode 423. Reconstruct Original Digits from English
// 从打乱的英文字母还原出原始数字字符串（升序排列）
// 思路：哈希表统计字母频次，按特征字母顺序依次确定各数字个数
//   zero(z), two(w), four(u), six(x), eight(g),
//   one(o 减去 0/2/4), three(t 减去 2/8),
//   five(f 减去 4), seven(s 减去 6), nine(i 减去 5/6/8)
// 时间复杂度：O(n)，空间复杂度：O(1)

function originalDigits(s: string): string {
  // 统计每个字母出现次数
  const count: Record<string, number> = {};
  for (const c of s) {
    count[c] = (count[c] || 0) + 1;
  }

  const num: number[] = new Array(10).fill(0);
  // 按特征字母顺序判断
  num[0] = count["z"] || 0; // zero
  num[2] = count["w"] || 0; // two
  num[4] = count["u"] || 0; // four
  num[6] = count["x"] || 0; // six
  num[8] = count["g"] || 0; // eight
  num[1] = (count["o"] || 0) - num[0] - num[2] - num[4]; // one
  num[3] = (count["t"] || 0) - num[2] - num[8]; // three
  num[5] = (count["f"] || 0) - num[4]; // five
  num[7] = (count["s"] || 0) - num[6]; // seven
  num[9] = (count["i"] || 0) - num[5] - num[6] - num[8]; // nine

  // 拼接结果（升序）
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += String(i).repeat(num[i]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 从英文中重建数字 =====");
console.log(originalDigits("owoztneoer")); // 期望输出: "012"
console.log(originalDigits("fviefuro")); // 期望输出: "45"
console.log(originalDigits("nnei")); // 期望输出: "9"

export {};
