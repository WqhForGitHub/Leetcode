// ============================================================
// 040. 颜色交替的最短路径
// ============================================================
// LeetCode 1129. Shortest Path with Alternating Colors
// n 个节点的有向图，red_edges、blue_edges 两种颜色的边。从节点 0 出发，
// 路径上边颜色必须红蓝交替。返回到每个节点的最短路径长度，不可达返回 -1。
// 时间复杂度：O(n + E)，空间复杂度：O(n + E)

// 方法1：BFS（状态=(节点, 上一条边颜色)）（推荐）
// 思路：把状态扩展为 (节点, 到达该节点所用边的颜色 0=红/1=蓝)。
// 起点可先用红边或蓝边出发，故同时入队 (0,0) 与 (0,1)（距离 0）。
// 每次只能走与上一条边颜色相反的边，BFS 首次到达即最短。
function shortestAlternatingPathsBFS(
  n: number,
  redEdges: number[][],
  blueEdges: number[][],
): number[] {
  const red: number[][] = Array.from({ length: n }, () => []);
  const blue: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of redEdges) red[u].push(v);
  for (const [u, v] of blueEdges) blue[u].push(v);

  // dist[node][color]：以 color 边到达 node 的最短距离
  const dist: number[][] = Array.from({ length: n }, () => [Infinity, Infinity]);
  dist[0][0] = 0;
  dist[0][1] = 0;
  const queue: Array<[number, number]> = [[0, 0], [0, 1]];

  while (queue.length > 0) {
    const [u, c] = queue.shift()!;
    const nextC = 1 - c;
    const edges = nextC === 0 ? red[u] : blue[u];
    for (const v of edges) {
      if (dist[v][nextC] > dist[u][c] + 1) {
        dist[v][nextC] = dist[u][c] + 1;
        queue.push([v, nextC]);
      }
    }
  }

  const ans: number[] = [];
  for (let i = 0; i < n; i++) {
    const best = Math.min(dist[i][0], dist[i][1]);
    ans.push(best === Infinity ? -1 : best);
  }
  return ans;
}

// 方法2：分层 BFS（按距离分层扩展）
// 思路：把图拆成两份节点 (v,0)/(v,1)，红边连 (u,1)->(v,0)，蓝边连 (u,0)->(v,1)，
// 在这个二部展开图上做普通 BFS 求最短路，再对每个原节点取两种颜色状态的最小值。
function shortestAlternatingPathsLayered(
  n: number,
  redEdges: number[][],
  blueEdges: number[][],
): number[] {
  // next[c][u]：上一条边颜色为 c 时，从 u 出发的下一组邻居（需走 1-c 颜色边）
  const adj: number[][][] = [Array.from({ length: n }, () => []), Array.from({ length: n }, () => [])];
  for (const [u, v] of redEdges) adj[0][u].push(v); // 红边：从"上一条蓝"状态走
  for (const [u, v] of blueEdges) adj[1][u].push(v); // 蓝边：从"上一条红"状态走

  const dist: number[][] = Array.from({ length: n }, () => [-1, -1]);
  dist[0][0] = 0;
  dist[0][1] = 0;
  let frontier: Array<[number, number]> = [[0, 0], [0, 1]];
  let d = 0;
  while (frontier.length > 0) {
    d++;
    const next: Array<[number, number]> = [];
    for (const [u, c] of frontier) {
      const nextC = 1 - c;
      for (const v of adj[c][u]) {
        if (dist[v][nextC] === -1) {
          dist[v][nextC] = d;
          next.push([v, nextC]);
        }
      }
    }
    frontier = next;
  }

  const ans: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = dist[i][0];
    const b = dist[i][1];
    if (a === -1) ans.push(b);
    else if (b === -1) ans.push(a);
    else ans.push(Math.min(a, b));
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 颜色交替的最短路径 =====");
console.log("BFS:", shortestAlternatingPathsBFS(3, [[0, 1], [1, 2]], [])); // 期望 [0,1,-1]
console.log("BFS:", shortestAlternatingPathsBFS(3, [[0, 1]], [[2, 1]])); // 期望 [0,1,-1]
console.log("BFS:", shortestAlternatingPathsBFS(3, [[1, 0]], [[2, 1]])); // 期望 [0,-1,-1]
console.log("BFS:", shortestAlternatingPathsBFS(3, [[0, 1]], [[1, 2]])); // 期望 [0,1,2]（红蓝交替可达 2）
console.log("分层:", shortestAlternatingPathsLayered(3, [[0, 1], [1, 2]], [])); // 期望 [0,1,-1]
console.log("分层:", shortestAlternatingPathsLayered(3, [[0, 1]], [[2, 1]])); // 期望 [0,1,-1]
console.log("分层:", shortestAlternatingPathsLayered(3, [[1, 0]], [[2, 1]])); // 期望 [0,-1,-1]
console.log("分层:", shortestAlternatingPathsLayered(3, [[0, 1]], [[1, 2]])); // 期望 [0,1,2]

export {};
