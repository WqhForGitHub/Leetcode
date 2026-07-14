// ============================================================
// 100. 道路的最大总重要性
// ============================================================
// LeetCode 2285. Maximum Total Importance of Roads
// n 城市，roads=[a,b]。给每个城市赋值 1..n（每个值用一次），使所有道路两端值之和最大。
// 方法：按度数贪心赋值（度数大的赋大值）。
// 时间复杂度：O(n + E log E) 或 O(n + E)（计数排序），空间复杂度：O(n)

function maximumImportance(n: number, roads: number[][]): number {
  const degree = new Array<number>(n).fill(0);
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
  }
  // 度数从小到大排序，赋值 1..n（度数越大赋值越大）
  degree.sort((a, b) => a - b);
  let ans = 0;
  for (let i = 0; i < n; i++) {
    ans += degree[i] * (i + 1);
  }
  return ans;
}

// 方法2：计数排序优化（不依赖比较排序，O(n + E)）
function maximumImportanceCounting(n: number, roads: number[][]): number {
  const degree = new Array<number>(n).fill(0);
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
  }
  // 计数排序：度数最大不超过边数 * 2，这里直接按度数桶排
  const maxDeg = degree.reduce((m, d) => Math.max(m, d), 0);
  const bucket = new Array<number>(maxDeg + 1).fill(0);
  for (const d of degree) bucket[d]++;
  let ans = 0;
  let value = 1;
  for (let d = 0; d <= maxDeg; d++) {
    for (let c = 0; c < bucket[d]; c++) {
      ans += d * value;
      value++;
    }
  }
  return ans;
}

// 方法3：直接计算（公式：sum(degree[i] * rank[i])，rank 为按度数排名的赋值）
// 与方法1等价，仅展示写法差异
function maximumImportanceExplicit(n: number, roads: number[][]): number {
  const degree = new Array<number>(n).fill(0);
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
  }
  const indexed = degree.map((d, i) => [d, i] as [number, number]);
  indexed.sort((x, y) => x[0] - y[0]);
  const value = new Array<number>(n);
  for (let k = 0; k < n; k++) value[indexed[k][1]] = k + 1;
  let ans = 0;
  for (const [a, b] of roads) ans += value[a] + value[b];
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 道路的最大总重要性 =====");
console.log(
  maximumImportance(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
  ]),
); // 期望: 43
console.log(
  maximumImportance(5, [
    [0, 3],
    [2, 4],
    [1, 3],
  ]),
); // 期望: 20
console.log(
  maximumImportanceCounting(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
  ]),
); // 期望: 43
console.log(
  maximumImportanceExplicit(5, [
    [0, 3],
    [2, 4],
    [1, 3],
  ]),
); // 期望: 20

export {};
