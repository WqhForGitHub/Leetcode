// ============================================================
// 064. 查询树上回文路径
// ============================================================
// 给定 n 个节点（0..n-1）的无根树，边数组 edges，以及每个节点一个小写字母组成的字符串 s。
// 多次查询 [a, b]：节点 a 到节点 b 路径上的字符能否重排成一个回文串？
// （回文串允许至多一个字符出现奇数次。）
// 时间复杂度：方法1 O((n+q) log n)，方法2 O(q * n)

// 方法1：LCA + 前缀位掩码（推荐）
// 以 0 为根，mask[u] = 从根到 u 路径上每个字符对应位异或的结果（含 u）。
// 路径 a-b = a->lca->b。mask[a] XOR mask[b] 会抵消根到 lca 的公共部分，
// 且 lca 自身被异或两次抵消，故需再异或 (1 << s[lca]) 把 lca 字符补回。
// 最终路径掩码 = mask[a] XOR mask[b] XOR (1 << s[lca])。
// 当掩码中 1 的位数 <= 1 时可构成回文。LCA 用二进制提升预处理。
function palindromePathsOnTree1(
  n: number,
  edges: number[][],
  s: string,
  queries: number[][],
): boolean[] {
  if (n === 0) return [];

  // 建邻接表
  const adj: number[][] = Array.from({ length: n }, (): number[] => []);
  for (let e: number = 0; e < edges.length; e++) {
    const u: number = edges[e][0];
    const v: number = edges[e][1];
    adj[u].push(v);
    adj[v].push(u);
  }

  // 二进制提升：LOG 满足 2^LOG >= n
  let LOG: number = 1;
  while (1 << LOG < n) LOG++;
  const parent: number[][] = Array.from({ length: n }, (): number[] =>
    new Array<number>(LOG + 1).fill(0),
  );
  const depth: number[] = new Array<number>(n).fill(0);
  const mask: number[] = new Array<number>(n).fill(0);

  // BFS 建立父节点、深度与掩码
  const visited: boolean[] = new Array<boolean>(n).fill(false);
  visited[0] = true;
  parent[0][0] = 0;
  mask[0] = 1 << (s.charCodeAt(0) - 97);
  const queue: number[] = [0];
  let head: number = 0;
  while (head < queue.length) {
    const u: number = queue[head];
    head++;
    for (let t: number = 0; t < adj[u].length; t++) {
      const v: number = adj[u][t];
      if (!visited[v]) {
        visited[v] = true;
        parent[v][0] = u;
        depth[v] = depth[u] + 1;
        mask[v] = mask[u] ^ (1 << (s.charCodeAt(v) - 97));
        queue.push(v);
      }
    }
  }

  // 预处理倍增
  for (let j: number = 1; j <= LOG; j++) {
    for (let i: number = 0; i < n; i++) {
      parent[i][j] = parent[parent[i][j - 1]][j - 1];
    }
  }

  const lca = (a: number, b: number): number => {
    let x: number = a;
    let y: number = b;
    if (depth[x] < depth[y]) {
      const tmp: number = x;
      x = y;
      y = tmp;
    }
    const diff: number = depth[x] - depth[y];
    for (let j: number = 0; j <= LOG; j++) {
      if (((diff >> j) & 1) === 1) x = parent[x][j];
    }
    if (x === y) return x;
    for (let j: number = LOG; j >= 0; j--) {
      if (parent[x][j] !== parent[y][j]) {
        x = parent[x][j];
        y = parent[y][j];
      }
    }
    return parent[x][0];
  };

  const popcount = (x: number): number => {
    let c: number = 0;
    while (x !== 0) {
      c += x & 1;
      x >>>= 1;
    }
    return c;
  };

  const result: boolean[] = [];
  for (let q: number = 0; q < queries.length; q++) {
    const a: number = queries[q][0];
    const b: number = queries[q][1];
    const l: number = lca(a, b);
    const pathMask: number = mask[a] ^ mask[b] ^ (1 << (s.charCodeAt(l) - 97));
    result.push(popcount(pathMask) <= 1);
  }
  return result;
}

// 方法2：每次查询 BFS 找路径后统计频次
// 对每个查询 [a, b]，从 a 做 BFS 到 b，回溯得到路径节点序列，
// 统计每个字符出现次数，奇数次字符数 <= 1 即可构成回文。
// 单次查询 O(n)，共 q 次查询 O(q*n)。
function palindromePathsOnTree2(
  n: number,
  edges: number[][],
  s: string,
  queries: number[][],
): boolean[] {
  if (n === 0) return [];

  const adj: number[][] = Array.from({ length: n }, (): number[] => []);
  for (let e: number = 0; e < edges.length; e++) {
    const u: number = edges[e][0];
    const v: number = edges[e][1];
    adj[u].push(v);
    adj[v].push(u);
  }

  // BFS 找 a 到 b 的路径，返回路径节点序列（含两端）
  const findPath = (a: number, b: number): number[] => {
    const prev: number[] = new Array<number>(n).fill(-1);
    const seen: boolean[] = new Array<boolean>(n).fill(false);
    seen[a] = true;
    const queue: number[] = [a];
    let head: number = 0;
    while (head < queue.length) {
      const u: number = queue[head];
      head++;
      if (u === b) break;
      for (let t: number = 0; t < adj[u].length; t++) {
        const v: number = adj[u][t];
        if (!seen[v]) {
          seen[v] = true;
          prev[v] = u;
          queue.push(v);
        }
      }
    }
    const path: number[] = [];
    let cur: number = b;
    while (cur !== -1) {
      path.push(cur);
      if (cur === a) break;
      cur = prev[cur];
    }
    return path;
  };

  const result: boolean[] = [];
  for (let q: number = 0; q < queries.length; q++) {
    const a: number = queries[q][0];
    const b: number = queries[q][1];
    const path: number[] = findPath(a, b);
    const freq: number[] = new Array<number>(26).fill(0);
    for (let i: number = 0; i < path.length; i++) {
      freq[s.charCodeAt(path[i]) - 97]++;
    }
    let odd: number = 0;
    for (let c: number = 0; c < 26; c++) {
      if (freq[c] % 2 === 1) odd++;
    }
    result.push(odd <= 1);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 查询树上回文路径 =====");
// 树：0(a)-1(b), 0(a)-2(c), 1(b)-3(b), 1(b)-4(a)  s="abcba"
//   节点 0:'a' 1:'b' 2:'c' 3:'b' 4:'a'
// 查询：
//   [3,4]: 路径 3-1-4 => b,b,a => 奇数次1(a) => true
//   [3,2]: 路径 3-1-0-2 => b,b,a,c => 奇数次2(a,c) => false
//   [0,4]: 路径 0-1-4 => a,b,a => 奇数次1(b) => true
//   [3,1]: 路径 3-1 => b,b => 奇数次0 => true
//   [2,2]: 路径 2 => c => 奇数次1 => true
const edges: number[][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
];
const s: string = "abcba";
const queries: number[][] = [
  [3, 4],
  [3, 2],
  [0, 4],
  [3, 1],
  [2, 2],
];
console.log("方法1:", JSON.stringify(palindromePathsOnTree1(5, edges, s, queries)));
// 期望: [true,false,true,true,true]
console.log("方法2:", JSON.stringify(palindromePathsOnTree2(5, edges, s, queries)));
// 期望: [true,false,true,true,true]

export {};
