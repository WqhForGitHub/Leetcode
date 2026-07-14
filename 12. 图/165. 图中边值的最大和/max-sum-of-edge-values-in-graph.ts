// 165. 图中边值的最大和
// n 节点 edges，给每边赋 1..m 使相邻边值不同，求边值最大和。
// 解法：贪心按度数排序赋值。

interface Edge {
  u: number;
  v: number;
  idx: number;
}

function maxSumOfEdgeValuesInGraph(n: number, edgesRaw: [number, number][], m: number): number {
  const e = edgesRaw.length;
  const edges: Edge[] = edgesRaw.map(([u, v], i) => ({ u, v, idx: i }));
  // 邻接边
  const adjEdges: number[][] = Array.from({ length: n }, () => []);
  edges.forEach((ed, i) => {
    adjEdges[ed.u].push(i);
    adjEdges[ed.v].push(i);
  });
  // 按顶点度数排序边（按关联度数和降序）
  const deg = (i: number) => adjEdges[edges[i].u].length + adjEdges[edges[i].v].length;
  const order = edges.map((_, i) => i).sort((a, b) => deg(b) - deg(a));
  const value: number[] = new Array(e).fill(0);
  let sum = 0;
  for (const i of order) {
    const used = new Set<number>();
    for (const j of adjEdges[edges[i].u]) if (value[j] > 0) used.add(value[j]);
    for (const j of adjEdges[edges[i].v]) if (value[j] > 0) used.add(value[j]);
    let val = m;
    while (val >= 1 && used.has(val)) val--;
    if (val < 1) val = 1; // 保证赋值，可能不满足约束但尽力
    value[i] = val;
    sum += val;
  }
  return sum;
}

// 方法二：回溯搜索求最大和
function maxSumOfEdgeValuesBacktrack(n: number, edgesRaw: [number, number][], m: number): number {
  const e = edgesRaw.length;
  const adjEdges: number[][] = Array.from({ length: n }, () => []);
  edgesRaw.forEach(([u, v], i) => {
    adjEdges[u].push(i);
    adjEdges[v].push(i);
  });
  const value: number[] = new Array(e).fill(0);
  let best = -1;
  const conflict = (i: number, val: number): boolean => {
    for (const j of adjEdges[edgesRaw[i][0]]) if (j !== i && value[j] === val) return true;
    for (const j of adjEdges[edgesRaw[i][1]]) if (j !== i && value[j] === val) return true;
    return false;
  };
  const dfs = (idx: number, cur: number): void => {
    if (idx === e) {
      best = Math.max(best, cur);
      return;
    }
    for (let val = m; val >= 1; val--) {
      if (!conflict(idx, val)) {
        value[idx] = val;
        dfs(idx + 1, cur + val);
        value[idx] = 0;
      }
    }
  };
  dfs(0, 0);
  return best;
}

// 测试
console.log(
  maxSumOfEdgeValuesInGraph(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
    ],
    3,
  ),
);
console.log(
  maxSumOfEdgeValuesBacktrack(
    4,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
    ],
    3,
  ),
);

export {};
