// 178. 修复边以遍历图的最小成本
// 自定义题：n 节点图，部分边损坏且有修复成本，求使全图连通的最小修复成本。
// 思路：并查集 + Kruskal，可用边免费先合并，损坏边按成本升序补齐。

type Edge = [number, number, number, boolean]; // u, v, cost, isWorking

class UF {
  parent: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;
    this.parent[ry] = rx;
    return true;
  }

  components(): number {
    const roots = new Set<number>();
    for (let i = 0; i < this.parent.length; i++) roots.add(this.find(i));
    return roots.size;
  }
}

function minCostToFixEdgesForTraversal(n: number, edges: Edge[]): number {
  const uf = new UF(n);
  for (const [u, v, , working] of edges) {
    if (working) uf.union(u, v);
  }
  const damaged = edges.filter((e) => !e[3]).sort((a, b) => a[2] - b[2]);
  let cost = 0;
  for (const [u, v, c] of damaged) {
    if (uf.components() === 1) break;
    if (uf.union(u, v)) cost += c;
  }
  return uf.components() === 1 ? cost : -1;
}

function repairedEdgesForTraversal(n: number, edges: Edge[]): Edge[] {
  const uf = new UF(n);
  for (const [u, v, , working] of edges) {
    if (working) uf.union(u, v);
  }
  const damaged = edges.filter((e) => !e[3]).sort((a, b) => a[2] - b[2]);
  const repaired: Edge[] = [];
  for (const e of damaged) {
    if (uf.components() === 1) break;
    if (uf.union(e[0], e[1])) repaired.push(e);
  }
  return uf.components() === 1 ? repaired : [];
}

// 测试
console.log(
  minCostToFixEdgesForTraversal(4, [
    [0, 1, 0, true],
    [1, 2, 0, true],
    [2, 3, 5, false],
    [0, 3, 2, false],
  ]),
); // 期望 2
console.log(
  minCostToFixEdgesForTraversal(3, [
    [0, 1, 1, false],
    [1, 2, 2, false],
  ]),
); // 期望 3
console.log(minCostToFixEdgesForTraversal(4, [[0, 1, 1, false]])); // 期望 -1
console.log(
  repairedEdgesForTraversal(4, [
    [0, 1, 0, true],
    [1, 2, 0, true],
    [2, 3, 5, false],
    [0, 3, 2, false],
  ]).length,
); // 期望 1

export {};
