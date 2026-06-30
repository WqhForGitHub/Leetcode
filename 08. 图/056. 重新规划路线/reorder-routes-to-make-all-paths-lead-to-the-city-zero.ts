// ============================================================
// 056. 重新规划路线
// ============================================================
// LeetCode 1466. Reorder Routes to Make All Paths Lead to the City Zero
// n 个城市，connections 为有向边 [a,b]（a->b）。求最少反转多少条边，使所有城市都能到达城市 0。
// 时间复杂度：O(n)，空间复杂度：O(n)

// ============================================================
// 方法1：以 0 为根 DFS（推荐）
// 时间复杂度：O(n)，空间复杂度：O(n)
// 建无向图，但记录原始方向；从 0 出发 DFS，若遍历边方向与"指向子节点"一致（即原方向 a->b），
// 则需反转，计数 +1。
// ============================================================
function minReorderDFS(n: number, connections: number[][]): number {
  // 邻接表元素 [邻居, 是否为原始方向（true 表示 from->to 即需反转）]
  type Edge = { to: number; needFlip: boolean };
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) {
    adj[a].push({ to: b, needFlip: true }); // 原方向 a->b，从 a 走向 b 需反转
    adj[b].push({ to: a, needFlip: false }); // 反向走，无需反转
  }

  let flips = 0;
  const visited = new Array(n).fill(false);
  const dfs = (u: number): void => {
    visited[u] = true;
    for (const e of adj[u]) {
      if (visited[e.to]) continue;
      if (e.needFlip) flips++;
      dfs(e.to);
    }
  };
  dfs(0);
  return flips;
}

// ============================================================
// 方法2：BFS
// 时间复杂度：O(n)，空间复杂度：O(n)
// ============================================================
function minReorderBFS(n: number, connections: number[][]): number {
  type Edge = { to: number; needFlip: boolean };
  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) {
    adj[a].push({ to: b, needFlip: true });
    adj[b].push({ to: a, needFlip: false });
  }

  let flips = 0;
  const visited = new Array(n).fill(false);
  visited[0] = true;
  const queue: number[] = [0];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const e of adj[u]) {
      if (visited[e.to]) continue;
      visited[e.to] = true;
      if (e.needFlip) flips++;
      queue.push(e.to);
    }
  }
  return flips;
}

// 统一入口
function minReorder(n: number, connections: number[][]): number {
  return minReorderDFS(n, connections);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 重新规划路线 =====");
// 测试1: n=6, connections=[[0,1],[1,3],[2,3],[4,0],[5,4]] -> 2
// 翻转 0->1 与 1->3 后：2->3->1->0，所有城市均可到达 0
console.log(minReorder(6, [[0, 1], [1, 3], [2, 3], [4, 0], [5, 4]])); // 期望 2
console.log(minReorderBFS(6, [[0, 1], [1, 3], [2, 3], [4, 0], [5, 4]])); // 期望 2
// 测试2: n=5, connections=[[1,0],[1,2],[3,2],[3,4]] -> 2
console.log(minReorder(5, [[1, 0], [1, 2], [3, 2], [3, 4]])); // 期望 2
// 测试3: n=3, connections=[[1,0],[2,0]] -> 0
console.log(minReorder(3, [[1, 0], [2, 0]])); // 期望 0
console.log(minReorderBFS(3, [[1, 0], [2, 0]])); // 期望 0

export {};
