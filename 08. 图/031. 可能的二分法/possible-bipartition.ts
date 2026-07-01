// ============================================================
// 031. 可能的二分法
// ============================================================
// LeetCode 886. Possible Bipartition
// n 个人，dislikes=[[a,b]] 表示两人不能同组。能否将所有人分成两组，
// 使每组内不互不喜欢。返回 true/false。
// 时间复杂度：O(N + D)，空间复杂度：O(N + D)

// 方法1：BFS 染色（推荐）
// 思路：建立邻接表，0/1 交替染色相邻（互相不喜欢）的节点，发现冲突则不可二分。
function possibleBipartitionBFS(n: number, dislikes: number[][]): boolean {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const color: number[] = new Array(n + 1).fill(-1); // -1 未染色，0/1 两色

  for (let start = 1; start <= n; start++) {
    if (color[start] !== -1) continue;
    const queue: number[] = [start];
    color[start] = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of adj[u]) {
        if (color[v] === -1) {
          color[v] = color[u] ^ 1;
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}

// 方法2：并查集（敌人之敌为友）
// 思路：把每个人的"敌人列表"合并到同一集合（即同组）。对于一对 dislike (a,b)，
// 若 a 与 b 已同集合则矛盾返回 false；否则把 a 与 b 的敌人合并、b 与 a 的敌人合并。
class UnionFind {
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
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    this.parent[ra] = rb;
    return true;
  }
}

function possibleBipartitionUF(n: number, dislikes: number[][]): boolean {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) {
    adj[a].push(b);
    adj[b].push(a);
  }
  const uf = new UnionFind(n + 1);
  for (let u = 1; u <= n; u++) {
    for (let i = 1; i < adj[u].length; i++) {
      // 将 u 的所有敌人互相合并（敌人之敌为友，同组）
      uf.union(adj[u][0], adj[u][i]);
    }
  }
  // 检查每对敌人是否被错误地分到同组
  for (const [a, b] of dislikes) {
    if (uf.find(a) === uf.find(b)) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 可能的二分法 =====");
console.log(
  "BFS:",
  possibleBipartitionBFS(4, [
    [1, 2],
    [1, 3],
    [2, 4],
  ]),
); // 期望 true
console.log(
  "BFS:",
  possibleBipartitionBFS(3, [
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // 期望 false
console.log(
  "BFS:",
  possibleBipartitionBFS(5, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 5],
  ]),
); // 期望 false
console.log(
  "UF:",
  possibleBipartitionUF(4, [
    [1, 2],
    [1, 3],
    [2, 4],
  ]),
); // 期望 true
console.log(
  "UF:",
  possibleBipartitionUF(3, [
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // 期望 false
console.log(
  "UF:",
  possibleBipartitionUF(5, [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 5],
  ]),
); // 期望 false

export {};
