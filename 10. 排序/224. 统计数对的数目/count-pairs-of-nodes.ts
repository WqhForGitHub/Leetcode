// ============================================================
// 224. 统计数对的数目
// ============================================================
// LeetCode 1782. Count Pairs Of Nodes
// 给定 n 个节点的无向图（边可能有重复），和若干查询 queries。
// 对每个查询 query，统计满足 u < v 且 degree(u) + degree(v) - cnt(u,v) > query
// 的节点对数，其中 cnt(u,v) 为 u 与 v 之间边的条数。

// 方法1：度数 + 去重边 + 排序度数 + 双指针 + 减去直连边对
// 1) 统计每点度数（含重复边）与每对节点间的边数。
// 2) 度数排序后用双指针统计 deg[u]+deg[v] > query 的对数。
// 3) 减去那些 deg[u]+deg[v] > query 但 deg[u]+deg[v]-cnt <= query 的直连边对。
function countPairs1(n: number, edges: number[][], queries: number[]): number[] {
  const degree = new Array<number>(n + 1).fill(0);
  const edgeCount = new Map<string, number>();
  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    const key = u < v ? u + "," + v : v + "," + u;
    edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1);
  }
  const sortedDeg = degree.slice(1).sort((a, b) => a - b);

  const ans: number[] = [];
  for (const q of queries) {
    let total = 0;
    let left = 0;
    let right = n - 1;
    while (left < right) {
      if (sortedDeg[left] + sortedDeg[right] > q) {
        total += right - left;
        right--;
      } else {
        left++;
      }
    }
    for (const [key, cnt] of edgeCount) {
      const parts = key.split(",");
      const u = Number(parts[0]);
      const v = Number(parts[1]);
      const sum = degree[u] + degree[v];
      if (sum > q && sum - cnt <= q) total--;
    }
    ans.push(total);
  }
  return ans;
}

// 方法2：度数 + 排序 + 二分查找
// 思路同方法1，但统计 deg[u]+deg[v] > query 时改为对每个 i 二分查找
// 满足 deg[j] > query - deg[i] 的最小 j（j > i），再累加个数。
function countPairs2(n: number, edges: number[][], queries: number[]): number[] {
  const degree = new Array<number>(n + 1).fill(0);
  const edgeCount = new Map<string, number>();
  for (const [u, v] of edges) {
    degree[u]++;
    degree[v]++;
    const key = u < v ? u + "," + v : v + "," + u;
    edgeCount.set(key, (edgeCount.get(key) ?? 0) + 1);
  }
  const sortedDeg = degree.slice(1).sort((a, b) => a - b);

  const ans: number[] = [];
  for (const q of queries) {
    let total = 0;
    for (let i = 0; i < n; i++) {
      const need = q - sortedDeg[i];
      let lo = i + 1;
      let hi = n;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (sortedDeg[mid] > need) hi = mid;
        else lo = mid + 1;
      }
      total += n - lo;
    }
    for (const [key, cnt] of edgeCount) {
      const parts = key.split(",");
      const u = Number(parts[0]);
      const v = Number(parts[1]);
      const sum = degree[u] + degree[v];
      if (sum > q && sum - cnt <= q) total--;
    }
    ans.push(total);
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 224. 统计数对的数目 =====");
const edges1 = [
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 4],
  [4, 2],
];
console.log("方法1 n=4 queries=[2,3]:", JSON.stringify(countPairs1(4, edges1, [2, 3]))); // [6,5]
console.log("方法2 n=4 queries=[2,3]:", JSON.stringify(countPairs2(4, edges1, [2, 3]))); // [6,5]

const edges2 = [
  [1, 5],
  [1, 5],
  [3, 4],
  [2, 5],
  [1, 3],
  [5, 1],
  [2, 3],
  [2, 5],
];
console.log("方法1 n=5 queries=[1..5]:", JSON.stringify(countPairs1(5, edges2, [1, 2, 3, 4, 5]))); // [10,10,9,8,6]
console.log("方法2 n=5 queries=[1..5]:", JSON.stringify(countPairs2(5, edges2, [1, 2, 3, 4, 5]))); // [10,10,9,8,6]

export {};
