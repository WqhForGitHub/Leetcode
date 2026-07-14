// ============================================================
// 033. 统计各位数字都不同的数字个数
// ============================================================
// LeetCode 357. Count Numbers with Unique Digits
// 给定n，统计[0, 10^n)中各位数字都不同的数字个数。
// 时间复杂度：O(10^n), 空间复杂度：O(n)

// 方法1：回溯 (推荐)
// 回溯生成所有位数（1到n位）的各位数字不同的数
// 时间复杂度 O(10^n), 空间复杂度 O(n)
function countNumbersWithUniqueDigits(n: number): number {
  if (n === 0) return 1;

  let count: number = 1; // 数字0总是满足条件

  // pos: 当前位置（从0开始）
  // used: 已使用的数字集合
  // maxLen: 当前要生成的数字位数
  function backtrack(pos: number, used: Set<number>, maxLen: number): void {
    if (pos === maxLen) return;

    for (let d: number = 0; d <= 9; d++) {
      // 第一位不能为0（避免前导零）
      if (pos === 0 && d === 0) continue;
      if (used.has(d)) continue;

      count++;
      used.add(d);
      backtrack(pos + 1, used, maxLen);
      used.delete(d);
    }
  }

  // 分别生成1位、2位...n位的各位数字不同的数
  for (let len: number = 1; len <= n; len++) {
    backtrack(0, new Set<number>(), len);
  }

  return count;
}

// 方法2：数学排列公式
// n=0: 1个（数字0）
// n=1: 10个（0-9）
// n=2: 91个（10 + 9*9）
// n=k: 10 + 9*9 + 9*8*...*(10-k+1)
// 时间复杂度 O(n), 空间复杂度 O(1)
function countNumbersWithUniqueDigits2(n: number): number {
  if (n === 0) return 1;

  let count: number = 10; // n=1时，0-9共10个
  let uniqueDigits: number = 9; // 第一位有9种选择（1-9）
  let available: number = 9; // 第二位有9种选择（0-9减去第一位）

  for (let i: number = 2; i <= n && available > 0; i++) {
    uniqueDigits *= available;
    count += uniqueDigits;
    available--;
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 统计各位数字都不同的数字个数 =====");
console.log(countNumbersWithUniqueDigits(2)); // 期望结果: 91
console.log(countNumbersWithUniqueDigits(0)); // 期望结果: 1
console.log(countNumbersWithUniqueDigits(1)); // 期望结果: 10
console.log(countNumbersWithUniqueDigits2(2)); // 期望结果: 91
console.log(countNumbersWithUniqueDigits2(0)); // 期望结果: 1
console.log(countNumbersWithUniqueDigits2(3)); // 期望结果: 739

export {};
