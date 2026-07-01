// 162. 针对图的路径存在性查询 II
// 同上但在线查询。并查集预处理 O(1) 查询。

class UnionFind2 {
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
  union(x: number, y: number): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;
    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
  }
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

class PathExistenceOnline {
  private uf: UnionFind2;
  constructor(n: number, edges: number[][]) {
    this.uf = new UnionFind2(n);
    for (const [u, v] of edges) {
      this.uf.union(u, v);
    }
  }
  query(u: number, v: number): boolean {
    return this.uf.connected(u, v);
  }
}

function pathExistenceQueriesII(n: number, edges: number[][], queries: number[][]): boolean[] {
  const pe = new PathExistenceOnline(n, edges);
  return queries.map(([u, v]) => pe.query(u, v));
}

// 方法二：LCA（树情形下）路径判断 — 此处用并查集预处理等价演示
function pathExistenceQueriesIILca(n: number, edges: number[][], queries: number[][]): boolean[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const comp: number[] = new Array(n).fill(-1);
  let cid = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] === -1) {
      const q = [i];
      comp[i] = cid;
      while (q.length) {
        const x = q.shift()!;
        for (const y of adj[x]) {
          if (comp[y] === -1) {
            comp[y] = cid;
            q.push(y);
          }
        }
      }
      cid++;
    }
  }
  return queries.map(([u, v]) => comp[u] === comp[v]);
}

// 测试
console.log(
  pathExistenceQueriesII(
    6,
    [
      [0, 1],
      [2, 3],
      [4, 5],
    ],
    [
      [0, 1],
      [1, 2],
      [4, 5],
    ],
  ),
);
console.log(
  pathExistenceQueriesIILca(
    6,
    [
      [0, 1],
      [2, 3],
      [4, 5],
    ],
    [
      [0, 1],
      [1, 2],
      [4, 5],
    ],
  ),
);

export {};
