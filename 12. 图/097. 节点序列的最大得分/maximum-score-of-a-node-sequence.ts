// ============================================================
// 097. 节点序列的最大得分
// ============================================================
// LeetCode 2242. Maximum Score of a Node Sequence
// n 节点带权 scores，无向边。长度 4 的节点序列（节点不重复且相邻有边）的最大得分（4 节点权值和）。
// 方法：枚举中间边 (a,b)，对 a 取除 b 外最大的若干邻居，对 b 取除 a 外最大的若干邻居，组合。
// 时间复杂度：O(E * k^2)（k 取 3 即可），空间复杂度：O(n * k)

function maximumScore(scores: number[], edges: number[][]): number {
  const n = scores.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  // 每个节点只保留得分最大的 3 个邻居（足以覆盖最优 4 序列）
  for (let i = 0; i < n; i++) {
    adj[i].sort((a, b) => scores[b] - scores[a]);
    if (adj[i].length > 3) adj[i] = adj[i].slice(0, 3);
  }

  let ans = -1;
  for (const [a, b] of edges) {
    // 在 a 的邻居中取 x（≠ b），在 b 的邻居中取 y（≠ a, ≠ x），使 scores[x]+scores[y] 最大
    for (const x of adj[a]) {
      if (x === b) continue;
      for (const y of adj[b]) {
        if (y === a || y === x) continue;
        const total = scores[a] + scores[b] + scores[x] + scores[y];
        if (total > ans) ans = total;
      }
    }
  }
  return ans;
}

// 方法2：暴力枚举所有边并使用完整邻居集合（适用于稠密图，E 较大时较慢）
function maximumScoreBrute(scores: number[], edges: number[][]): number {
  const n = scores.length;
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  for (const [u, v] of edges) {
    adj[u].add(v);
    adj[v].add(u);
  }
  let ans = -1;
  for (const [a, b] of edges) {
    for (const x of adj[a]) {
      if (x === a || x === b) continue;
      for (const y of adj[b]) {
        if (y === a || y === b || y === x) continue;
        const total = scores[a] + scores[b] + scores[x] + scores[y];
        if (total > ans) ans = total;
      }
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 节点序列的最大得分 =====");
console.log(
  maximumScore(
    [5, 2, 9, 8, 4],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  ),
); // 期望: 24（序列 0-1-2-3: 5+2+9+8=24）

console.log(
  maximumScore(
    [9, 20, 6, 4, 11, 12],
    [
      [0, 3],
      [5, 3],
      [2, 4],
      [1, 3],
    ],
  ),
); // 期望: -1（无边可形成长度 4 序列）

console.log(
  maximumScoreBrute(
    [5, 2, 9, 8, 4],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  ),
); // 期望: 24

export {};
