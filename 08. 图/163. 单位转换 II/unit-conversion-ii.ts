// 163. 单位转换 II
// n 单位 conversions 带 ratio（可能有环），queries 求转换比，环检测一致性。
// 解法：带权并查集 + DFS 求比值检矛盾。

class WeightedUnionFind {
  parent: number[];
  ratio: number[]; // ratio[x] = x / parent[x]
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.ratio = new Array(n).fill(1);
  }
  find(x: number): number {
    if (this.parent[x] !== x) {
      const p = this.parent[x];
      const root = this.find(p);
      this.ratio[x] *= this.ratio[p];
      this.parent[x] = root;
    }
    return this.parent[x];
  }
  // 表示 x / y = r
  union(x: number, y: number, r: number): boolean {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) {
      // 一致性检查：x / y 应等于 r
      const cur = this.ratio[x] / this.ratio[y];
      return Math.abs(cur - r) < 1e-9;
    }
    // rx -> ry : ratio[rx] = (ry -> y) * r / (rx -> x)
    this.parent[rx] = ry;
    this.ratio[rx] = (r * this.ratio[y]) / this.ratio[x];
    return true;
  }
  query(x: number, y: number): number | null {
    if (this.find(x) !== this.find(y)) return null;
    return this.ratio[x] / this.ratio[y];
  }
}

function unitConversionII(
  n: number,
  conversions: [number, number, number][],
  queries: [number, number][],
): (number | null)[] {
  const wuf = new WeightedUnionFind(n);
  for (const [u, v, r] of conversions) {
    wuf.union(u, v, r);
  }
  return queries.map(([u, v]) => wuf.query(u, v));
}

// 方法二：DFS 求比值并检测环矛盾
function unitConversionIIDfs(
  n: number,
  conversions: [number, number, number][],
  queries: [number, number][],
): (number | null)[] {
  const adj: [number, number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, r] of conversions) {
    adj[u].push([u, v, r]);
    adj[v].push([v, u, 1 / r]);
  }
  const value: number[] = new Array(n).fill(NaN); // value[i] = i / base
  let consistent = true;
  for (let s = 0; s < n; s++) {
    if (isNaN(value[s])) {
      value[s] = 1;
      const stack = [s];
      while (stack.length) {
        const x = stack.pop()!;
        for (const [, y, r] of adj[x]) {
          if (isNaN(value[y])) {
            value[y] = value[x] * r;
            stack.push(y);
          } else if (Math.abs(value[y] - value[x] * r) > 1e-9) {
            consistent = false;
          }
        }
      }
    }
  }
  return queries.map(([u, v]) =>
    consistent && !isNaN(value[u]) && !isNaN(value[v]) ? value[u] / value[v] : null,
  );
}

// 测试
console.log(
  unitConversionII(
    3,
    [
      [0, 1, 2],
      [1, 2, 3],
    ],
    [
      [0, 2],
      [2, 0],
    ],
  ),
);
console.log(
  unitConversionIIDfs(
    3,
    [
      [0, 1, 2],
      [1, 2, 3],
    ],
    [
      [0, 2],
      [2, 0],
    ],
  ),
);

export {};
