// ============================================================
// 091. 安排工作以达到最大收益
// ============================================================
// LeetCode 826. Most Profit Assigning Work
// 有 n 个工作，difficulty[i] 与 profit[i] 一一对应；有 m 个工人，能力为 worker[j]。
// 工人 j 可做任意 difficulty <= worker[j] 的工作，每个工人至多做一项，工作可重复。
// 求所有工人能获得的最大利润总和。

// 方法1：按难度排序 + 工人排序 + 最大利润追踪（推荐，O(n log n + m log m) 时间）
// 将工作按难度升序排序；工人按能力升序排序。
// 用双指针：随着工人能力递增，把所有难度 <= 能力的工作纳入考虑，
// 维护“已纳入工作利润的最大值”，每位工人贡献该最大值。
interface Job826 {
  d: number;
  p: number;
}

function maxProfitAssignment(difficulty: number[], profit: number[], worker: number[]): number {
  const n = difficulty.length;
  const jobs: Job826[] = difficulty.map((d, i) => ({ d, p: profit[i] }));
  jobs.sort((a, b) => a.d - b.d);
  worker.sort((a, b) => a - b);

  let total = 0;
  let best = 0;
  let i = 0;
  for (const w of worker) {
    while (i < n && jobs[i].d <= w) {
      if (jobs[i].p > best) best = jobs[i].p;
      i++;
    }
    total += best;
  }
  return total;
}

// 方法2：按难度排序 + 预处理最大利润 + 二分查找（O((n+m) log n) 时间）
// 预处理每个难度位置对应的最大利润前缀，对每个工人二分找到能力上限位置，
// 取该位置的最大利润。
function maxProfitAssignmentBinary(difficulty: number[], profit: number[], worker: number[]): number {
  const n = difficulty.length;
  const jobs: Job826[] = difficulty.map((d, i) => ({ d, p: profit[i] }));
  jobs.sort((a, b) => a.d - b.d);
  // 难度数组与对应的最大利润前缀
  const diffs: number[] = jobs.map((j) => j.d);
  const maxProfit: number[] = new Array(n);
  let best = 0;
  for (let i = 0; i < n; i++) {
    if (jobs[i].p > best) best = jobs[i].p;
    maxProfit[i] = best;
  }

  let total = 0;
  for (const w of worker) {
    // 二分找最后一个 diffs[idx] <= w 的位置
    let lo = 0;
    let hi = n - 1;
    let pos = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (diffs[mid] <= w) {
        pos = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (pos >= 0) total += maxProfit[pos];
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 安排工作以达到最大收益 =====");
console.log("双指针 [2,4,6,8,10]/[10,20,30,40,50]/[4,5,6,7]:",
  maxProfitAssignment([2, 4, 6, 8, 10], [10, 20, 30, 40, 50], [4, 5, 6, 7])); // 期望 100
console.log("双指针 [85,47,57]/[24,66,99]/[40,25,25]:",
  maxProfitAssignment([85, 47, 57], [24, 66, 99], [40, 25, 25])); // 期望 0
console.log("二分 [2,4,6,8,10]/[10,20,30,40,50]/[4,5,6,7]:",
  maxProfitAssignmentBinary([2, 4, 6, 8, 10], [10, 20, 30, 40, 50], [4, 5, 6, 7])); // 期望 100
console.log("二分 [85,47,57]/[24,66,99]/[40,25,25]:",
  maxProfitAssignmentBinary([85, 47, 57], [24, 66, 99], [40, 25, 25])); // 期望 0

export {};
