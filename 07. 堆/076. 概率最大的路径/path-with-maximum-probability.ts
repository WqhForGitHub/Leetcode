// ============================================================
// 076. 概率最大的路径
// ============================================================
// LeetCode 1514. Path with Maximum Probability
// 无向图，每条边有概率，求从 start 到 end 的最大概率路径。
// 时间复杂度：O(E log V)，空间复杂度：O(V+E)

// 方法1：Dijkstra 变形 + 最大堆
function maxProbability(n: number, edges: number[][], succProb: number[], start: number, end: number): number {
  const graph: Array<Array<{ to: number; p: number }>> = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    graph[u].push({ to: v, p: succProb[i] });
    graph[v].push({ to: u, p: succProb[i] });
  }
  const prob: number[] = new Array(n).fill(0);
  prob[start] = 1;
  const heap: Array<{ p: number; node: number }> = [];
  const push = (v: { p: number; node: number }): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (heap[i].p > heap[par].p) {
        [heap[i], heap[par]] = [heap[par], heap[i]];
        i = par;
      } else break;
    }
  };
  const pop = (): { p: number; node: number } | undefined => {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l].p > heap[s].p) s = l;
        if (r < heap.length && heap[r].p > heap[s].p) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  push({ p: 1, node: start });
  while (heap.length > 0) {
    const cur = pop()!;
    if (cur.node === end) return cur.p;
    if (cur.p < prob[cur.node]) continue;
    for (const { to, p } of graph[cur.node]) {
      const np = cur.p * p;
      if (np > prob[to]) {
        prob[to] = np;
        push({ p: np, node: to });
      }
    }
  }
  return 0;
}

// 方法2：SPFA
function maxProbabilitySPFA(n: number, edges: number[][], succProb: number[], start: number, end: number): number {
  const graph: Array<Array<{ to: number; p: number }>> = Array.from({ length: n }, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    graph[u].push({ to: v, p: succProb[i] });
    graph[v].push({ to: u, p: succProb[i] });
  }
  const prob: number[] = new Array(n).fill(0);
  prob[start] = 1;
  const queue: number[] = [start];
  const inQueue: boolean[] = new Array(n).fill(false);
  inQueue[start] = true;
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    inQueue[u] = false;
    for (const { to, p } of graph[u]) {
      if (prob[u] * p > prob[to]) {
        prob[to] = prob[u] * p;
        if (!inQueue[to]) {
          queue.push(to);
          inQueue[to] = true;
        }
      }
    }
  }
  return prob[end];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 概率最大的路径 =====");
console.log("Dijkstra:", maxProbability(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2)); // 期望 0.25
console.log("SPFA:", maxProbabilitySPFA(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2)); // 期望 0.3

export {};
