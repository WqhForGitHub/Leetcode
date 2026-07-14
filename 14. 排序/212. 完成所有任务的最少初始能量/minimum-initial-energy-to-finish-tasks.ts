// ============================================================
// 212. 完成所有任务的最少初始能量
// ============================================================
// LeetCode 1665. Minimum Initial Energy to Finish Tasks
// tasks[i] = [actual, minimum]：开始任务需能量 >= minimum，完成后消耗 actual。
// 求完成所有任务所需的最小初始能量（minimum >= actual 恒成立）。

// 方法1：按 (minimum - actual) 降序 + 贪心模拟（O(n log n)）
// 差值越大的任务越"占能量"，应尽早完成。
function minimumEffort(tasks: number[][]): number {
  tasks.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));
  let energy = 0;
  let required = 0;
  for (const [actual, minimum] of tasks) {
    if (energy < minimum) {
      required += minimum - energy;
      energy = minimum;
    }
    energy -= actual;
  }
  return required;
}

// 方法2：按差值排序 + 前缀累计求最大需求（O(n log n)）
// E = max( totalActual, max_i (minimum[i] + prefixActual[i-1]) )
function minimumEffort2(tasks: number[][]): number {
  tasks.sort((a, b) => b[1] - b[0] - (a[1] - a[0]));
  let totalActual = 0;
  let prefix = 0;
  let maxNeed = 0;
  for (const [actual, minimum] of tasks) {
    maxNeed = Math.max(maxNeed, minimum + prefix);
    prefix += actual;
    totalActual += actual;
  }
  return Math.max(totalActual, maxNeed);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 212. 完成所有任务的最少初始能量 =====");
console.log(
  "方法1 [[1,2],[2,4],[4,8]]:",
  minimumEffort([
    [1, 2],
    [2, 4],
    [4, 8],
  ]),
); // 8
console.log(
  "方法1 [[1,3],[2,4],[10,11],[10,12],[8,9]]:",
  minimumEffort([
    [1, 3],
    [2, 4],
    [10, 11],
    [10, 12],
    [8, 9],
  ]),
); // 32
console.log(
  "方法2 [[1,2],[2,4],[4,8]]:",
  minimumEffort2([
    [1, 2],
    [2, 4],
    [4, 8],
  ]),
); // 8
console.log(
  "方法2 [[1,3],[2,4],[10,11],[10,12],[8,9]]:",
  minimumEffort2([
    [1, 3],
    [2, 4],
    [10, 11],
    [10, 12],
    [8, 9],
  ]),
); // 32

export {};
