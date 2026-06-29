// ============================================================
// 174. 重构一棵树的方案数
// ============================================================
// LeetCode 1719. Number Of Ways To Reconstruct A Tree
// 给定一个数对数组 pairs，其中 pairs[i] = [xi, yi] 表示节点 xi 和 yi 在树中相邻。
// 返回能重构出的不同树的方案数：0（不可能）、1（唯一）、2（多种）。
// 时间复杂度：O(n^2 + p)，空间复杂度：O(n^2)

// 方法1：贪心+度数排序（推荐）
// 思路：
// 1. 用邻接集合记录每个节点的邻居
// 2. 按邻居数量（度数）从小到大排序
// 3. 度数最小的节点必然是叶子（或根），逐个尝试放置节点
// 4. 对于当前节点，找到已放置的邻居中度数最小的作为父节点
// 5. 检查当前节点的邻居集合是否是父节点邻居集合的子集
// 6. 统计方案数：如果某层有多个可选父节点，则方案数为 2
function checkWays(pairs: number[][]): number {
  // 建立邻接表（用集合）
  const adj = new Map<number, Set<number>>();
  for (const [u, v] of pairs) {
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    adj.get(u)!.add(v);
    adj.get(v)!.add(u);
  }

  // 将邻居集合中加入节点自身（方便子集判断）
  const adjSelf = new Map<number, Set<number>>();
  for (const [node, neighbors] of adj) {
    const s = new Set(neighbors);
    s.add(node);
    adjSelf.set(node, s);
  }

  // 按度数（邻居数）降序排序，度数最大的节点应该是根
  const sortedNodes = [...adj.keys()].sort(
    (a, b) => adj.get(b)!.size - adj.get(a)!.size
  );

  let result = 1; // 默认唯一
  // parent 映射：已放置节点的父节点
  const parent = new Map<number, number | null>();

  for (const node of sortedNodes) {
    // 找到已放置的邻居中度数 >= 当前节点度数的最小度数节点作为父节点
    let p: number | null = null;
    for (const neighbor of adj.get(node)!) {
      if (parent.has(neighbor)) {
        if (
          p === null ||
          adj.get(neighbor)!.size < adj.get(p)!.size
        ) {
          p = neighbor;
        }
      }
    }
    parent.set(node, p);

    if (p === null) {
      // 当前节点是根，它的邻居集合应包含所有其他节点
      if (adj.get(node)!.size !== sortedNodes.length - 1) {
        return 0;
      }
    } else {
      // 检查当前节点的邻居集合（含自身）是否是父节点邻居集合的子集
      const nodeSet = adjSelf.get(node)!;
      const parentSet = adjSelf.get(p)!;
      let isSubset = true;
      for (const x of nodeSet) {
        if (!parentSet.has(x)) {
          isSubset = false;
          break;
        }
      }
      if (!isSubset) return 0;

      // 检查是否有多个可选父节点（度数相同），若有则方案数可能为 2
      // 当 nodeSet === parentSet 时，node 和 p 可互换位置，方案数 +1
      if (nodeSet.size === parentSet.size) {
        result = 2;
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 174. 重构一棵树的方案数 =====");

// 测试1: pairs = [[1,2],[2,3]]
// 树: 1-2-3，唯一方案
//     2
//    / \
//   1   3
console.log("测试1:", checkWays([[1, 2], [2, 3]])); // 期望 1

// 测试2: pairs = [[1,2],[2,3],[1,3]]
// 1,2,3 互相相邻，有 3 种树结构（1、2、3 任一为根）
console.log("测试2:", checkWays([[1, 2], [2, 3], [1, 3]])); // 期望 2

// 测试3: pairs = [[1,2],[2,3],[2,4],[1,5]]
// 不可能构成合法树（1 的邻居有 2,5，但 5 只和 1 相邻，2 的邻居有 1,3,4）
// 检查：1-2, 1-5, 2-3, 2-4
//       2
//      /|\
//     1 3 4
//     |
//     5  这是合法的，方案唯一
console.log("测试3:", checkWays([[1, 2], [2, 3], [2, 4], [1, 5]])); // 期望 1

// 测试4: pairs = [[1,2],[2,3],[3,1]]
// 三角形，方案 2
console.log("测试4:", checkWays([[1, 2], [2, 3], [3, 1]])); // 期望 2

// 测试5: pairs = [[1,2],[2,3],[3,4],[4,5],[5,6]]
// 链状，唯一
console.log("测试5:", checkWays([[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]])); // 期望 1

export {};
