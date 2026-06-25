// ============================================================
// 贪心面试题 - TypeScript 解题合集
// 主题：单次购买的最大利润 / 活动选择问题 / 区间覆盖问题 /
//       最小硬币找零问题 / 最大价值问题 / 最小生成树 /
//       装箱问题 / 排队打水 / 多次购买的最大利润 /
//       最优广告放置 / 区间合并 / 调度任务以最小化延迟 /
//       Huffman 编码
// ============================================================

// ============================================================
// 1. 单次购买的最大利润
// LeetCode 121. Best Time to Buy and Sell Stock
//
// 给定股票每天的价格，只允许一次买卖，求最大利润。
//
// 核心思路：
//   贪心地维护到目前为止的最低价格，用当前价格减去最低价格
//   得到当前利润，取所有利润的最大值
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：贪心 - 一次遍历（推荐）
function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);     // 维护最低买入价
    maxProfit = Math.max(maxProfit, price - minPrice); // 更新最大利润
  }

  return maxProfit;
}

// 方法2：最大子数组转化 — 差分数组
function maxProfitDiff(prices: number[]): number {
  let maxSum = 0;
  let currentSum = 0;

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    currentSum = Math.max(0, currentSum + diff); // 差分数组上的最大子数组和
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// ============================================================
// 2. 活动选择问题
//
// 有 n 个活动，每个活动有开始时间和结束时间，
// 选择尽量多的互不冲突的活动。
//
// 核心思路：
//   贪心策略：按结束时间排序，每次选择结束最早的活动，
//   这样留给后续活动的时间窗口最大
//
// 时间复杂度：O(n log n)（排序）
// 空间复杂度：O(n)（存储结果）
// ============================================================

// 方法1：贪心 - 按结束时间排序（推荐）
function activitySelection(
  activities: [number, number][]
): [number, number][] {
  // 按结束时间升序排序
  const sorted = [...activities].sort((a, b) => a[1] - b[1]);
  const selected: [number, number][] = [];
  let lastEnd = -Infinity;

  for (const [start, end] of sorted) {
    if (start >= lastEnd) {
      selected.push([start, end]);
      lastEnd = end; // 更新上一个活动的结束时间
    }
  }

  return selected;
}

// 方法2：贪心 - 返回选中活动的索引
function activitySelectionIndex(
  activities: [number, number][]
): number[] {
  // 记录原始索引并按结束时间排序
  const indexed = activities
    .map((act, i) => ({ start: act[0], end: act[1], index: i }))
    .sort((a, b) => a.end - b.end);

  const selected: number[] = [];
  let lastEnd = -Infinity;

  for (const { start, end, index } of indexed) {
    if (start >= lastEnd) {
      selected.push(index);
      lastEnd = end;
    }
  }

  return selected;
}

// ============================================================
// 3. 区间覆盖问题
//
// 给定目标区间 [start, end] 和若干小区间，选择最少的
// 小区间来完全覆盖目标区间。
//
// 核心思路：
//   按左端点排序，贪心地每次选择能覆盖当前起点且右端点最远的区间
//
// 时间复杂度：O(n log n)（排序）
// 空间复杂度：O(1)（不计结果）
// ============================================================

// 方法1：贪心 - 按左端点排序（推荐）
function intervalCover(
  intervals: [number, number][],
  targetStart: number,
  targetEnd: number
): [number, number][] {
  // 按左端点升序排序
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const selected: [number, number][] = [];
  let current = targetStart;
  let i = 0;
  const n = sorted.length;

  while (current < targetEnd && i < n) {
    let maxRight = current; // 当前能到达的最远右端点

    // 找到所有左端点 <= current 的区间中右端点最大的
    while (i < n && sorted[i][0] <= current) {
      maxRight = Math.max(maxRight, sorted[i][1]);
      i++;
    }

    if (maxRight <= current) {
      // 无法继续扩展覆盖范围，无解
      return [];
    }

    // 找到最远覆盖的区间（回溯一步找到它）
    selected.push([current, maxRight]);
    current = maxRight; // 更新当前覆盖到的位置
  }

  return current >= targetEnd ? selected : [];
}

// ============================================================
// 4. 最小硬币找零问题
//
// 有面值为 coins 的硬币若干（每种数量无限），
// 凑出金额 amount 所需的最少硬币数。
//
// 核心思路：
//   贪心策略：每次尽量使用最大面值的硬币。
//   注意：贪心不一定能得最优解（如 coins=[1,3,4], amount=6，
//   贪心得 4+1+1=3枚，最优为 3+3=2枚），
//   但对于特定硬币组（如美币 1,5,10,25）贪心是最优的。
//
// 时间复杂度：O(n)（n 为硬币种类数）
// 空间复杂度：O(1)
// ============================================================

// 方法1：贪心 - 从大到小选硬币（适用于标准币制）
function minCoinsGreedy(coins: number[], amount: number): number {
  const sorted = [...coins].sort((a, b) => b - a); // 降序排列
  let count = 0;
  let remaining = amount;

  for (const coin of sorted) {
    if (remaining >= coin) {
      const use = Math.floor(remaining / coin); // 使用尽可能多的大面值硬币
      count += use;
      remaining -= use * coin;
    }
  }

  return remaining === 0 ? count : -1; // 剩余不为0说明无法凑出
}

// 方法2：动态规划 — 保证最优解（对比用）
function minCoinsDP(coins: number[], amount: number): number {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ============================================================
// 5. 最大价值问题（分数背包）
//
// 有 n 个物品，每个物品有重量和价值，背包容量为 W，
// 物品可以分割（取一部分），求背包能装下的最大价值。
//
// 核心思路：
//   计算每个物品的单位价值，按单位价值降序排列，
//   贪心地优先装入单位价值最高的物品
//
// 时间复杂度：O(n log n)（排序）
// 空间复杂度：O(n)（排序副本）
// ============================================================

// 方法1：贪心 - 按单位价值排序（推荐）
function fractionalKnapsack(
  items: { weight: number; value: number }[],
  capacity: number
): number {
  // 按单位价值降序排序
  const sorted = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight
  );

  let totalValue = 0;
  let remaining = capacity;

  for (const item of sorted) {
    if (remaining <= 0) break;

    const take = Math.min(item.weight, remaining); // 能装多少装多少
    totalValue += (take / item.weight) * item.value; // 按比例计算价值
    remaining -= take;
  }

  return totalValue;
}

// ============================================================
// 6. 最小生成树
// Kruskal 算法
//
// 给定无向连通图，找到权值之和最小的生成树。
//
// 核心思路：
//   将所有边按权值升序排序，依次选边：
//   若该边的两个端点不在同一连通分量中（不会形成环），
//   则加入生成树。使用并查集维护连通性。
//
// 时间复杂度：O(E log E)（排序 + 并查集）
// 空间复杂度：O(V)
// ============================================================

// 并查集
class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // 已在同一集合

    // 按秩合并
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

// 方法1：Kruskal 算法 - 边排序 + 并查集（推荐）
function kruskalMST(
  vertexCount: number,
  edges: [number, number, number][] // [u, v, weight]
): { mst: [number, number, number][]; totalWeight: number } {
  // 按边权升序排序
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(vertexCount);
  const mst: [number, number, number][] = [];
  let totalWeight = 0;

  for (const [u, v, w] of sorted) {
    if (uf.union(u, v)) {
      mst.push([u, v, w]);
      totalWeight += w;
      if (mst.length === vertexCount - 1) break; // 生成树已有 n-1 条边
    }
  }

  return { mst, totalWeight };
}

// 方法2：Prim 算法 - 从顶点扩展
function primMST(
  vertexCount: number,
  adjList: Map<number, [number, number][]> // 邻接表: vertex -> [(neighbor, weight)]
): number {
  const inMST = new Array(vertexCount).fill(false);
  const minDist = new Array(vertexCount).fill(Infinity);
  minDist[0] = 0;
  let totalWeight = 0;

  for (let i = 0; i < vertexCount; i++) {
    // 找到不在 MST 中且距离最小的顶点
    let u = -1;
    for (let v = 0; v < vertexCount; v++) {
      if (!inMST[v] && (u === -1 || minDist[v] < minDist[u])) {
        u = v;
      }
    }

    inMST[u] = true;
    totalWeight += minDist[u];

    // 用 u 的邻接边更新其他顶点的最小距离
    for (const [v, w] of adjList.get(u) ?? []) {
      if (!inMST[v] && w < minDist[v]) {
        minDist[v] = w;
      }
    }
  }

  return totalWeight;
}

// ============================================================
// 7. 装箱问题
//
// 有若干物品（大小为 items）和容量为 capacity 的箱子，
// 每个箱子可装多个物品但总大小不超过 capacity，
// 求最少需要的箱子数。
//
// 核心思路：
//   First Fit Decreasing (FFD)：先将物品按大小降序排列，
//   对每个物品找第一个能放下的箱子，没有则新开一个
//
// 时间复杂度：O(n log n)（排序） + O(n * m)（装箱）
// 空间复杂度：O(m)（m 为箱子数）
// ============================================================

// 方法1：FFD - 首次适应降序算法（推荐）
function binPackingFFD(items: number[], capacity: number): number {
  const sorted = [...items].sort((a, b) => b - a); // 降序排列
  const bins: number[] = []; // 每个箱子的剩余容量

  for (const item of sorted) {
    let placed = false;

    // 找第一个能放下的箱子
    for (let i = 0; i < bins.length; i++) {
      if (bins[i] >= item) {
        bins[i] -= item; // 放入该箱子
        placed = true;
        break;
      }
    }

    if (!placed) {
      bins.push(capacity - item); // 新开一个箱子
    }
  }

  return bins.length;
}

// 方法2：BFD - 最佳适应降序算法
function binPackingBFD(items: number[], capacity: number): number {
  const sorted = [...items].sort((a, b) => b - a);
  const bins: number[] = [];

  for (const item of sorted) {
    let bestIdx = -1;
    let bestRemainder = capacity + 1; // 最小剩余空间

    // 找能放下且剩余空间最小的箱子（最紧凑）
    for (let i = 0; i < bins.length; i++) {
      if (bins[i] >= item && bins[i] - item < bestRemainder) {
        bestRemainder = bins[i] - item;
        bestIdx = i;
      }
    }

    if (bestIdx !== -1) {
      bins[bestIdx] -= item;
    } else {
      bins.push(capacity - item);
    }
  }

  return bins.length;
}

// ============================================================
// 8. 排队打水
//
// n 个人排队在一个水龙头接水，第 i 个人接水时间为 t[i]，
// 安排顺序使所有人等待时间之和最小。
//
// 核心思路：
//   贪心策略：接水时间短的人先接，因为每个人接水时
//   后面所有人都在等待，所以把时间短的排前面可减少总等待
//
// 时间复杂度：O(n log n)（排序）
// 空间复杂度：O(1)（不计排序）
// ============================================================

// 方法1：贪心 - 按接水时间升序排列（推荐）
function minWaitingTime(times: number[]): number {
  const sorted = [...times].sort((a, b) => a - b); // 升序排列
  let totalWait = 0;
  let prefixSum = 0; // 前面的人接水时间之和

  for (let i = 0; i < sorted.length - 1; i++) {
    prefixSum += sorted[i];    // 当前的人接完水
    totalWait += prefixSum;     // 他后面所有人都要等这么久
  }

  return totalWait;
}

// 方法2：公式法 — 排序后第 i 个人的等待贡献为 t[i] * (n - 1 - i)
function minWaitingTimeFormula(times: number[]): number {
  const n = times.length;
  const sorted = [...times].sort((a, b) => a - b);
  let totalWait = 0;

  for (let i = 0; i < n; i++) {
    totalWait += sorted[i] * (n - 1 - i); // 第 i 个人被 n-1-i 个人等待
  }

  return totalWait;
}

// ============================================================
// 9. 多次购买的最大利润
// LeetCode 122. Best Time to Buy and Sell Stock II
//
// 可以进行多次买卖（但同一时刻只能持有一只股票），求最大利润。
//
// 核心思路：
//   贪心策略：只要今天比昨天涨了就交易（昨天买今天卖），
//   所有上涨区间之和就是最大利润
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：贪心 - 收集所有上涨（推荐）
function maxProfitMultiple(prices: number[]): number {
  let profit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1]; // 只要有利润就交易
    }
  }

  return profit;
}

