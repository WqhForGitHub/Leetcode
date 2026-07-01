// 143. 标记所有节点需要的时间 (LC3241)
// n 节点树，奇数节点移动耗时 1 秒，偶数节点移动耗时 2 秒。
// 以每个节点为根标记所有节点所需时间。换根 DP：维护子树最深与次深。
// 边 (u->v) 的代价：若 v 为奇数则 1，偶数则 2。
// 时间 = 从根出发遍历所有节点，每个子树返回 max(子节点遍历时间) + 边代价，
// 但根节点本身不计入（标记根节点耗时 0）。即结果 = 子树最大完成时间。

type Tree = number[][];

function buildTree(n: number, edges: number[][]): Tree {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

function edgeCost(v: number): number {
  // 进入节点 v 的代价
  return v % 2 === 1 ? 1 : 2;
}

function timeTakenToMarkAllNodes(n: number, edges: number[][]): number[] {
  const adj = buildTree(n, edges);
  // down[u]: 以 u 为根（0 为根时）子树中最长完成时间
  const down: number[] = new Array(n).fill(0);
  // down2[u]: 次长完成时间
  const down2: number[] = new Array(n).fill(0);
  // first dfs: 求子树 down
  const dfs1 = (u: number, parent: number): number => {
    let m1 = 0;
    let m2 = 0;
    for (const v of adj[u]) {
      if (v === parent) continue;
      const t = dfs1(v, u) + edgeCost(v);
      if (t > m1) {
        m2 = m1;
        m1 = t;
      } else if (t > m2) {
        m2 = t;
      }
    }
    down[u] = m1;
    down2[u] = m2;
    return m1;
  };
  dfs1(0, -1);
  const ans: number[] = new Array(n).fill(0);
  // 第二次 dfs: 换根
  // up[u]: 从 u 出发经父节点方向的最长完成时间（不包含 u 子树）
  const dfs2 = (u: number, parent: number, upVal: number) => {
    // u 作为根时的答案 = max(upVal, down[u])
    // 注意 upVal 已经包含从 u 到 parent 的边代价 + parent 方向贡献
    ans[u] = Math.max(upVal, down[u]);
    // 处理子节点
    // 对每个子节点 v，它换根时父方向的贡献 = edgeCost(v) 的反方向? 不，
    // 换根到 v 时，v 的"父方向"变为原来的 u，
    // up[v] = edgeCost(v) 反向? 进入 u 的代价为 edgeCost(u)
    // up[v] = max(upVal, down[u] 若 down[u] 来自 v 则用 down2[u]) + edgeCost(u)
    for (const v of adj[u]) {
      if (v === parent) continue;
      // v 贡献给 down[u] 的部分 = down[v] + edgeCost(v)
      const contrib = down[v] + edgeCost(v);
      let otherMax: number;
      if (contrib === down[u]) {
        otherMax = Math.max(upVal, down2[u]);
      } else {
        otherMax = Math.max(upVal, down[u]);
      }
      const newUp = otherMax + edgeCost(u);
      dfs2(v, u, newUp);
    }
  };
  dfs2(0, -1, 0);
  return ans;
}

function timeTakenToMarkAllNodesMethod2(n: number, edges: number[][]): number[] {
  // 方法2：暴力每个节点为根做一次 DFS（O(n^2)），用于验证
  const adj = buildTree(n, edges);
  const dfs = (u: number, parent: number): number => {
    let m = 0;
    for (const v of adj[u]) {
      if (v === parent) continue;
      m = Math.max(m, dfs(v, u) + edgeCost(v));
    }
    return m;
  };
  const ans: number[] = new Array(n);
  for (let i = 0; i < n; i++) ans[i] = dfs(i, -1);
  return ans;
}

// 测试
(() => {
  console.log(
    timeTakenToMarkAllNodes(4, [
      [0, 1],
      [1, 2],
      [2, 3],
    ]),
  );
  console.log(
    timeTakenToMarkAllNodes(5, [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
    ]),
  );
  // 与暴力对照
  const n = 7;
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [5, 6],
  ];
  const a = timeTakenToMarkAllNodes(n, edges);
  const b = timeTakenToMarkAllNodesMethod2(n, edges);
  console.log(a, b, JSON.stringify(a) === JSON.stringify(b));
})();

export {};
