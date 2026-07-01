// ============================================================
// 120. 两地调度
// ============================================================
// LeetCode 1029. Two City Scheduling
// 2N 个人分别去 A、B 两座城市，每城恰好 N 人。给定 costs[i] = [去A费用, 去B费用]，
// 求最小总费用。

// 方法1：按费用差排序贪心（推荐，O(n log n) 时间，O(log n) 排序空间）
// costs[i][0] - costs[i][1] 表示「去 A 比 去 B 多花的钱」。
// 差值越小（越负），越应去 A；差值越大，越应去 B。
// 排序后前 N 人去 A，后 N 人去 B。
function twoCitySchedCost(costs: number[][]): number {
  costs.sort((a, b) => a[0] - a[1] - (b[0] - b[1]));
  const n = costs.length / 2;
  let total = 0;
  for (let i = 0; i < n; i++) total += costs[i][0]; // 前 N 去A
  for (let i = n; i < costs.length; i++) total += costs[i][1]; // 后 N 去B
  return total;
}

// 方法2：先全去 A，再选 N 个改去 B 收益最大（O(n log n) 时间）
// 假设所有人都去 A，总费用 sum(costs[i][0])。
// 改派某人去 B 的「收益」= costs[i][0] - costs[i][1]（去B省下的钱）。
// 选收益最大的 N 个改去 B，从总费用中扣除其收益。
function twoCitySchedCostGain(costs: number[][]): number {
  const n = costs.length / 2;
  // gains[i] = 派第 i 人去 B 相比去 A 节省的费用
  const gains = costs.map((c) => c[0] - c[1]);
  const order = gains
    .map((g, i) => [g, i] as [number, number])
    .sort((a, b) => b[0] - a[0]); // 收益从大到小
  let total = 0;
  for (const c of costs) total += c[0]; // 全部先去 A
  // 收益最大的前 N 人改去 B：减去 c[0]，加上 c[1]，等价于减去 gain
  for (let k = 0; k < n; k++) {
    const idx = order[k][1];
    total -= costs[idx][0]; // 撤销去A
    total += costs[idx][1]; // 改为去B
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 120. 两地调度 =====");
console.log(
  "方法1 [[10,20],[30,200],[400,50],[30,20]]:",
  twoCitySchedCost([
    [10, 20],
    [30, 200],
    [400, 50],
    [30, 20],
  ])
); // 期望 110
console.log(
  "方法1 [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]:",
  twoCitySchedCost([
    [259, 770],
    [448, 54],
    [926, 667],
    [184, 139],
    [840, 118],
    [577, 469],
  ])
); // 期望 1859
console.log(
  "方法2 [[10,20],[30,200],[400,50],[30,20]]:",
  twoCitySchedCostGain([
    [10, 20],
    [30, 200],
    [400, 50],
    [30, 20],
  ])
); // 期望 110
console.log(
  "方法2 [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]:",
  twoCitySchedCostGain([
    [259, 770],
    [448, 54],
    [926, 667],
    [184, 139],
    [840, 118],
    [577, 469],
  ])
); // 期望 1859

export {};
