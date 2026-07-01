// LC2307. 检查方程中的矛盾之处
// 给定 equations 和 values, 判断是否存在矛盾
// 带权并查集 / DFS 求比值

type Equation = string[];
type EqList = string[][];
type ValList = number[];

// 方法1: 带权并查集
function checkContradictions1(equations: EqList, values: ValList): boolean {
  const eps = 1e-5;
  const parent = new Map<string, string>();
  const ratio = new Map<string, number>(); // node -> parent 比值
  function find(x: string): [string, number] {
    if (!parent.has(x)) {
      parent.set(x, x);
      ratio.set(x, 1);
      return [x, 1];
    }
    if (parent.get(x) === x) return [x, 1];
    const [root, r] = find(parent.get(x)!);
    parent.set(x, root);
    ratio.set(x, ratio.get(x)! * r);
    return [parent.get(x)!, ratio.get(x)!];
  }
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    const v = values[i];
    const [ra, qa] = find(a);
    const [rb, qb] = find(b);
    if (ra !== rb) {
      parent.set(ra, rb);
      // a/b = v, a->ra 权 qa, b->rb 权 qb, 合并 ra->rb
      // a = qa * ra, b = qb * rb, a/b = (qa*ra)/(qb*rb) = v
      // ra/rb = v * qb / qa
      ratio.set(ra, (v * qb) / qa);
    } else {
      // 同根, 校验 a/b = qa/qb ?= v
      if (Math.abs(qa / qb - v) > eps) return true;
    }
  }
  return false;
}

// 方法2: DFS 求比值
function checkContradictions2(equations: EqList, values: ValList): boolean {
  const eps = 1e-5;
  const graph = new Map<string, [string, number][]>();
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    const v = values[i];
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);
    graph.get(a)!.push([b, v]);
    graph.get(b)!.push([a, 1 / v]);
  }
  const val = new Map<string, number>();
  function dfs(u: string, cur: number): boolean {
    if (val.has(u)) {
      return Math.abs(val.get(u)! - cur) > eps;
    }
    val.set(u, cur);
    for (const [v, w] of graph.get(u) || []) {
      if (dfs(v, cur * w)) return true;
    }
    return false;
  }
  for (const node of graph.keys()) {
    if (!val.has(node)) {
      if (dfs(node, 1)) return true;
    }
  }
  return false;
}

// 测试
function test(): void {
  console.log(
    checkContradictions1(
      [
        ["a", "b"],
        ["b", "c"],
        ["a", "c"],
      ],
      [3, 0.5, 1.5],
    ),
  ); // false
  console.log(
    checkContradictions1(
      [
        ["a", "b"],
        ["b", "c"],
        ["a", "c"],
      ],
      [3, 0.5, 2],
    ),
  ); // true
  console.log(
    checkContradictions2(
      [
        ["a", "b"],
        ["b", "c"],
        ["a", "c"],
      ],
      [3, 0.5, 1.5],
    ),
  ); // false
  console.log(
    checkContradictions2(
      [
        ["a", "b"],
        ["b", "c"],
        ["a", "c"],
      ],
      [3, 0.5, 2],
    ),
  ); // true
}
test();

export {};
