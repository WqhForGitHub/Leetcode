// ============================================================
// 036. 等式方程的可满足性
// ============================================================
// LeetCode 990. Satisfiability of Equality Equations
// 给定方程列表 equations，形如 "a==b" 或 "a!=b"（变量为小写字母）。
// 判断是否能同时满足所有方程。
// 时间复杂度：O(N + C α(C))，空间复杂度：O(C)，C=26

class UnionFind26 {
  parent: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a: number, b: number): void {
    this.parent[this.find(a)] = this.find(b);
  }
  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}

// 方法1：并查集（先合并 ==，再检查 !=）（推荐）
// 思路：相等具有传递性，用并查集合并所有 == 方程的两端；
// 再遍历所有 != 方程，若两端已在同一集合则不可满足。
function equationsPossibleUF(equations: string[]): boolean {
  const uf = new UnionFind26(26);
  // 第一轮：处理所有 ==
  for (const eq of equations) {
    if (eq[1] === "=") {
      const a = eq.charCodeAt(0) - 97;
      const b = eq.charCodeAt(3) - 97;
      uf.union(a, b);
    }
  }
  // 第二轮：检查所有 !=
  for (const eq of equations) {
    if (eq[1] === "!") {
      const a = eq.charCodeAt(0) - 97;
      const b = eq.charCodeAt(3) - 97;
      if (uf.connected(a, b)) return false;
    }
  }
  return true;
}

// 方法2：DFS 求连通块
// 思路：把 == 视为无向边建图，DFS 染色求连通块；
// 再检查每个 != 方程两端是否同色。
function equationsPossibleDFS(equations: string[]): boolean {
  const adj: number[][] = Array.from({ length: 26 }, () => []);
  for (const eq of equations) {
    if (eq[1] === "=") {
      const a = eq.charCodeAt(0) - 97;
      const b = eq.charCodeAt(3) - 97;
      adj[a].push(b);
      adj[b].push(a);
    }
  }
  const color = new Array(26).fill(-1);
  function dfs(u: number, c: number): void {
    color[u] = c;
    for (const v of adj[u]) {
      if (color[v] === -1) dfs(v, c);
    }
  }
  for (let i = 0; i < 26; i++) {
    if (color[i] === -1) dfs(i, i);
  }
  for (const eq of equations) {
    if (eq[1] === "!") {
      const a = eq.charCodeAt(0) - 97;
      const b = eq.charCodeAt(3) - 97;
      if (color[a] === color[b]) return false;
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 等式方程的可满足性 =====");
console.log("UF:", equationsPossibleUF(["a==b", "b!=a"])); // 期望 false
console.log("UF:", equationsPossibleUF(["b==a", "a==b"])); // 期望 true
console.log("UF:", equationsPossibleUF(["a==b", "b==c", "a==c"])); // 期望 true
console.log("UF:", equationsPossibleUF(["a!=a"])); // 期望 false
console.log("DFS:", equationsPossibleDFS(["a==b", "b!=a"])); // 期望 false
console.log("DFS:", equationsPossibleDFS(["b==a", "a==b"])); // 期望 true
console.log("DFS:", equationsPossibleDFS(["a==b", "b==c", "a==c"])); // 期望 true
console.log("DFS:", equationsPossibleDFS(["a!=a"])); // 期望 false

export {};