// 方法2：贪心 - 波谷波峰法
function maxProfitPeakValley(prices: number[]): number {
  let profit = 0;
  let i = 0;
  const n = prices.length;

  while (i < n - 1) {
    // 找波谷（买入点）
    while (i < n - 1 && prices[i] >= prices[i + 1]) i++;
    const valley = prices[i];

    // 找波峰（卖出点）
    while (i < n - 1 && prices[i] <= prices[i + 1]) i++;
    const peak = prices[i];

    profit += peak - valley;
  }

  return profit;
}

// ============================================================
// 10. 最优广告放置
//
// 有 n 个广告和 n 个时间槽，每个广告放在不同时间槽有不同收益，
// 求最大总收益（每个广告只能放一个槽，每个槽只能放一个广告）。
//
// 核心思路：
//   贪心策略：对所有 (广告, 时间槽, 收益) 按收益降序排列，
//   依次选择收益最大的组合，前提是该广告和时间槽尚未被占用。
//   等价于最大权二分匹配的贪心近似。
//
// 时间复杂度：O(n^2 log n)（排序所有组合）
// 空间复杂度：O(n^2)
// ============================================================

// 方法1：贪心 - 按收益降序分配（推荐）
function optimalAdPlacement(
  revenue: number[][] // revenue[i][j] = 广告 i 放在时间槽 j 的收益
): { total: number; placement: [number, number][] } {
  const n = revenue.length;
  const combos: { ad: number; slot: number; rev: number }[] = [];

  // 枚举所有 (广告, 时间槽) 组合
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < revenue[i].length; j++) {
      combos.push({ ad: i, slot: j, rev: revenue[i][j] });
    }
  }

  // 按收益降序排序
  combos.sort((a, b) => b.rev - a.rev);

  const adUsed = new Set<number>();
  const slotUsed = new Set<number>();
  const placement: [number, number][] = [];
  let total = 0;

  for (const { ad, slot, rev } of combos) {
    if (!adUsed.has(ad) && !slotUsed.has(slot)) {
      adUsed.add(ad);
      slotUsed.add(slot);
      placement.push([ad, slot]);
      total += rev;
    }
  }

  return { total, placement };
}

