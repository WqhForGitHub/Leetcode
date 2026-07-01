// ============================================================
// 007. 最小高度树
// ============================================================
// LeetCode 310. Minimum Height Trees
// n 个节点无向树，返回能构成最小高度树的所有根节点。即拓扑剥叶子直到剩 1-2 个中心。
// 时间复杂度：O(V + E)，空间复杂度：O(V + E)

// 方法1：BFS 拓扑剥叶子法（推荐）
// 类似拓扑排序，从叶子(度=1)开始层层剥离，最后剩 1 或 2 个节点即为答案（树的重心）。
function findMinHeightTrees(n: number, edges: number[][]): number[] {
  if (n === 1) return [0];
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  for (const [u, v] of edges) {
    adj[u].add(v);
    adj[v].add(u);
  }
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) {
    if (adj[i].size === 1) leaves.push(i);
  }
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const next: number[] = [];
    for (const leaf of leaves) {
      const neighbor = adj[leaf].values().next().value as number;
      adj[neighbor].delete(leaf);
      if (adj[neighbor].size === 1) next.push(neighbor);
    }
    leaves = next;
  }
  return leaves;
}

// 方法2：暴力 BFS 求每个节点高度（对照，O(n^2)）
function findMinHeightTreesBrute(n: number, edges: number[][]): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const bfsHeight = (root: number): number => {
    const visited = new Array(n).fill(false);
    const queue: Array<[number, number]> = [[root, 0]];
    visited[root] = true;
    let h = 0;
    while (queue.length > 0) {
      const [u, d] = queue.shift()!;
      h = Math.max(h, d);
      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push([v, d + 1]);
        }
      }
    }
    return h;
  };
  let minH = Infinity;
  const heights: number[] = [];
  for (let i = 0; i < n; i++) {
    const h = bfsHeight(i);
    heights.push(h);
    minH = Math.min(minH, h);
  }
  const res: number[] = [];
  for (let i = 0; i < n; i++) {
    if (heights[i] === minH) res.push(i);
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 最小高度树 =====");
console.log(
  "剥叶子:",
  findMinHeightTrees(4, [
    [1, 0],
    [1, 2],
    [1, 3],
  ]),
); // 期望 [1]
console.log(
  "暴力:",
  findMinHeightTreesBrute(4, [
    [1, 0],
    [1, 2],
    [1, 3],
  ]),
); // 期望 [1]
console.log(
  "剥叶子:",
  findMinHeightTrees(6, [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 4],
    [5, 4],
  ]),
); // 期望 [3, 4]
console.log(
  "暴力:",
  findMinHeightTreesBrute(6, [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 4],
    [5, 4],
  ]),
); // 期望 [3, 4]
console.log("剥叶子:", findMinHeightTrees(1, [])); // 期望 [0]

export {};
