// 161. 针对图的路径存在性查询 I
// n 节点带权图 edges，queries = [u, v] 判断有无路径。
// 解法：并查集离线处理。

class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    return true;
  }
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

function pathExistenceQueriesI(n: number, edges: number[][], queries: number[][]): boolean[] {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) {
    uf.union(u, v);
  }
  return queries.map(([u, v]) => uf.connected(u, v));
}

// 方法二：DFS 连通分量染色
function pathExistenceQueriesIDfs(n: number, edges: number[][], queries: number[][]): boolean[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const color: number[] = new Array(n).fill(-1);
  let cid = 0;
  for (let i = 0; i < n; i++) {
    if (color[i] === -1) {
      const stack = [i];
      color[i] = cid;
      while (stack.length) {
        const x = stack.pop()!;
        for (const y of adj[x]) {
          if (color[y] === -1) {
            color[y] = cid;
            stack.push(y);
          }
        }
      }
      cid++;
    }
  }
  return queries.map(([u, v]) => color[u] === color[v]);
}

// 测试
console.log(
  pathExistenceQueriesI(
    5,
    [
      [0, 1],
      [1, 2],
      [3, 4],
    ],
    [
      [0, 2],
      [0, 3],
      [3, 4],
    ],
  ),
);
console.log(
  pathExistenceQueriesIDfs(
    5,
    [
      [0, 1],
      [1, 2],
      [3, 4],
    ],
    [
      [0, 2],
      [0, 3],
      [3, 4],
    ],
  ),
);

export {};