// ============================================================
// 11. 区间合并
// LeetCode 56. Merge Intervals
//
// 给定一组区间，合并所有重叠的区间。
//
// 核心思路：
//   按左端点排序，依次扫描：若当前区间与上一个合并区间重叠
//   （左端点 <= 上一区间右端点），则合并；否则作为新区间加入结果
//
// 时间复杂度：O(n log n)（排序）
// 空间复杂度：O(n)（结果数组）
// ============================================================

// 方法1：贪心 - 排序后一次扫描合并（推荐）
function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];

  // 按左端点升序排序
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [[...sorted[0]]];

  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];

    if (start <= last[1]) {
      // 重叠，合并（取右端点最大值）
      last[1] = Math.max(last[1], end);
    } else {
      // 不重叠，新开区间
      merged.push([start, end]);
    }
  }

  return merged;
}

// 方法2：原地合并 — 修改输入数组
function mergeIntervalsInPlace(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  let write = 0; // 合并后的写入位置

  for (let read = 1; read < intervals.length; read++) {
    if (intervals[read][0] <= intervals[write][1]) {
      // 合并：扩展右端点
      intervals[write][1] = Math.max(intervals[write][1], intervals[read][1]);
    } else {
      write++;
      intervals[write] = intervals[read]; // 移动到下一个位置
    }
  }

  return intervals.slice(0, write + 1);
}

