// ============================================================
// 158. 属性图
// ============================================================
// 自定义题：n 个节点属性集合，两节点有公共属性则连通，求连通分量数。
// 思路：并查集按属性分组 / DFS 遍历属性邻接表。
// 时间复杂度：O(n * A * α)，空间复杂度：O(n + A)。

class DSU {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a: number, b: number): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else {
      this.parent[rb] = ra;
      this.rank[ra]++;
    }
  }
}

// 方法1：并查集按属性分组
// 把每个属性对应的首个节点作为代表，其它拥有该属性的节点与其合并。
function countAttributeComponentsDSU(attrs: number[][]): number {
  const n = attrs.length;
  const dsu = new DSU(n);
  const owner = new Map<number, number>(); // 属性 -> 某个拥有该属性的节点
  for (let i = 0; i < n; i++) {
    for (const a of attrs[i]) {
      if (owner.has(a)) {
        dsu.union(owner.get(a)!, i);
      } else {
        owner.set(a, i);
      }
    }
  }
  const roots = new Set<number>();
  for (let i = 0; i < n; i++) roots.add(dsu.find(i));
  return roots.size;
}

// 方法2：DFS 遍历属性邻接表
// 建立属性 -> 节点列表映射，再建节点邻接表，DFS 数连通分量。
function countAttributeComponentsDFS(attrs: number[][]): number {
  const n = attrs.length;
  const attrToNodes = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    for (const a of attrs[i]) {
      if (!attrToNodes.has(a)) attrToNodes.set(a, []);
      attrToNodes.get(a)!.push(i);
    }
  }
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const nodes of attrToNodes.values()) {
    for (let i = 1; i < nodes.length; i++) {
      adj[nodes[0]].push(nodes[i]);
      adj[nodes[i]].push(nodes[0]);
    }
  }
  const visited = new Array(n).fill(false);
  let cnt = 0;
  const dfs = (u: number): void => {
    visited[u] = true;
    for (const v of adj[u]) if (!visited[v]) dfs(v);
  };
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      cnt++;
      dfs(i);
    }
  }
  return cnt;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 158. 属性图 =====");
console.log(
  "DSU:",
  countAttributeComponentsDSU([[1, 2], [2, 3], [4], [4, 5], [6]]), // 期望 3
);
console.log(
  "DFS:",
  countAttributeComponentsDFS([[1, 2], [2, 3], [4], [4, 5], [6]]), // 期望 3
);
console.log(
  "DSU:",
  countAttributeComponentsDSU([[1], [2], [3]]), // 期望 3（无公共属性）
);
console.log(
  "DFS:",
  countAttributeComponentsDFS([[1], [2], [3]]), // 期望 3
);
console.log(
  "DSU:",
  countAttributeComponentsDSU([[1], [1], [1]]), // 期望 1
);
console.log(
  "DFS:",
  countAttributeComponentsDFS([[1], [1], [1]]), // 期望 1
);
console.log(
  "DSU:",
  countAttributeComponentsDSU([]), // 期望 0
);
console.log(
  "DFS:",
  countAttributeComponentsDFS([]), // 期望 0
);
console.log(
  "DSU:",
  countAttributeComponentsDSU([
    [1, 2],
    [3, 4],
    [2, 3],
  ]), // 期望 1
);
console.log(
  "DFS:",
  countAttributeComponentsDFS([
    [1, 2],
    [3, 4],
    [2, 3],
  ]), // 期望 1
);

export {};
