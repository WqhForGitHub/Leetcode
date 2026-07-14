// ============================================================
// 082. 到达目的地的第二短时间
// ============================================================
// LeetCode 2045. Second Minimum Time to Reach Destination
// n 个城市，无向边耗时 time，1 到 n 的严格第二短时间。边可重复走。
// BFS 维护 dist[i][0/1] 最短与次短时间。
// 时间复杂度：O(n + m)，空间复杂度：O(n + m)

function secondMinimum(n: number, edges: number[][], time: number, change: number): number {
  // 建图（节点从 1 开始）
  const g: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  // dist[i][0] 最短，dist[i][1] 严格次短
  const dist: number[][] = Array.from({ length: n + 1 }, () => [Infinity, Infinity]);
  dist[1][0] = 0;
  // 队列存 [节点, 当前到达时间]
  const queue: [number, number][] = [[1, 0]];
  let head: number = 0;
  while (head < queue.length) {
    const [u, t]: [number, number] = queue[head++];
    // 计算离开 u 的时间：红绿灯，每 change 秒切换
    // 在 [0, change) 绿灯可走，[change, 2*change) 红灯等待
    let leave: number = t;
    const k: number = Math.floor(leave / change);
    if (k % 2 === 1) {
      // 红灯，等到下一个绿灯
      leave = (k + 1) * change;
    }
    const arrive: number = leave + time;
    for (const v of g[u]) {
      if (arrive < dist[v][0]) {
        dist[v][1] = dist[v][0];
        dist[v][0] = arrive;
        queue.push([v, arrive]);
      } else if (arrive > dist[v][0] && arrive < dist[v][1]) {
        dist[v][1] = arrive;
        queue.push([v, arrive]);
      }
    }
  }
  return dist[n][1];
}

// 方法1：BFS 维护最短与次短
function f1(n: number, edges: number[][], time: number, change: number): number {
  return secondMinimum(n, edges, time, change);
}

// 方法2：Dijkstra 风格优先队列维护次短
function f2(n: number, edges: number[][], time: number, change: number): number {
  const g: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const dist: number[][] = Array.from({ length: n + 1 }, () => [Infinity, Infinity]);
  dist[1][0] = 0;
  // 简单优先队列：按时间排序
  const pq: [number, number][] = [[0, 1]];
  while (pq.length > 0) {
    // 取出最小时间
    let idx: number = 0;
    for (let i: number = 1; i < pq.length; i++) {
      if (pq[i][0] < pq[idx][0]) idx = i;
    }
    const [t, u]: [number, number] = pq.splice(idx, 1)[0];
    let leave: number = t;
    const k: number = Math.floor(leave / change);
    if (k % 2 === 1) leave = (k + 1) * change;
    const arrive: number = leave + time;
    for (const v of g[u]) {
      if (arrive < dist[v][0]) {
        dist[v][1] = dist[v][0];
        dist[v][0] = arrive;
        pq.push([arrive, v]);
      } else if (arrive > dist[v][0] && arrive < dist[v][1]) {
        dist[v][1] = arrive;
        pq.push([arrive, v]);
      }
    }
  }
  return dist[n][1];
}

console.log("===== 082. 到达目的地的第二短时间 =====");
// 测试
console.log(
  f1(
    5,
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [3, 4],
      [4, 5],
    ],
    3,
    5,
  ),
); // 13
console.log(
  f2(
    5,
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [3, 4],
      [4, 5],
    ],
    3,
    5,
  ),
); // 13
console.log(f1(2, [[1, 2]], 3, 2)); // 11
console.log(f2(2, [[1, 2]], 3, 2)); // 11

export {};
