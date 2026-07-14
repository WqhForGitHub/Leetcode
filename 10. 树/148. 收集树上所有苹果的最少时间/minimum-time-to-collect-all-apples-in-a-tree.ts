// ============================================================
// 148. 收集树上所有苹果的最少时间
// ============================================================
// LeetCode 1443. Minimum Time to Collect All Apples in a Tree
// 给定一棵无向树（n个节点编号0到n-1），edges 表示边，hasApple[i] 表示节点 i 是否有苹果。
// 从节点 0 出发，收集所有苹果并返回节点 0 所需的最少时间（边数）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：DFS递归（推荐）
// 建图后DFS，对每个子树返回：收集该子树所有苹果并返回所需时间
// 若子树根或子树中有苹果，则需要往返该边，时间+2
function minTime(n: number, edges: number[][], hasApple: boolean[]): number {
  // 建邻接表
  const graph: number[][] = new Array(n).fill(0).map(() => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  function dfs(node: number, parent: number): number {
    let totalTime = 0;
    for (const child of graph[node]) {
      if (child === parent) continue;
      const childTime = dfs(child, node);
      // 子树有苹果(子树时间>0)或子节点本身有苹果，则需往返
      if (childTime > 0 || hasApple[child]) {
        totalTime += childTime + 2;
      }
    }
    return totalTime;
  }

  return dfs(0, -1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 148. 收集树上所有苹果的最少时间 =====");

// 测试1: n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,true,false,true,true,false]
// 树形:
//        0
//       / \
//      1   2
//     / \ / \
//    4  5 3  6
// 苹果在: 2,4,5
// 路径: 0->2(2有苹果)=2, 0->1->4(4有苹果)=4, 0->1->5(5有苹果)=4
// 总=2+4+4=10
console.log(
  "测试1:",
  minTime(
    7,
    [
      [0, 1],
      [0, 2],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 6],
    ],
    [false, false, true, false, true, true, false],
  ),
); // 期望 8
// 实际: 0->1->4 (2边) + 0->1->5 (2边) + 0->2 (1边)
// 但1经过两次,合并: 0->1->4(往返4) + 0->1->5(往返4) = 但0->1边只走一次往返=2
// 实际: 子树1: 收集4和5, 1->4往返2 + 1->5往返2 = 4, 加上0->1往返2 = 6
// 子树2: 2有苹果, 0->2往返2 = 2
// 总=8
console.log("测试1 期望 8");

// 测试2: n=7, edges同上, hasApple=[false,false,true,false,false,true,false]
// 苹果在: 2,5
// 子树1: 只5有苹果, 1->5往返2, 加0->1往返2 = 4
// 子树2: 2有苹果, 0->2往返2 = 2
// 总=6
console.log(
  "测试2:",
  minTime(
    7,
    [
      [0, 1],
      [0, 2],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 6],
    ],
    [false, false, true, false, false, true, false],
  ),
); // 期望 6

// 测试3: n=7, edges同上, hasApple=[false,false,false,false,false,false,false]
// 无苹果
console.log(
  "测试3:",
  minTime(
    7,
    [
      [0, 1],
      [0, 2],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 6],
    ],
    [false, false, false, false, false, false, false],
  ),
); // 期望 0

// 测试4: n=4, edges=[[0,2],[0,3],[1,2]], hasApple=[false,true,false,false]
// 0-2-1, 0-3
// 苹果在1: 0->2->1 往返4
console.log(
  "测试4:",
  minTime(
    4,
    [
      [0, 2],
      [0, 3],
      [1, 2],
    ],
    [false, true, false, false],
  ),
); // 期望 4

export {};
