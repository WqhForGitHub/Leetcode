// ============================================================
// 059. 概率最大的路径
// ============================================================
// LeetCode 1514. Path with Maximum Probability
// 无向图 edges，succProb 为每条边的成功概率。求从 start 到 end 的成功概率最大路径的概率。
// 时间复杂度：Dijkstra O(E log V)；SPFA O(VE)

// ============================================================
// 方法1：Dijkstra 变形（最大堆，推荐）
// 时间复杂度：O(E log V)，空间复杂度：O(V + E)
// 用"乘积最大"代替"和最小"：每次取出当前概率最大的节点松弛邻居。
// ============================================================
function maxProbabilityDijkstra(
  n: number,
  edges: number[][],
  succProb: number[],
  start: number,
  end: number,
): number {
  type Edge = { to: number; p: number };
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    adj[u].push({ to: v, p: succProb[i] });
    adj[v].push({ to: u, p: succProb[i] });
  }

  const prob = new Array(n).fill(0);
  prob[start] = 1;
  // 堆元素 [概率, 节点]，简单用数组模拟最大堆
  const heap: [number, number][] = [[1, start]];
  while (heap.length > 0) {
    let maxIdx = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i][0] > heap[maxIdx][0]) maxIdx = i;
    }
    const [p, u] = heap[maxIdx];
    heap.splice(maxIdx, 1);
    if (u === end) return p; // 取出 end 时即为最大
    if (p < prob[u]) continue; // 过期记录
    for (const e of adj[u]) {
      const np = p * e.p;
      if (np > prob[e.to]) {
        prob[e.to] = np;
        heap.push([np, e.to]);
      }
    }
  }
  return prob[end];
}

// ============================================================
// 方法2：SPFA（队列式松弛）
// 时间复杂度：平均 O(VE)，最坏 O(VE)，空间复杂度：O(V + E)
// 只要还有节点的概率被提升就入队继续松弛。
// ============================================================
function maxProbabilitySPFA(
  n: number,
  edges: number[][],
  succProb: number[],
  start: number,
  end: number,
): number {
  type Edge = { to: number; p: number };
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    adj[u].push({ to: v, p: succProb[i] });
    adj[v].push({ to: u, p: succProb[i] });
  }

  const prob = new Array(n).fill(0);
  prob[start] = 1;
  const inQueue = new Array(n).fill(false);
  const queue: number[] = [start];
  inQueue[start] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;
    inQueue[u] = false;
    for (const e of adj[u]) {
      const np = prob[u] * e.p;
      if (np > prob[e.to]) {
        prob[e.to] = np;
        if (!inQueue[e.to]) {
          inQueue[e.to] = true;
          queue.push(e.to);
        }
      }
    }
  }
  return prob[end];
}

// 统一入口
function maxProbability(
  n: number,
  edges: number[][],
  succProb: number[],
  start: number,
  end: number,
): number {
  return maxProbabilityDijkstra(n, edges, succProb, start, end);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 概率最大的路径 =====");
// 测试1: n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.2], start=0, end=2 -> 0.25
console.log(maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2)); // 期望 0.25
console.log(maxProbabilitySPFA(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2)); // 期望 0.25
// 测试2: n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.3], start=0, end=2 -> 0.3
console.log(maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2)); // 期望 0.3
// 测试3: n=2, edges=[[0,1]], succProb=[0.5], start=0, end=1 -> 0.5
console.log(maxProbability(2, [[0, 1]], [0.5], 0, 1)); // 期望 0.5
console.log(maxProbabilitySPFA(2, [[0, 1]], [0.5], 0, 1)); // 期望 0.5
// 测试4: 不可达 -> 0
console.log(maxProbability(3, [[0, 1]], [0.5], 0, 2)); // 期望 0

export {};
