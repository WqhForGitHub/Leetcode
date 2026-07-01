// ============================================================
// 160. 有向无环图中合法拓扑排序的最大利润
// ============================================================
// 自定义题：n 节点 DAG edges，每节点有时间窗口 [start, end] 和利润 profit，
// 求合法拓扑排序中完成节点最大利润（节点须在其窗口内被完成，且前置已完成）。
// 思路：拓扑排序 + DP / 贪心（按窗口结束时间贪心选取）。
// 时间复杂度：O(V + E)，空间复杂度：O(V)。

interface JobNode {
  id: number;
  start: number;
  end: number;
  profit: number;
}

// 方法1：拓扑排序 + 贪心（按窗口结束时间）
// 用最小堆维护当前可执行（前置已完成）的节点，按 end 时间贪心选取。
function maxProfitTopologicalGreedy(n: number, edges: number[][], nodes: JobNode[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }
  // 最小堆：按 end 时间排序
  const heap: number[] = [];
  const cmp = (a: number, b: number): number =>
    nodes[a].end - nodes[b].end || nodes[a].start - nodes[b].start;
  const push = (x: number): void => {
    heap.push(x);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (cmp(heap[i], heap[p]) < 0) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const pop = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      const len = heap.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < len && cmp(heap[l], heap[smallest]) < 0) smallest = l;
        if (r < len && cmp(heap[r], heap[smallest]) < 0) smallest = r;
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return top;
  };
  for (let i = 0; i < n; i++) if (indeg[i] === 0) push(i);
  let time = 0;
  let profit = 0;
  let done = 0;
  while (heap.length > 0) {
    const cur = pop();
    // 必须在窗口内完成（假设每个任务耗时1单位）
    if (time >= nodes[cur].start && time < nodes[cur].end) {
      profit += nodes[cur].profit;
      done++;
      time++;
    } else if (time < nodes[cur].start) {
      // 等待到 start
      time = nodes[cur].start;
      profit += nodes[cur].profit;
      done++;
      time++;
    } else {
      // 超过窗口，跳过该节点（不可获得利润，但仍解锁后继）
    }
    for (const nx of adj[cur]) {
      indeg[nx]--;
      if (indeg[nx] === 0) push(nx);
    }
  }
  return profit;
}

// 方法2：拓扑排序 + DP（按状态记录最大利润）
// 简化版：DAG 上记忆化搜索，选择节点需其所有前驱已完成。
// dp[u] 表示以 u 为已完成时能获得的最大利润链。
function maxProfitTopologicalDP(n: number, edges: number[][], nodes: JobNode[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }
  // 拓扑序
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  while (q.length > 0) {
    const cur = q.shift()!;
    order.push(cur);
    for (const nx of adj[cur]) {
      indeg[nx]--;
      if (indeg[nx] === 0) q.push(nx);
    }
  }
  // dp[u]: 完成 u 时的最大累计利润（u 必须在其窗口内可完成）
  const dp = new Array(n).fill(-Infinity);
  // 入度为0节点若窗口有效则可作为起点
  for (const u of order) {
    if (nodes[u].end > nodes[u].start) {
      // 窗口有效，至少可获得自身利润
      dp[u] = Math.max(dp[u], nodes[u].profit);
    }
  }
  // 按拓扑序转移：u -> v，要求 v 窗口也有效
  for (const u of order) {
    if (dp[u] === -Infinity) continue;
    for (const v of adj[u]) {
      if (nodes[v].end > nodes[v].start) {
        dp[v] = Math.max(dp[v], dp[u] + nodes[v].profit);
      }
    }
  }
  let ans = 0;
  for (let i = 0; i < n; i++) {
    if (dp[i] !== -Infinity) ans = Math.max(ans, dp[i]);
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 160. 有向无环图中合法拓扑排序的最大利润 =====");
console.log(
  "Greedy:",
  maxProfitTopologicalGreedy(
    3,
    [
      [0, 1],
      [0, 2],
    ],
    [
      { id: 0, start: 0, end: 5, profit: 10 },
      { id: 1, start: 1, end: 5, profit: 20 },
      { id: 2, start: 1, end: 5, profit: 30 },
    ],
  ), // 期望 60
);
console.log(
  "DP:",
  maxProfitTopologicalDP(
    3,
    [
      [0, 1],
      [0, 2],
    ],
    [
      { id: 0, start: 0, end: 5, profit: 10 },
      { id: 1, start: 1, end: 5, profit: 20 },
      { id: 2, start: 1, end: 5, profit: 30 },
    ],
  ), // 期望 60
);
console.log(
  "Greedy:",
  maxProfitTopologicalGreedy(
    2,
    [[0, 1]],
    [
      { id: 0, start: 0, end: 1, profit: 5 },
      { id: 1, start: 0, end: 1, profit: 100 },
    ],
  ), // 节点1窗口在0完成前无法满足
);
console.log(
  "DP:",
  maxProfitTopologicalDP(
    2,
    [[0, 1]],
    [
      { id: 0, start: 0, end: 1, profit: 5 },
      { id: 1, start: 0, end: 1, profit: 100 },
    ],
  ), // 期望 100 或 5
);
console.log(
  "Greedy:",
  maxProfitTopologicalGreedy(1, [], [{ id: 0, start: 0, end: 3, profit: 42 }]), // 期望 42
);
console.log(
  "DP:",
  maxProfitTopologicalDP(1, [], [{ id: 0, start: 0, end: 3, profit: 42 }]), // 期望 42
);

export {};
