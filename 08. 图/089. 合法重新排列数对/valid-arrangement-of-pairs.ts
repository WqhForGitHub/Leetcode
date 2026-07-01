// ============================================================
// 089. 合法重新排列数对
// ============================================================
// LeetCode 2097. Valid Arrangement of Pairs
// 给定 pairs，重新排列使得相邻 pair 的首尾相接（前一个 [a,b] 后一个 [b,c]）。
// 一定存在解。Hierholzer 算法求欧拉路径。
// 时间复杂度：O(n)，空间复杂度：O(n)

function validArrangement(pairs: number[][]): number[][] {
  // 建图：用 Map 记录邻接表（节点 -> 出边列表下标堆栈）
  const graph: Map<number, number[]> = new Map();
  const inDeg: Map<number, number> = new Map();
  const outDeg: Map<number, number> = new Map();
  for (const [u, v] of pairs) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u)!.push(v);
    outDeg.set(u, (outDeg.get(u) || 0) + 1);
    inDeg.set(v, (inDeg.get(v) || 0) + 1);
  }
  // 找欧拉路径起点：出度比入度大 1 的节点；否则任意有出边的节点
  let start: number = pairs[0][0];
  for (const [u] of graph) {
    if (outDeg.get(u)! - (inDeg.get(u) || 0) === 1) {
      start = u;
      break;
    }
  }
  // Hierholzer：栈模拟
  const stack: number[] = [start];
  const path: number[] = [];
  while (stack.length > 0) {
    const u: number = stack[stack.length - 1];
    const edges: number[] | undefined = graph.get(u);
    if (edges && edges.length > 0) {
      stack.push(edges.pop()!);
    } else {
      path.push(stack.pop()!);
    }
  }
  path.reverse();
  // 组装结果
  const ans: number[][] = [];
  for (let i: number = 0; i + 1 < path.length; i++) {
    ans.push([path[i], path[i + 1]]);
  }
  return ans;
}

// 方法1：Hierholzer 算法（栈模拟）
function f1(pairs: number[][]): number[][] {
  return validArrangement(pairs);
}

// 方法2：Hierholzer 算法（递归 + 记录边下标）
function f2(pairs: number[][]): number[][] {
  const graph: Map<number, number[]> = new Map();
  const inDeg: Map<number, number> = new Map();
  const outDeg: Map<number, number> = new Map();
  for (const [u, v] of pairs) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u)!.push(v);
    outDeg.set(u, (outDeg.get(u) || 0) + 1);
    inDeg.set(v, (inDeg.get(v) || 0) + 1);
  }
  let start: number = pairs[0][0];
  for (const [u] of graph) {
    if (outDeg.get(u)! - (inDeg.get(u) || 0) === 1) {
      start = u;
      break;
    }
  }
  const path: number[] = [];
  const dfs = (u: number): void => {
    const edges: number[] | undefined = graph.get(u);
    while (edges && edges.length > 0) {
      const v: number = edges.pop()!;
      dfs(v);
    }
    path.push(u);
  };
  dfs(start);
  path.reverse();
  const ans: number[][] = [];
  for (let i: number = 0; i + 1 < path.length; i++) {
    ans.push([path[i], path[i + 1]]);
  }
  return ans;
}

console.log("===== 089. 合法重新排列数对 =====");
// 测试
console.log(
  JSON.stringify(
    f1([
      [5, 1],
      [4, 5],
      [11, 9],
      [9, 4],
    ]),
  ),
); // [[11,9],[9,4],[4,5],[5,1]]
console.log(
  JSON.stringify(
    f2([
      [5, 1],
      [4, 5],
      [11, 9],
      [9, 4],
    ]),
  ),
); // [[11,9],[9,4],[4,5],[5,1]]
console.log(
  JSON.stringify(
    f1([
      [1, 3],
      [3, 2],
      [2, 1],
    ]),
  ),
); // [[1,3],[3,2],[2,1]]
console.log(
  JSON.stringify(
    f2([
      [1, 3],
      [3, 2],
      [2, 1],
    ]),
  ),
); // [[1,3],[3,2],[2,1]]

export {};
