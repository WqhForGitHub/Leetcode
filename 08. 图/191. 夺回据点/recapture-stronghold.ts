// ============================================================
// 191. 夺回据点
// ============================================================
// 自定义题：n 节点有向图 edges，从 0 出发能到达所有据点的最少需修复边数。
// "修复边" 指添加原本缺失的有向边，使 0 能到达所有节点。
// 等价于：以 0 为起点的可达性补全问题。
// 思路：并查集 + 贪心 / BFS 可达统计。
// 时间复杂度：O(N + E·α(N))

// 方法1：BFS 可达统计 + 贪心补边
// 思路：先从 0 出发 BFS 找出当前可达集；对每个不可达节点，
// 贪心地补一条 0 -> 该节点 的边即可（最少边数 = 不可达节点数）。
function recaptureStrongholdBFS(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);

  const visited: boolean[] = new Array(n).fill(false);
  const queue: number[] = [0];
  visited[0] = true;
  let reachable = 1;
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        reachable++;
        queue.push(v);
      }
    }
  }
  // 不可达节点都需要补一条从 0 出发的边来修复
  return n - reachable;
}

// 方法2：并查集 + 贪心（将 0 视为根，统计未被 0 连通分量覆盖的节点数）
// 思路：用并查集合并所有边，统计与 0 不同根的节点数（每个需补一条边）。
// 注意：并查集对有向图仅作弱连通近似，这里假设补边可直达。
function recaptureStrongholdUF(n: number, edges: number[][]): number {
  const parent: number[] = Array.from({ length: n }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    parent[find(x)] = find(y);
  }

  for (const [u, v] of edges) union(u, v);

  const root0 = find(0);
  let need = 0;
  for (let i = 0; i < n; i++) {
    if (find(i) !== root0) need++;
  }
  return need;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 191. 夺回据点 =====");

// 0 -> 1 -> 2, 节点 3 不可达
console.log(
  recaptureStrongholdBFS(4, [
    [0, 1],
    [1, 2],
  ]),
); // 期望: 1
// 全连通
console.log(
  recaptureStrongholdBFS(3, [
    [0, 1],
    [1, 2],
  ]),
); // 期望: 0
// 只有 0，无可达
console.log(recaptureStrongholdBFS(5, [])); // 期望: 4

console.log(
  recaptureStrongholdUF(4, [
    [0, 1],
    [1, 2],
  ]),
); // 期望: 1
console.log(
  recaptureStrongholdUF(3, [
    [0, 1],
    [1, 2],
  ]),
); // 期望: 0
console.log(recaptureStrongholdUF(5, [])); // 期望: 4

export {};
