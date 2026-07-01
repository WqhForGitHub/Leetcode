// ============================================================
// 035. 移除最多的同行或同列石头
// ============================================================
// LeetCode 947. Most Stones Removed with Same Row or Column
// 二维平面上若干石头，同行或同列的石头视为连通。可不断移除石头，
// 直到每个连通分量只剩一个石头。求最多能移除多少个。
// 时间复杂度：O(N)，空间复杂度：O(N)

class UnionFind {
  parent: Map<number, number>;
  constructor() {
    this.parent = new Map();
  }
  find(x: number): number {
    if (!this.parent.has(x)) this.parent.set(x, x);
    while (this.parent.get(x)! !== x) {
      this.parent.set(x, this.parent.get(this.parent.get(x)!)!);
      x = this.parent.get(x)!;
    }
    return x;
  }
  union(a: number, b: number): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

// 方法1：并查集（同行同列合并）（推荐）
// 思路：把"行号 x"与"列号 y + 偏移"作为节点，每块石头将其所在行与列合并。
// 连通分量数 = 不同根的数量；最多移除 = 石头总数 - 连通分量数。
function removeStonesUF(stones: number[][]): number {
  const OFFSET = 10001; // 区分行号与列号命名空间
  const uf = new UnionFind();
  for (const [x, y] of stones) {
    uf.union(x, y + OFFSET);
  }
  const roots = new Set<number>();
  for (const [x, y] of stones) {
    roots.add(uf.find(x)); // find(y+OFFSET) 同根
  }
  return stones.length - roots.size;
}

// 方法2：DFS 求连通分量
// 思路：把每块石头作为节点，同行或同列的石头连边，DFS 数连通分量数。
function removeStonesDFS(stones: number[][]): number {
  const n = stones.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (stones[i][0] === stones[j][0] || stones[i][1] === stones[j][1]) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }
  const visited = new Array(n).fill(false);
  let components = 0;
  function dfs(u: number): void {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
  }
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      components++;
      dfs(i);
    }
  }
  return n - components;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. 移除最多的同行或同列石头 =====");
console.log(
  "UF:",
  removeStonesUF([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [2, 2],
  ]),
); // 期望 5
console.log(
  "UF:",
  removeStonesUF([
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ]),
); // 期望 3
console.log("UF:", removeStonesUF([[0, 0]])); // 期望 0
console.log(
  "DFS:",
  removeStonesDFS([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [2, 2],
  ]),
); // 期望 5
console.log(
  "DFS:",
  removeStonesDFS([
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ]),
); // 期望 3
console.log("DFS:", removeStonesDFS([[0, 0]])); // 期望 0

export {};
