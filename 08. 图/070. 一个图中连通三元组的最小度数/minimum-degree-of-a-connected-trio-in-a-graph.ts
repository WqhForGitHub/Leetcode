// ============================================================
// 070. 一个图中连通三元组的最小度数
// ============================================================
// LeetCode 1761. Minimum Degree of a Connected Trio in a Graph
// n 个节点，edges 为无向边。找连通三元组（两两相连）的最小度数，
// 度数 = 三节点度数之和 - 6。
// 时间复杂度：O(n^3) 或 O(sum(度数^2))，空间复杂度：O(n^2)

// ============================================================
// 方法1：邻接矩阵 + 度数数组，枚举三元组（推荐）
// ============================================================
function minTrioDegree1(n: number, edges: number[][]): number {
  // 邻接矩阵 + 度数
  const adj: boolean[][] = Array.from({ length: n + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  const degree = new Array<number>(n + 1).fill(0);
  for (const [u, v] of edges) {
    adj[u][v] = true;
    adj[v][u] = true;
    degree[u]++;
    degree[v]++;
  }

  let minDegree = Infinity;
  // 枚举 i < j < k，若两两相连则为三元组
  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      if (!adj[i][j]) continue;
      for (let k = j + 1; k <= n; k++) {
        if (adj[i][k] && adj[j][k]) {
          const d = degree[i] + degree[j] + degree[k] - 6;
          minDegree = Math.min(minDegree, d);
        }
      }
    }
  }
  return minDegree === Infinity ? -1 : minDegree;
}

// ============================================================
// 方法2：邻接表 + 集合，按公共邻居枚举
// ============================================================
function minTrioDegree2(n: number, edges: number[][]): number {
  const adj = new Map<number, Set<number>>();
  const degree = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) adj.set(i, new Set());
  for (const [u, v] of edges) {
    adj.get(u)!.add(v);
    adj.get(v)!.add(u);
    degree[u]++;
    degree[v]++;
  }

  let minDegree = Infinity;
  // 对每条边 (i, j)，找公共邻居 k 构成三元组
  for (let i = 1; i <= n; i++) {
    const neighbors = Array.from(adj.get(i)!).filter((x) => x > i);
    for (let a = 0; a < neighbors.length; a++) {
      for (let b = a + 1; b < neighbors.length; b++) {
        const j = neighbors[a];
        const k = neighbors[b];
        if (adj.get(j)!.has(k)) {
          const d = degree[i] + degree[j] + degree[k] - 6;
          minDegree = Math.min(minDegree, d);
        }
      }
    }
  }
  return minDegree === Infinity ? -1 : minDegree;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 一个图中连通三元组的最小度数 =====");
console.log(
  minTrioDegree1(6, [
    [1, 2],
    [1, 3],
    [3, 2],
    [4, 1],
    [5, 2],
    [3, 6],
  ]),
);
// 期望: 3 （三元组 {1,2,3}，度数 3+3+3-6=3）
console.log(
  minTrioDegree1(7, [
    [1, 3],
    [4, 1],
    [4, 3],
    [2, 5],
    [5, 6],
    [6, 7],
    [7, 5],
    [2, 6],
  ]),
);
// 期望: 0 （三元组 {1,3,4} 度数 2+2+2-6=0）
console.log(
  minTrioDegree2(6, [
    [1, 2],
    [1, 3],
    [3, 2],
    [4, 1],
    [5, 2],
    [3, 6],
  ]),
);
// 期望: 3

export {};
