// ============================================================
// 062. 易混淆数 II
// ============================================================
// LeetCode 1088. Confusing Number II
// 易混淆数：将数字旋转 180 度后得到一个与原数不同的合法数字。
// 有效映射：0->0, 1->1, 6->9, 8->8, 9->6。统计 [1, N] 中易混淆数的个数。
// 时间复杂度：O(5^L), 空间复杂度：O(L)，L 为数字位数

// 方法1：回溯 (构建数字) (推荐)
// 用回溯枚举所有仅由 {0,1,6,8,9} 构成的不超过 N 的数字
// 对每个数字判断旋转后是否与原数不同
// 时间复杂度 O(5^L), 空间复杂度 O(L)
function confusingNumberII(n: number): number {
  const valid: Map<number, number> = new Map([
    [0, 0],
    [1, 1],
    [6, 9],
    [8, 8],
    [9, 6],
  ]);
  const digits: number[] = [0, 1, 6, 8, 9];
  let count = 0;

  // 判断一个数字是否为易混淆数
  const isConfusing = (num: number): boolean => {
    const original = num;
    let rotated = 0;
    while (num > 0) {
      const d = num % 10;
      rotated = rotated * 10 + (valid.get(d) as number);
      num = Math.floor(num / 10);
    }
    return rotated !== original;
  };

  // 回溯构建数字
  const backtrack = (cur: number): void => {
    if (cur > n) return;
    if (cur > 0 && isConfusing(cur)) count++;
    // 注意：不能继续以 0 开头扩展，但 cur=0 时只作为中间状态
    for (const d of digits) {
      const next = cur * 10 + d;
      if (next === 0) continue; // 跳过前导 0
      if (next > n) continue;
      backtrack(next);
    }
  };

  backtrack(0);
  return count;
}

// 方法2：回溯 + 剪枝
// 在回溯中同时构造旋转后的数字，避免重复计算
// 时间复杂度 O(5^L), 空间复杂度 O(L)
function confusingNumberII2(n: number): number {
  const pairs: [number, number][] = [
    [0, 0],
    [1, 1],
    [6, 9],
    [8, 8],
    [9, 6],
  ];
  let count = 0;

  // digits: 当前数字位（高位在前），rotated: 对应的旋转结果（按位累积）
  // 这里通过维护数字位数组与长度，避免大数计算
  const backtrack = (digitsArr: number[], rotatedArr: number[]): void => {
    // 当前数字值
    let value = 0;
    for (const d of digitsArr) value = value * 10 + d;
    if (value > n) return;
    if (value > 0) {
      // 计算旋转值：rotatedArr 是从原数低位到高位的旋转结果
      // 旋转后整体应当倒序读
      let rotated = 0;
      for (let i = 0; i < rotatedArr.length; i++) {
        rotated = rotated * 10 + rotatedArr[i];
      }
      if (rotated !== value) count++;
    }
    for (const [d, r] of pairs) {
      if (digitsArr.length === 0 && d === 0) continue; // 跳过前导 0
      const nextDigits = digitsArr.concat(d);
      // 新字符的旋转应当放在 rotatedArr 前面（低位在前）
      const nextRotated = [r].concat(rotatedArr);
      // 剪枝：若已超过 n 则不再继续
      let v = 0;
      for (const x of nextDigits) v = v * 10 + x;
      if (v > n) continue;
      backtrack(nextDigits, nextRotated);
    }
  };

  backtrack([], []);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 062. 易混淆数 II =====");
console.log(confusingNumberII(20)); // 期望结果: 6
console.log(confusingNumberII(100)); // 期望结果: 19
console.log(confusingNumberII2(20)); // 期望结果: 6
console.log(confusingNumberII2(100)); // 期望结果: 19

export {};
