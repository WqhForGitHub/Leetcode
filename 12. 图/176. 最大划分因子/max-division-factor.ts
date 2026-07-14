// 176. 最大划分因子
// 自定义题：n 节点无向图，将节点划分为两组，使跨组边数最大（最大割问题）。
// 思路：小规模状压枚举；大规模贪心局部搜索。

type Edge = [number, number];

function maxCutBruteForce(n: number, edges: Edge[]): number {
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let cut = 0;
    for (const [u, v] of edges) {
      if (((mask >> u) & 1) !== ((mask >> v) & 1)) cut++;
    }
    best = Math.max(best, cut);
  }
  return best;
}

function maxCutGreedy(n: number, edges: Edge[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const group = new Array(n).fill(0);
  if (n > 0) group[0] = 1;
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < n; i++) {
      let same = 0;
      let diff = 0;
      for (const nb of adj[i]) {
        if (group[nb] === group[i]) same++;
        else diff++;
      }
      if (same > diff) {
        group[i] ^= 1;
        improved = true;
      }
    }
  }
  let cut = 0;
  for (const [u, v] of edges) {
    if (group[u] !== group[v]) cut++;
  }
  return cut;
}

// 测试
console.log(
  maxCutBruteForce(3, [
    [0, 1],
    [1, 2],
    [0, 2],
  ]),
); // 期望 2
console.log(
  maxCutGreedy(3, [
    [0, 1],
    [1, 2],
    [0, 2],
  ]),
); // 期望 2
console.log(maxCutBruteForce(2, [[0, 1]])); // 期望 1
console.log(
  maxCutGreedy(4, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2],
  ]),
); // 期望 4

export {};
