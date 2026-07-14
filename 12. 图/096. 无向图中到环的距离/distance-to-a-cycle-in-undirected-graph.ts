// ============================================================
// 096. 无向图中到环的距离
// ============================================================
// LeetCode 2204. Distance to a Cycle in Undirected Graph
// n 节点无向连通图含恰好一个环。返回每个节点到最近环上节点的距离数组。
// 方法：拓扑剥叶子（度数）找环节点，再从环节点多源 BFS 求距离。
// 时间复杂度：O(n)，空间复杂度：O(n)

function distanceToCycle(n: number, edges: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const degree = new Array<number>(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
    degree[u]++;
    degree[v]++;
  }

  // 拓扑剥叶子：度数为 1 的节点依次入队，剩下的就是环节点
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (degree[i] === 1) queue.push(i);
  }
  const onCycle = new Array<boolean>(n).fill(true);
  while (queue.length > 0) {
    const u = queue.shift()!;
    onCycle[u] = false;
    for (const v of adj[u]) {
      if (onCycle[v]) {
        degree[v]--;
        if (degree[v] === 1) queue.push(v);
      }
    }
  }

  // 多源 BFS：所有环上节点距离为 0，向外扩散
  const dist = new Array<number>(n).fill(-1);
  const bfs: number[] = [];
  for (let i = 0; i < n; i++) {
    if (onCycle[i]) {
      dist[i] = 0;
      bfs.push(i);
    }
  }
  let head = 0;
  while (head < bfs.length) {
    const u = bfs[head++];
    for (const v of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        bfs.push(v);
      }
    }
  }
  return dist;
}

// 方法2：DFS 找环 + BFS 求距离（参考实现）
// 利用 parent 数组在 DFS 中检测回边，找到环上所有节点后再多源 BFS。
function distanceToCycleDFS(n: number, edges: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const parent = new Array<number>(n).fill(-1);
  const visited = new Array<boolean>(n).fill(false);
  let cycleStart = -1;
  let cycleEnd = -1;

  const dfs = (u: number, p: number): boolean => {
    visited[u] = true;
    parent[u] = p;
    for (const v of adj[u]) {
      if (v === p) continue;
      if (visited[v]) {
        cycleStart = v;
        cycleEnd = u;
        return true;
      }
      if (dfs(v, u)) return true;
    }
    return false;
  };
  dfs(0, -1);

  // 从 cycleEnd 回溯到 cycleStart 得到环
  const onCycle = new Set<number>();
  onCycle.add(cycleStart);
  let cur = cycleEnd;
  while (cur !== cycleStart) {
    onCycle.add(cur);
    cur = parent[cur];
  }

  const dist = new Array<number>(n).fill(-1);
  const queue: number[] = [];
  for (const node of onCycle) {
    dist[node] = 0;
    queue.push(node);
  }
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    for (const v of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return dist;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 无向图中到环的距离 =====");
console.log(
  distanceToCycle(7, [
    [1, 2],
    [2, 0],
    [0, 3],
    [3, 4],
    [4, 0],
    [5, 6],
    [6, 3],
  ]),
);
// 环为 0-2-3-4-0，期望距离: [0,1,1,0,0,3,2] （顺序可能不同，节点 0,3,4 在环上）

console.log(
  distanceToCycle(9, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 2],
    [6, 0],
    [7, 6],
    [8, 7],
  ]),
);
// 环为 2-3-4-5-2

console.log(
  distanceToCycleDFS(7, [
    [1, 2],
    [2, 0],
    [0, 3],
    [3, 4],
    [4, 0],
    [5, 6],
    [6, 3],
  ]),
);

export {};