// ============================================================
// 12. 调度任务以最小化延迟
//
// 每个任务有处理时间 t[i] 和截止时间 d[i]，
// 单机调度，求最小化最大延迟（完成任务时间 - 截止时间的最大值）。
//
// 核心思路：
//   贪心策略：按截止时间升序排列（Earliest Deadline First），
//   优先处理截止时间最早的任务，这是最优调度
//
// 时间复杂度：O(n log n)（排序）
// 空间复杂度：O(1)（不计排序）
// ============================================================

// 方法1：EDF - 按截止时间排序（推荐）
function minimizeMaxLateness(
  tasks: { time: number; deadline: number }[]
): { schedule: number[]; maxLateness: number } {
  // 按截止时间升序排序，同时保留原始索引
  const sorted = tasks
    .map((task, i) => ({ ...task, index: i }))
    .sort((a, b) => a.deadline - b.deadline);

  let currentTime = 0;
  let maxLateness = 0;
  const schedule: number[] = [];

  for (const { time, deadline, index } of sorted) {
    currentTime += time;              // 任务完成时间
    const lateness = Math.max(0, currentTime - deadline); // 延迟量
    maxLateness = Math.max(maxLateness, lateness);
    schedule.push(index);             // 记录调度顺序
  }

  return { schedule, maxLateness };
}

