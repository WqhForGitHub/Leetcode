// ============================================================
// 051. 阈值距离内邻居最少的城市
// ============================================================
// LeetCode 1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance
// n 个城市，带权有向边 edges 与阈值 distanceThreshold，返回在阈值距离内邻居最少的城市，
// 若有多个则返回编号最大的那个。
// 时间复杂度：Floyd O(n^3)；Dijkstra O(n * (E log V))

// ============================================================
// 方法1：Floyd-Warshall（推荐）
// 时间复杂度：O(n^3)，空间复杂度：O(n^2)
// ============================================================
function findTheCityFloyd(n: number, edges: number[][], distanceThreshold: number): number {
  const INF = Number.POSITIVE_INFINITY;
  // dist[i][j] 表示 i 到 j 的最短距离
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    dist[u][v] = w;
    dist[v][u] = w; // 无向图（题目视为双向可达）
  }

  // Floyd 三重循环
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k][j] === INF) continue;
        const nd = dist[i][k] + dist[k][j];
        if (nd < dist[i][j]) dist[i][j] = nd;
      }
    }
  }

  let ans = -1;
  let minCount = n + 1;
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] <= distanceThreshold) count++;
    }
    // 邻居更少，或同样少但编号更大
    if (count < minCount || (count === minCount && i > ans)) {
      minCount = count;
      ans = i;
    }
  }
  return ans;
}

// ============================================================
// 方法2：Dijkstra（对每个城市）
// 时间复杂度：O(n * E log V)，空间复杂度：O(n^2)
// ============================================================
function findTheCityDijkstra(n: number, edges: number[][], distanceThreshold: number): number {
  type Edge = { to: number; w: number };
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push({ to: v, w });
    adj[v].push({ to: u, w });
  }

  // 最小堆：[距离, 节点]
  const dijkstra = (src: number): number => {
    const dist = new Array(n).fill(Number.POSITIVE_INFINITY);
    dist[src] = 0;
    const heap: [number, number][] = [[0, src]];
    let count = 0;
    while (heap.length > 0) {
      // 取堆顶（线性扫描最小，简单实现）
      let minIdx = 0;
      for (let i = 1; i < heap.length; i++) {
        if (heap[i][0] < heap[minIdx][0]) minIdx = i;
      }
      const [d, u] = heap[minIdx];
      heap.splice(minIdx, 1);
      if (d > dist[u]) continue;
      if (u !== src && d <= distanceThreshold) count++;
      for (const e of adj[u]) {
        const nd = d + e.w;
        if (nd < dist[e.to]) {
          dist[e.to] = nd;
          heap.push([nd, e.to]);
        }
      }
    }
    return count;
  };

  let ans = -1;
  let minCount = n + 1;
  for (let i = 0; i < n; i++) {
    const c = dijkstra(i);
    if (c < minCount || (c === minCount && i > ans)) {
      minCount = c;
      ans = i;
    }
  }
  return ans;
}

// 统一入口
function findTheCity(n: number, edges: number[][], distanceThreshold: number): number {
  return findTheCityFloyd(n, edges, distanceThreshold);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 051. 阈值距离内邻居最少的城市 =====");
// 测试1: n=4, edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]], threshold=4 -> 3
console.log(findTheCity(4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4)); // 期望 3
console.log(findTheCityDijkstra(4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4)); // 期望 3
// 测试2: n=5, edges=[[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], threshold=2 -> 0
console.log(findTheCity(5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2)); // 期望 0
console.log(findTheCityDijkstra(5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2)); // 期望 0

export {};
