// 173. 恢复网络路径
// 自定义题：n 节点带权图，给定一条损坏路径（节点序列），
// 已有若干可用边；修复最少数量的路径边使路径上所有节点连通。
// 思路：并查集合并所有可用边，再贪心修复路径上损坏的相邻边。

type Edge = [number, number];

class DSU {
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
}

function countComponentsOnPath(n: number, availableEdges: Edge[], path: number[]): number {
  const dsu = new DSU(n);
  for (const [u, v] of availableEdges) dsu.union(u, v);
  const roots = new Set<number>();
  for (const node of path) roots.add(dsu.find(node));
  return roots.size;
}

function recoverNetworkPath(n: number, availableEdges: Edge[], path: number[]): number {
  const dsu = new DSU(n);
  for (const [u, v] of availableEdges) dsu.union(u, v);
  let repairs = 0;
  for (let i = 0; i + 1 < path.length; i++) {
    if (dsu.find(path[i]) !== dsu.find(path[i + 1])) {
      dsu.union(path[i], path[i + 1]);
      repairs++;
    }
  }
  return repairs;
}

// 测试
console.log(
  recoverNetworkPath(
    4,
    [
      [0, 1],
      [1, 2],
    ],
    [0, 1, 2, 3],
  ),
); // 期望 1
console.log(recoverNetworkPath(3, [], [0, 1, 2])); // 期望 2
console.log(
  recoverNetworkPath(
    4,
    [
      [0, 1],
      [2, 3],
    ],
    [0, 1, 2, 3],
  ),
); // 期望 1
console.log(
  countComponentsOnPath(
    4,
    [
      [0, 1],
      [1, 2],
    ],
    [0, 1, 2, 3],
  ),
); // 期望 2

export {};