// 方法2：返回每个任务的完成时间和延迟详情
function minimizeMaxLatenessDetail(
  tasks: { time: number; deadline: number }[]
): {
  order: number[];
  completionTimes: number[];
  lateness: number[];
  maxLateness: number;
} {
  const sorted = tasks
    .map((task, i) => ({ ...task, index: i }))
    .sort((a, b) => a.deadline - b.deadline);

  let currentTime = 0;
  let maxLateness = 0;
  const order: number[] = [];
  const completionTimes: number[] = [];
  const lateness: number[] = [];

  for (const { time, deadline, index } of sorted) {
    currentTime += time;
    const late = Math.max(0, currentTime - deadline);
    maxLateness = Math.max(maxLateness, late);
    order.push(index);
    completionTimes.push(currentTime);
    lateness.push(late);
  }

  return { order, completionTimes, lateness, maxLateness };
}

// ============================================================
// 13. Huffman 编码
//
// 给定一组字符及其频率，构造最优前缀编码，使编码总长度最短。
//
// 核心思路：
//   贪心策略：每次从优先队列中取出频率最小的两个节点合并，
//   合并后节点的频率为两者之和，重新入队，直到只剩一个节点
//
// 时间复杂度：O(n log n)（优先队列操作）
// 空间复杂度：O(n)
// ============================================================

// Huffman 树节点
class HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string | null, freq: number) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

// 方法1：贪心 - 优先队列构建 Huffman 树（推荐）
function huffmanEncoding(
  freqMap: Map<string, number>
): Map<string, string> {
  // 简易最小堆（用排序模拟优先队列）
  const heap: HuffmanNode[] = [];
  for (const [char, freq] of freqMap) {
    heap.push(new HuffmanNode(char, freq));
  }

  // 反复取最小的两个节点合并
  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq); // 排序模拟最小堆
    const left = heap.shift()!;  // 频率最小的
    const right = heap.shift()!; // 频率次小的

    const parent = new HuffmanNode(null, left.freq + right.freq);
    parent.left = left;
    parent.right = right;
    heap.push(parent);
  }

  // 从 Huffman 树生成编码表
  const codes = new Map<string, string>();
  function traverse(node: HuffmanNode | null, code: string) {
    if (!node) return;
    if (node.char !== null) {
      codes.set(node.char, code || "0"); // 单字符的特殊情况
      return;
    }
    traverse(node.left, code + "0");  // 左分支编码 0
    traverse(node.right, code + "1"); // 右分支编码 1
  }

  traverse(heap[0], "");
  return codes;
}

// 方法2：计算 Huffman 编码的总比特长度
function huffmanTotalBits(freqMap: Map<string, number>): number {
  const codes = huffmanEncoding(freqMap);
  let totalBits = 0;

  for (const [char, freq] of freqMap) {
    totalBits += freq * codes.get(char)!.length;
  }

  return totalBits;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 单次购买的最大利润 =====");
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfit([7, 6, 4, 3, 1]));     // 0
console.log(maxProfitDiff([7, 1, 5, 3, 6, 4])); // 5

console.log("\n===== 2. 活动选择问题 =====");
const activities: [number, number][] = [
  [1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]
];
console.log(activitySelection(activities)); // [[1,4],[5,7],[8,11],[12,16]]
console.log(activitySelectionIndex(activities)); // [0,3,7,10]

