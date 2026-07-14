// ============================================================
// 081. 网络空闲的时刻
// ============================================================
// LeetCode 2039. The Time When the Network Becomes Idle
// 给定 n 个节点的无向图 edges，节点 0 为主服务器，patience[i] 为数据服务器 i
// 重发消息的间隔。消息往返时间为 2 * 最短距离。求网络变为空闲的时刻。
// 时间复杂度：O(n + m)，空间复杂度：O(n + m)

function networkBecomesIdle(edges: number[][], patience: number[]): number {
  const n: number = patience.length;
  // 建图
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  // BFS 求每个节点到 0 的最短距离
  const dist: number[] = new Array(n).fill(-1);
  dist[0] = 0;
  const queue: number[] = [0];
  let head: number = 0;
  while (head < queue.length) {
    const u: number = queue[head++];
    for (const v of g[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  // 计算每个节点最后一条消息到达 0 后回复回来的时间
  let ans: number = 0;
  for (let i: number = 1; i < n; i++) {
    const d: number = dist[i];
    const round: number = 2 * d; // 往返时间
    // 第一次回复到达 i 的时刻为 round，在此之前 i 可能重发
    // 最后一次重发时刻：(round - 1) // patience[i] * patience[i]
    const lastSend: number = Math.floor((round - 1) / patience[i]) * patience[i];
    const lastRecv: number = lastSend + round;
    ans = Math.max(ans, lastRecv);
  }
  return ans + 1;
}

// 方法1：BFS 求最短距离 + 计算最后接收时刻
function f1(edges: number[][], patience: number[]): number {
  return networkBecomesIdle(edges, patience);
}

// 方法2：分层 BFS（按层处理）
function f2(edges: number[][], patience: number[]): number {
  const n: number = patience.length;
  const g: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const dist: number[] = new Array(n).fill(-1);
  dist[0] = 0;
  let cur: number[] = [0];
  let level: number = 0;
  while (cur.length > 0) {
    level++;
    const next: number[] = [];
    for (const u of cur) {
      for (const v of g[u]) {
        if (dist[v] === -1) {
          dist[v] = level;
          next.push(v);
        }
      }
    }
    cur = next;
  }
  let ans: number = 0;
  for (let i: number = 1; i < n; i++) {
    const round: number = 2 * dist[i];
    const lastSend: number = Math.floor((round - 1) / patience[i]) * patience[i];
    ans = Math.max(ans, lastSend + round);
  }
  return ans + 1;
}

console.log("===== 081. 网络空闲的时刻 =====");
// 测试
console.log(
  f1(
    [
      [0, 1],
      [1, 2],
    ],
    [0, 2, 1],
  ),
); // 8
console.log(
  f2(
    [
      [0, 1],
      [1, 2],
    ],
    [0, 2, 1],
  ),
); // 8
console.log(
  f1(
    [
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [0, 10, 10],
  ),
); // 3
console.log(
  f2(
    [
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [0, 10, 10],
  ),
); // 3

export {};
