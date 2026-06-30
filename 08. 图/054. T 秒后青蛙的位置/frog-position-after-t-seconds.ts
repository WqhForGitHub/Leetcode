// ============================================================
// 054. T 秒后青蛙的位置
// ============================================================
// LeetCode 1377. Frog Position After T Seconds
// 无向树（n 个节点，编号 1..n），青蛙从 1 出发，每秒等概率跳到一个未访问的子节点。
// 若到达 target 且时间未到 T 但已无未访问子节点，则停在 target；
// 若到达 target 时仍有未访问子节点且时间未到 T，则概率变 0。
// 返回 T 秒后青蛙在 target 的概率。
// 时间复杂度：O(n)，空间复杂度：O(n)

// ============================================================
// 方法1：DFS（带概率传递，推荐）
// 时间复杂度：O(n)，空间复杂度：O(n)
// ============================================================
function frogPositionDFS(n: number, edges: number[][], t: number, target: number): number {
  // 建邻接表
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // 返回以 curr（父节点为 parent）出发、剩余时间 remain、当前概率 prob 时，
  // 恰好 T 秒在 target 的概率；-1 表示不可能
  const dfs = (curr: number, parent: number, remain: number, prob: number): number => {
    // 计算未访问子节点数（父节点已访问）
    const children = adj[curr].filter((x) => x !== parent);
    if (curr === target) {
      // 到达 target
      if (remain === 0) return prob; // 恰好 T 秒
      if (children.length === 0) return prob; // 时间还有剩但无路可走，停在此
      // 还有子节点可走，且时间未到 -> 必须继续跳，概率变 0
      return 0;
    }
    if (remain === 0) return 0; // 时间用完且未到 target
    if (children.length === 0) return 0; // 无路可走但未到 target
    // 等概率分到每个子节点
    const nextProb = prob / children.length;
    for (const child of children) {
      const r = dfs(child, curr, remain - 1, nextProb);
      if (r > 0) return r;
    }
    return 0;
  };

  return dfs(1, -1, t, 1);
}

// ============================================================
// 方法2：BFS（按层遍历，记录概率）
// 时间复杂度：O(n)，空间复杂度：O(n)
// ============================================================
function frogPositionBFS(n: number, edges: number[][], t: number, target: number): number {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  // visited/prob/parent
  const prob = new Array(n + 1).fill(0);
  const parent = new Array(n + 1).fill(-1);
  const visited = new Array(n + 1).fill(false);
  prob[1] = 1;
  visited[1] = true;
  parent[1] = -1;

  // 队列存当前层节点
  let queue: number[] = [1];
  let time = 0;
  while (queue.length > 0 && time < t) {
    const nextQueue: number[] = [];
    for (const u of queue) {
      // 未访问子节点数
      const unvisited = adj[u].filter((x) => !visited[x]);
      if (unvisited.length === 0) continue; // 停在此（叶子）
      const p = prob[u] / unvisited.length;
      for (const v of unvisited) {
        visited[v] = true;
        parent[v] = u;
        prob[v] = p;
        prob[u] = 0; // 青蛙一旦跳走，原节点概率清零
        nextQueue.push(v);
      }
    }
    queue = nextQueue;
    time++;
  }
  // time === t：target 在第 t 层 -> 概率；或 target 是叶子且更早到达（prob 保留）
  return prob[target];
}

// 统一入口
function frogPosition(n: number, edges: number[][], t: number, target: number): number {
  return frogPositionDFS(n, edges, t, target);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. T 秒后青蛙的位置 =====");
// 测试1: n=7, edges=[[1,2],[1,3],[1,7],[2,4],[2,6],[3,5]], t=2, target=4 -> 0.166666...
console.log(frogPosition(7, [[1, 2], [1, 3], [1, 7], [2, 4], [2, 6], [3, 5]], 2, 4)); // 期望 1/6 ≈ 0.16666666666666666
console.log(frogPositionBFS(7, [[1, 2], [1, 3], [1, 7], [2, 4], [2, 6], [3, 5]], 2, 4)); // 期望 1/6
// 测试2: n=7, 同上, t=1, target=7 -> 0.333333...
console.log(frogPosition(7, [[1, 2], [1, 3], [1, 7], [2, 4], [2, 6], [3, 5]], 1, 7)); // 期望 1/3
// 测试3: n=7, 同上, t=20, target=6 -> 0.166666...（叶子提前到达）
console.log(frogPosition(7, [[1, 2], [1, 3], [1, 7], [2, 4], [2, 6], [3, 5]], 20, 6)); // 期望 1/6
console.log(frogPositionBFS(7, [[1, 2], [1, 3], [1, 7], [2, 4], [2, 6], [3, 5]], 20, 6)); // 期望 1/6
// 测试4: n=3, edges=[[2,1],[3,2]], t=1, target=2 -> 1（从1只能跳到2... 注意根为1）
// 此例图：1-2-3，根1，t=1只能跳到2，概率1
console.log(frogPosition(3, [[2, 1], [3, 2]], 1, 2)); // 期望 1

export {};
