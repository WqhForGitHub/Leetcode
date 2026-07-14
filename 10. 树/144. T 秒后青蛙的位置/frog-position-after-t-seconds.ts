// ============================================================
// 144. T 秒后青蛙的位置
// ============================================================
// LeetCode 1377. Frog Position After T Seconds
// 给定一棵无向树（n个顶点编号1到n），青蛙从顶点1出发跳跃 t 秒，
// 每秒跳到等概率的未被访问的相邻顶点。若到达目标顶点后无未访问邻居则停留。
// 求 t 秒后青蛙在 target 上的概率。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：DFS递归（推荐）
// 建图后DFS，记录当前节点、父节点、已用时间、当前概率
function frogPosition(n: number, edges: number[][], t: number, target: number): number {
  // 建邻接表
  const graph: number[][] = new Array(n + 1).fill(0).map(() => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  let result = 0;

  // dfs返回是否找到目标
  function dfs(node: number, parent: number, time: number, prob: number): boolean {
    // 计算未访问的邻居数
    let unvisitedChildren = 0;
    for (const next of graph[node]) {
      if (next !== parent) unvisitedChildren++;
    }

    // 到达目标节点
    if (node === target) {
      // 时间用完，或者时间没用完但没有未访问邻居（青蛙停留）
      if (time === t) {
        result = prob;
        return true;
      }
      if (time < t && unvisitedChildren === 0) {
        result = prob;
        return true;
      }
      // 时间没用完且还有邻居，青蛙会跳走，不在target
      return true;
    }

    // 未到目标，时间已用完
    if (time === t) return false;

    // 继续向邻居跳
    if (unvisitedChildren === 0) return false; // 无路可走，未到目标

    const nextProb = prob / unvisitedChildren;
    for (const next of graph[node]) {
      if (next !== parent) {
        if (dfs(next, node, time + 1, nextProb)) return true;
      }
    }
    return false;
  }

  dfs(1, -1, 0, 1);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 144. T 秒后青蛙的位置 =====");

// 测试1: n=7, edges=[[1,2],[1,3],[1,7],[2,4],[2,6],[3,5]], t=2, target=4
// 树形:
//        1
//       /|\
//      2 3 7
//     /| |
//    4 6 5
// 青蛙1->2(概率1/3)->4(概率1/3 * 1/2 = 1/6)
console.log(
  "测试1:",
  frogPosition(
    7,
    [
      [1, 2],
      [1, 3],
      [1, 7],
      [2, 4],
      [2, 6],
      [3, 5],
    ],
    2,
    4,
  ),
); // 期望 0.166666...
console.log("测试1 分数约 1/6 =", 1 / 6);

// 测试2: n=7, 同上, t=1, target=7
// 青蛙1->7(概率1/3)
console.log(
  "测试2:",
  frogPosition(
    7,
    [
      [1, 2],
      [1, 3],
      [1, 7],
      [2, 4],
      [2, 6],
      [3, 5],
    ],
    1,
    7,
  ),
); // 期望 0.333333...

// 测试3: n=7, 同上, t=20, target=6
// 青蛙1->2(1/3)->6(1/3*1/2=1/6), 到6后无邻居停留到20秒
console.log(
  "测试3:",
  frogPosition(
    7,
    [
      [1, 2],
      [1, 3],
      [1, 7],
      [2, 4],
      [2, 6],
      [3, 5],
    ],
    20,
    6,
  ),
); // 期望 0.166666...

// 测试4: n=3, edges=[[2,1],[3,2]], t=1, target=2
// 1-2-3, 青蛙1->2(概率1)
console.log(
  "测试4:",
  frogPosition(
    3,
    [
      [2, 1],
      [3, 2],
    ],
    1,
    2,
  ),
); // 期望 1

export {};
