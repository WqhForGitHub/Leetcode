// ============================================================
// 064. 步进数
// ============================================================
// LeetCode 1215. Stepping Numbers
// 步进数：相邻位数字差为 1。返回 [low, high] 范围内所有步进数（升序）。
// 时间复杂度：O(2^L * L), 空间复杂度：O(2^L)，L 为位数

// 方法1：回溯 (BFS 逐位构建) (推荐)
// 从 1-9 出发，每次在末尾追加一个与前一位相差 1 的数字
// 单独处理 0
// 时间复杂度 O(2^L * L), 空间复杂度 O(2^L)
function countSteppingNumbers(low: number, high: number): number[] {
  const result: number[] = [];
  // 0 是步进数
  if (low <= 0 && 0 <= high) result.push(0);

  // BFS 队列
  const queue: number[] = [];
  for (let i = 1; i <= 9; i++) queue.push(i);

  while (queue.length) {
    const num = queue.shift()!;
    if (num > high) continue;
    if (num >= low) result.push(num);
    // 取最后一位
    const lastDigit = num % 10;
    // 追加 lastDigit-1 和 lastDigit+1 (若在 0-9 范围内)
    if (lastDigit > 0) {
      const next1 = num * 10 + (lastDigit - 1);
      if (next1 <= high) queue.push(next1);
    }
    if (lastDigit < 9) {
      const next2 = num * 10 + (lastDigit + 1);
      if (next2 <= high) queue.push(next2);
    }
  }

  return result.sort((a, b) => a - b);
}

// 方法2：枚举 + 验证
// 对范围内每个数判断是否为步进数（适合范围较小情况）
// 时间复杂度 O((high-low) * L), 空间复杂度 O(1)
function countSteppingNumbers2(low: number, high: number): number[] {
  const isStepping = (n: number): boolean => {
    if (n < 10) return true;
    let prev = n % 10;
    n = Math.floor(n / 10);
    while (n > 0) {
      const cur = n % 10;
      if (Math.abs(cur - prev) !== 1) return false;
      prev = cur;
      n = Math.floor(n / 10);
    }
    return true;
  };

  const result: number[] = [];
  for (let i = low; i <= high; i++) {
    if (isStepping(i)) result.push(i);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 步进数 =====");
console.log(countSteppingNumbers(0, 21)); // 期望结果: [0,1,2,3,4,5,6,7,8,9,10,12,21]
console.log(countSteppingNumbers2(0, 21)); // 期望结果: [0,1,2,3,4,5,6,7,8,9,10,12,21]

export {};
