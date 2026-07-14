// ============================================================
// 068. 安排工作以达到最大收益
// ============================================================
// LeetCode 826. Most Profit Assigning Work
// 工作有难度和利润，工人有能力值，每个工人能获得不超过其能力的最大利润工作。

// 方法1：排序 + 二分查找
function maxProfitAssignment(difficulty: number[], profit: number[], worker: number[]): number {
  const n = difficulty.length;
  const jobs = difficulty.map((d, i) => ({ d, p: profit[i] })).sort((a, b) => a.d - b.d);
  // 更新每个难度对应的最大利润（前缀最大利润）
  const sortedDiff = jobs.map((j) => j.d);
  const maxProfit = new Array(n);
  maxProfit[0] = jobs[0].p;
  for (let i = 1; i < n; i++) {
    maxProfit[i] = Math.max(maxProfit[i - 1], jobs[i].p);
  }
  let result = 0;
  for (const ability of worker) {
    // 二分找最大难度 <= ability 的索引
    let lo = 0;
    let hi = n - 1;
    let idx = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sortedDiff[mid] <= ability) {
        idx = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (idx >= 0) result += maxProfit[idx];
  }
  return result;
}

// 方法2：排序 + 双指针
function maxProfitAssignmentTwoPointer(
  difficulty: number[],
  profit: number[],
  worker: number[],
): number {
  const n = difficulty.length;
  const jobs = difficulty.map((d, i) => ({ d, p: profit[i] })).sort((a, b) => a.d - b.d);
  worker.sort((a, b) => a - b);
  let result = 0;
  let bestProfit = 0;
  let i = 0;
  for (const ability of worker) {
    while (i < n && jobs[i].d <= ability) {
      bestProfit = Math.max(bestProfit, jobs[i].p);
      i++;
    }
    result += bestProfit;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 安排工作以达到最大收益 =====");
console.log(
  "二分 [2,4,6,8,10],[10,20,30,40,50],[4,5,6,7]:",
  maxProfitAssignment([2, 4, 6, 8, 10], [10, 20, 30, 40, 50], [4, 5, 6, 7]),
); // 100
console.log(
  "双指针 [1,2,3],[10,20,30],[3,2,1]:",
  maxProfitAssignmentTwoPointer([1, 2, 3], [10, 20, 30], [3, 2, 1]),
); // 60

export {};