console.log("\n===== 3. 区间覆盖问题 =====");
const coverIntervals: [number, number][] = [[1, 4], [2, 5], [3, 6], [5, 8], [6, 9], [8, 10]];
console.log(intervalCover(coverIntervals, 1, 10)); // 至少覆盖 [1,10]

console.log("\n===== 4. 最小硬币找零问题 =====");
console.log(minCoinsGreedy([1, 5, 10, 25], 36)); // 3 (25+10+1)
console.log(minCoinsGreedy([1, 3, 4], 6));        // 3 (贪心 4+1+1，非最优)
console.log(minCoinsDP([1, 3, 4], 6));             // 2 (3+3，DP 最优)

console.log("\n===== 5. 最大价值问题（分数背包）=====");
const knapsackItems = [
  { weight: 10, value: 60 },
  { weight: 20, value: 100 },
  { weight: 30, value: 120 }
];
console.log(fractionalKnapsack(knapsackItems, 50)); // 240

console.log("\n===== 6. 最小生成树 =====");
const mstEdges: [number, number, number][] = [
  [0, 1, 4], [0, 2, 3], [1, 2, 1], [1, 3, 2], [2, 3, 4], [3, 4, 2], [4, 5, 6]
];
console.log(kruskalMST(6, mstEdges)); // totalWeight: 12

const adjList = new Map<number, [number, number][]>();
adjList.set(0, [[1, 4], [2, 3]]);
adjList.set(1, [[0, 4], [2, 1], [3, 2]]);
adjList.set(2, [[0, 3], [1, 1], [3, 4]]);
adjList.set(3, [[1, 2], [2, 4], [4, 2]]);
adjList.set(4, [[3, 2], [5, 6]]);
adjList.set(5, [[4, 6]]);
console.log(primMST(6, adjList)); // 12

console.log("\n===== 7. 装箱问题 =====");
console.log(binPackingFFD([4, 8, 1, 4, 2, 1], 10)); // 3
console.log(binPackingBFD([4, 8, 1, 4, 2, 1], 10)); // 3

console.log("\n===== 8. 排队打水 =====");
console.log(minWaitingTime([3, 6, 1, 4, 2])); // 20
console.log(minWaitingTimeFormula([3, 6, 1, 4, 2])); // 20

console.log("\n===== 9. 多次购买的最大利润 =====");
console.log(maxProfitMultiple([7, 1, 5, 3, 6, 4])); // 7
console.log(maxProfitMultiple([1, 2, 3, 4, 5]));    // 4
console.log(maxProfitPeakValley([7, 1, 5, 3, 6, 4])); // 7

console.log("\n===== 10. 最优广告放置 =====");
const adRevenue = [
  [3, 5, 2],
  [6, 1, 4],
  [2, 3, 5]
];
console.log(optimalAdPlacement(adRevenue)); // total: 15

console.log("\n===== 11. 区间合并 =====");
console.log(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])); // [[1,6],[8,10],[15,18]]
console.log(mergeIntervals([[1, 4], [4, 5]]));                      // [[1,5]]
console.log(mergeIntervalsInPlace([[1, 3], [2, 6], [8, 10], [15, 18]])); // [[1,6],[8,10],[15,18]]

console.log("\n===== 12. 调度任务以最小化延迟 =====");
const scheduleTasks = [
  { time: 3, deadline: 6 },
  { time: 2, deadline: 8 },
  { time: 1, deadline: 9 },
  { time: 4, deadline: 9 },
  { time: 3, deadline: 14 },
  { time: 2, deadline: 15 }
];
console.log(minimizeMaxLateness(scheduleTasks));
console.log(minimizeMaxLatenessDetail(scheduleTasks));

console.log("\n===== 13. Huffman 编码 =====");
const huffFreq = new Map<string, number>();
huffFreq.set("a", 5);
huffFreq.set("b", 9);
huffFreq.set("c", 12);
huffFreq.set("d", 13);
huffFreq.set("e", 16);
huffFreq.set("f", 45);
console.log(huffmanEncoding(huffFreq));
console.log(huffmanTotalBits(huffFreq)); // 224

export {};
