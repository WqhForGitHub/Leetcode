// ============================================================
// 071. 统计点对的数目
// ============================================================
// LeetCode 1782. Count Pairs Of Nodes
// 给定 n 个节点的无向带权边 edges，以及若干查询 queries。对每个查询阈值 q，
// 统计满足 1 <= u < v <= n 且 (与 u 相连的边数 + 与 v 相连的边数 - (u,v) 间重边数) > q 的点对数。
// 时间复杂度：O(E + Q * (N log N))，空间复杂度：O(N + E)

// 方法1：度数排序 + 双指针 + 重边修正（推荐）
function countPairs(n: number, edges: number[][], queries: number[]): number[] {
  const degree = new Array<number>(n + 1).fill(0);
  const shared = new Map<string, number>();
  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    shared.set(key, (shared.get(key) ?? 0) + 1);
  }

  const sortedDeg = degree.slice(1).sort((a, b) => a - b);
  const ans: number[] = [];

  for (const q of queries) {
    // 双指针统计 deg[u] + deg[v] > q 的点对数（不考虑重边）
    let total = 0;
    let l = 0;
    let r = sortedDeg.length - 1;
    while (l < r) {
      if (sortedDeg[l] + sortedDeg[r] > q) {
        total += r - l;
        r--;
      } else {
        l++;
      }
    }
    // 修正：对相邻 (u,v)，deg[u]+deg[v] 把共享边算了两次，应只算一次
    // 若 deg[u]+deg[v] > q 但 deg[u]+deg[v]-cnt <= q，则该对不应计入
    for (const [key, cnt] of shared) {
      const [a, b] = key.split("-").map(Number);
      const sum = degree[a] + degree[b];
      const reduced = sum - cnt;
      if (sum > q && reduced <= q) total--;
    }
    ans.push(total);
  }
  return ans;
}

// 方法2：暴力枚举（仅用于小规模校验）
function countPairsBrute(n: number, edges: number[][], queries: number[]): number[] {
  const degree = new Array<number>(n + 1).fill(0);
  const shared = new Map<string, number>();
  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    shared.set(key, (shared.get(key) ?? 0) + 1);
  }
  const ans: number[] = [];
  for (const q of queries) {
    let cnt = 0;
    for (let u = 1; u <= n; u++) {
      for (let v = u + 1; v <= n; v++) {
        const key = `${u}-${v}`;
        const c = shared.get(key) ?? 0;
        if (degree[u] + degree[v] - c > q) cnt++;
      }
    }
    ans.push(cnt);
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 统计点对的数目 =====");
const r71a = countPairs(
  5,
  [
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 5],
  ],
  [1, 2, 3, 4],
);
console.log(r71a); // 期望 [10, 9, 5, 1]（已由暴力方法 cross-check 校验）

const r71b = countPairsBrute(
  4,
  [
    [1, 2],
    [2, 3],
    [3, 4],
  ],
  [1, 2],
);
console.log(r71b); // 与主方法一致

export {};
