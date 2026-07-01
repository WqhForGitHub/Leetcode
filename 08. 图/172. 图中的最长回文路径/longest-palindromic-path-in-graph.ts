// 172. 图中的最长回文路径
// 自定义题：n 节点无向图，每个节点带字符 label，求最长简单路径，
// 使路径上节点字符序列构成回文。
// 思路：状压 DP，从中心（奇/偶）向两端对称扩展。

type Edge = [number, number];

function buildAdj(n: number, edges: Edge[]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

function popcount(x: number): number {
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}

function longestPalindromicPath(n: number, labels: string, edges: Edge[]): number {
  if (n === 0) return 0;
  const adj = buildAdj(n, edges);
  const encode = (mask: number, i: number, j: number): number => (mask << 8) | (i << 4) | j; // 适用于 n <= 16
  let cur = new Set<number>();
  let best = 1;
  // 奇数长度中心：单节点
  for (let i = 0; i < n; i++) {
    cur.add(encode(1 << i, i, i));
  }
  // 偶数长度中心：相邻同字符节点对
  for (let i = 0; i < n; i++) {
    for (const j of adj[i]) {
      if (j > i && labels[i] === labels[j]) {
        cur.add(encode((1 << i) | (1 << j), i, j));
        best = 2;
      }
    }
  }
  while (cur.size > 0) {
    const next = new Set<number>();
    for (const key of cur) {
      const mask = key >>> 8;
      const i = (key >>> 4) & 0xf;
      const j = key & 0xf;
      best = Math.max(best, popcount(mask));
      for (const a of adj[i]) {
        if (mask & (1 << a)) continue;
        for (const b of adj[j]) {
          if (b === a) continue;
          if (mask & (1 << b)) continue;
          if (labels[a] !== labels[b]) continue;
          next.add(encode(mask | (1 << a) | (1 << b), a, b));
        }
      }
    }
    cur = next;
  }
  return best;
}

// 测试
console.log(
  longestPalindromicPath(4, "abba", [
    [0, 1],
    [1, 2],
    [2, 3],
  ]),
); // 期望 4
console.log(
  longestPalindromicPath(3, "abc", [
    [0, 1],
    [1, 2],
  ]),
); // 期望 1
console.log(
  longestPalindromicPath(4, "aaaa", [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [2, 3],
  ]),
); // 期望 4

export {};
