// ============================================================
// 011. 除法求值
// ============================================================
// LeetCode 399. Evaluate Division
// 给定 equations 与 values（a/b = v），回答 queries 中每个 c/d 的值；不存在返回 -1.0
// 时间复杂度：并查集 O((N+Q)·α(N))；Floyd O(V^3)；DFS O(Q·(V+E))

// 带权并查集：weight[x] 表示 x / parent[x]
class WeightedUnionFind {
  parent: Map<string, string> = new Map();
  weight: Map<string, number> = new Map();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.weight.set(x, 1);
      return x;
    }
    if (this.parent.get(x) === x) return x;
    const p = this.parent.get(x)!;
    const root = this.find(p);
    // 路径压缩：weight[x] 由 x/oldParent 调整为 x/root
    this.weight.set(x, this.weight.get(x)! * this.weight.get(p)!);
    this.parent.set(x, root);
    return root;
  }

  // 合并：令 a/b = v
  union(a: string, b: string, v: number): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    // a/ra = wa, b/rb = wb, 设 parent[ra] = rb
    // a/b = (a/ra)·(ra/rb)·(rb/b) = wa · weight[ra] / wb = v
    // => weight[ra] = v · wb / wa
    const wa = this.weight.get(a)!;
    const wb = this.weight.get(b)!;
    this.parent.set(ra, rb);
    this.weight.set(ra, (v * wb) / wa);
  }

  query(a: string, b: string): number {
    if (!this.parent.has(a) || !this.parent.has(b)) return -1.0;
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) return -1.0;
    return this.weight.get(a)! / this.weight.get(b)!;
  }
}

// 方法1：带权并查集（推荐）
function calcEquation(
  equations: string[][],
  values: number[],
  queries: string[][],
): number[] {
  const uf = new WeightedUnionFind();
  for (let i = 0; i < equations.length; i++) {
    uf.union(equations[i][0], equations[i][1], values[i]);
  }
  return queries.map((q) => uf.query(q[0], q[1]));
}

// 方法2：Floyd 传递闭包
function calcEquationFloyd(
  equations: string[][],
  values: number[],
  queries: string[][],
): number[] {
  const dist: Map<string, Map<string, number>> = new Map();
  const get = (a: string, b: string): number => {
    return dist.get(a)?.get(b) ?? -1;
  };
  const set = (a: string, b: string, v: number): void => {
    if (!dist.has(a)) dist.set(a, new Map());
    dist.get(a)!.set(b, v);
  };
  const vars = new Set<string>();
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    vars.add(a);
    vars.add(b);
    set(a, b, values[i]);
    set(b, a, 1 / values[i]);
    set(a, a, 1);
    set(b, b, 1);
  }
  for (const k of vars) {
    for (const i of vars) {
      if (get(i, k) <= 0) continue;
      for (const j of vars) {
        if (get(k, j) > 0) {
          set(i, j, get(i, k) * get(k, j));
        }
      }
    }
  }
  return queries.map(([c, d]) => {
    if (!vars.has(c) || !vars.has(d)) return -1.0;
    const r = get(c, d);
    return r > 0 ? r : -1.0;
  });
}

// 方法3：DFS 搜索路径并累乘
function calcEquationDFS(
  equations: string[][],
  values: number[],
  queries: string[][],
): number[] {
  const graph: Map<string, Map<string, number>> = new Map();
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    if (!graph.has(a)) graph.set(a, new Map());
    if (!graph.has(b)) graph.set(b, new Map());
    graph.get(a)!.set(b, values[i]);
    graph.get(b)!.set(a, 1 / values[i]);
  }
  const dfs = (start: string, target: string, visited: Set<string>): number => {
    if (!graph.has(start) || !graph.has(target)) return -1.0;
    if (start === target) return 1.0;
    visited.add(start);
    for (const [nb, w] of graph.get(start)!) {
      if (visited.has(nb)) continue;
      const sub = dfs(nb, target, visited);
      if (sub !== -1.0) return sub * w;
    }
    return -1.0;
  };
  return queries.map(([c, d]) => dfs(c, d, new Set()));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 除法求值 =====");
const eq1 = [["a", "b"], ["b", "c"]];
const v1 = [2.0, 3.0];
const q1 = [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]];
console.log(calcEquation(eq1, v1, q1)); // [6.0, 0.5, -1.0, 1.0, -1.0]
console.log(calcEquationFloyd(eq1, v1, q1)); // [6.0, 0.5, -1.0, 1.0, -1.0]
console.log(calcEquationDFS(eq1, v1, q1)); // [6.0, 0.5, -1.0, 1.0, -1.0]

const eq2 = [["a", "b"], ["b", "c"], ["bc", "cd"]];
const v2 = [1.5, 2.5, 5.0];
const q2 = [["a", "c"], ["c", "b"], ["bc", "cd"], ["cd", "bc"]];
console.log(calcEquation(eq2, v2, q2)); // [3.75, 0.4, 5.0, 0.2]

export {};
