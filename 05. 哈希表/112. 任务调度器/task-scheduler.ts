// ============================================================
// 112. 任务调度器
// ============================================================
// LeetCode 621. Task Scheduler
// 给定字符数组 tasks 表示 CPU 任务，相同任务之间至少需间隔 n 个冷却时间。
// 计算完成所有任务所需的最少时间片数。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 思路：哈希表计数 + 贪心
// 出现次数最多的任务决定框架长度：(maxFreq - 1) * (n + 1) + maxCount
// 最终结果取 max(任务总数, 框架长度)
function leastInterval(tasks: string[], n: number): number {
  const count = new Map<string, number>();
  for (const t of tasks) {
    count.set(t, (count.get(t) || 0) + 1);
  }

  // 最大出现次数
  let maxFreq = 0;
  for (const c of count.values()) {
    maxFreq = Math.max(maxFreq, c);
  }

  // 出现最大次数的任务种类数
  let maxCount = 0;
  for (const c of count.values()) {
    if (c === maxFreq) maxCount++;
  }

  const frame = (maxFreq - 1) * (n + 1) + maxCount;
  return Math.max(tasks.length, frame);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 112. 任务调度器 =====");
// 测试 1
console.log(leastInterval(["A", "A", "A", "B", "B", "B"], 2)); // 期望: 8
// 测试 2
console.log(leastInterval(["A", "A", "A", "B", "B", "B"], 0)); // 期望: 6
// 测试 3
console.log(
  leastInterval(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2),
); // 期望: 16

export {};
