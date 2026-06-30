// ============================================================
// 065. 最大网络秩
// ============================================================
// LeetCode 1615. Maximal Network Rank
// n 个城市，roads 为无向道路。两城市的网络秩 = 各自度数之和，若两城直接相连则减 1。
// 返回任意两城市的最大网络秩。
// 时间复杂度：O(n^2 + e)，空间复杂度：O(n^2)

// ============================================================
// 方法1：度数数组 + 邻接集合（推荐）
// ============================================================
function maximalNetworkRank1(n: number, roads: number[][]): number {
  const degree = new Array<number>(n).fill(0);
  // 用邻接矩阵记录是否直接相连
  const connected: boolean[][] = Array.from({ length: n }, () =>
    new Array<boolean>(n).fill(false),
  );
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
    connected[a][b] = true;
    connected[b][a] = true;
  }

  let maxRank = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let rank = degree[i] + degree[j];
      if (connected[i][j]) rank--;
      maxRank = Math.max(maxRank, rank);
    }
  }
  return maxRank;
}

// ============================================================
// 方法2：邻接表 + Set（暴力枚举城市对）
// ============================================================
function maximalNetworkRank2(n: number, roads: number[][]): number {
  const adj = new Map<number, Set<number>>();
  for (let i = 0; i < n; i++) adj.set(i, new Set());
  for (const [a, b] of roads) {
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  }

  let maxRank = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const di = adj.get(i)!.size;
      const dj = adj.get(j)!.size;
      let rank = di + dj;
      if (adj.get(i)!.has(j)) rank--;
      maxRank = Math.max(maxRank, rank);
    }
  }
  return maxRank;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 最大网络秩 =====");
console.log(
  maximalNetworkRank1(4, [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 3],
  ]),
);
// 期望: 4
console.log(
  maximalNetworkRank1(5, [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
  ]),
);
// 期望: 5
console.log(
  maximalNetworkRank2(8, [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
    [5, 6],
    [5, 7],
  ]),
);
// 期望: 5

export {};
