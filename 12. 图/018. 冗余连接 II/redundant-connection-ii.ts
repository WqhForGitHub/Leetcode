// ============================================================
// 018. 冗余连接 II
// ============================================================
// LeetCode 685. Redundant Connection II
// 有向图由一棵根树加一条边形成，返回可删的边。需处理：某点两入度、有向环
// 时间复杂度：并查集 O(E·α(N))；暴力 O(E^2)；空间 O(N)

// 方法1：并查集 + 入度分析（推荐）
function findRedundantDirectedConnection(edges: number[][]): number[] {
  const n = edges.length;
  // 找入度为 2 的节点，记录指向它的两条边（cand1 先出现，cand2 后出现）
  const parentEdge: number[] = new Array(n + 1).fill(-1);
  let cand1 = -1;
  let cand2 = -1;
  for (let i = 0; i < n; i++) {
    const v = edges[i][1];
    if (parentEdge[v] !== -1) {
      cand1 = parentEdge[v];
      cand2 = i;
      break;
    }
    parentEdge[v] = i;
  }

  // 并查集
  const uf: number[] = new Array(n + 1);
  for (let i = 0; i <= n; i++) uf[i] = i;
  const find = (x: number): number => {
    while (uf[x] !== x) {
      uf[x] = uf[uf[x]];
      x = uf[x];
    }
    return x;
  };
  const union = (x: number, y: number): boolean => {
    const rx = find(x);
    const ry = find(y);
    if (rx === ry) return false;
    uf[rx] = ry;
    return true;
  };

  if (cand1 !== -1) {
    // 存在入度为 2 的节点：先尝试删除 cand2
    for (let i = 0; i < n; i++) {
      if (i === cand2) continue;
      const [u, v] = edges[i];
      if (!union(u, v)) {
        // 删除 cand2 后仍有环 => 答案是 cand1
        return edges[cand1];
      }
    }
    // 删除 cand2 后无环 => 答案是 cand2
    return edges[cand2];
  } else {
    // 无入度为 2 的节点：纯有向环，返回成环的那条边
    for (let i = 0; i < n; i++) {
      const [u, v] = edges[i];
      if (!union(u, v)) return edges[i];
    }
  }
  return [];
}

// 方法2：暴力 —— 逆序尝试删除每条边，判断剩余是否为合法根树
function findRedundantDirectedConnectionBrute(edges: number[][]): number[] {
  const n = edges.length;

  const isTree = (excludeIdx: number): boolean => {
    const indeg: number[] = new Array(n + 1).fill(0);
    const adj: number[][] = Array.from({ length: n + 1 }, () => []);
    const present = new Set<number>();
    let edgeCount = 0;
    for (let i = 0; i < n; i++) {
      if (i === excludeIdx) continue;
      const [u, v] = edges[i];
      adj[u].push(v);
      indeg[v]++;
      present.add(u);
      present.add(v);
      edgeCount++;
    }
    if (edgeCount !== present.size - 1) return false;
    let root = -1;
    let rootCount = 0;
    for (const x of present) {
      if (indeg[x] === 0) {
        root = x;
        rootCount++;
      } else if (indeg[x] > 1) {
        return false;
      }
    }
    if (rootCount !== 1) return false;
    // 从根出发可达所有节点（同时验证无环）
    const visited = new Set<number>();
    const stack: number[] = [root];
    visited.add(root);
    while (stack.length > 0) {
      const x = stack.pop()!;
      for (const nb of adj[x]) {
        if (!visited.has(nb)) {
          visited.add(nb);
          stack.push(nb);
        }
      }
    }
    return visited.size === present.size;
  };

  for (let i = n - 1; i >= 0; i--) {
    if (isTree(i)) return edges[i];
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 冗余连接 II =====");
console.log(
  findRedundantDirectedConnection([
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // [2,3]
console.log(
  findRedundantDirectedConnectionBrute([
    [1, 2],
    [1, 3],
    [2, 3],
  ]),
); // [2,3]
console.log(
  findRedundantDirectedConnection([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1],
    [1, 5],
  ]),
); // [4,1]
console.log(
  findRedundantDirectedConnectionBrute([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1],
    [1, 5],
  ]),
); // [4,1]
console.log(
  findRedundantDirectedConnection([
    [1, 2],
    [2, 3],
    [3, 1],
    [4, 2],
  ]),
); // [1,2]
console.log(
  findRedundantDirectedConnectionBrute([
    [1, 2],
    [2, 3],
    [3, 1],
    [4, 2],
  ]),
); // [1,2]

export {};
