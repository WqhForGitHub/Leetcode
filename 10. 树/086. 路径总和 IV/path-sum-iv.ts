// ============================================================
// 086. 路径总和 IV
// ============================================================
// LeetCode 666. Path Sum IV
// 给定一个代表二叉树的三位数字列表，返回所有从根到叶路径的数字之和。
// 每个数字格式：百位=深度D(1-4)，十位=位置P(1-2^(D-1))，个位=值V
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：哈希表模拟树（推荐）
// 用 Map<depth, Map<position, value>> 模拟树
// 对每个叶子节点（没有左右孩子），向上累加到根
function pathSum(nums: number[]): number {
  // depth(1-4) -> position(1..) -> value
  const tree = new Map<number, Map<number, number>>();
  for (const num of nums) {
    const depth = Math.floor(num / 100);
    const pos = Math.floor((num % 100) / 10);
    const val = num % 10;
    if (!tree.has(depth)) tree.set(depth, new Map());
    tree.get(depth)!.set(pos, val);
  }
  let total = 0;
  // DFS：depth从1开始，pos从1开始，累积路径和
  function dfs(depth: number, pos: number, currentSum: number): void {
    const val = tree.get(depth)?.get(pos);
    if (val === undefined) return;
    currentSum += val;
    const leftPos = 2 * pos - 1;
    const rightPos = 2 * pos;
    const hasLeft = tree.get(depth + 1)?.has(leftPos) ?? false;
    const hasRight = tree.get(depth + 1)?.has(rightPos) ?? false;
    if (!hasLeft && !hasRight) {
      // 叶子节点
      total += currentSum;
      return;
    }
    dfs(depth + 1, leftPos, currentSum);
    dfs(depth + 1, rightPos, currentSum);
  }
  dfs(1, 1, 0);
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 路径总和 IV =====");

// 测试1: nums = [113,215,221]
// 深度1: pos1 val3 -> 根3
// 深度2: pos1 val5 -> 左孩子5，pos2 val1 -> 右孩子1
//    3
//   / \
//  5   1
// 路径：3+5=8, 3+1=4，和=12
console.log("测试1:", pathSum([113, 215, 221])); // 期望 12

// 测试2: nums = [113,221]
//    3
//     \
//      1
// 只有右孩子，路径 3+1=4
console.log("测试2:", pathSum([113, 221])); // 期望 4

// 测试3: nums = [111,217,314,425]
// 树:
//         1
//        /
//       7
//      /
//     4
//    /
//   5
// 但深度2 pos2 val7，所以根1的右孩子是7
// 深度3 pos1 val4，对应深度2 pos1 -> 但深度2 pos1不存在
// 实际：深度3 pos1 -> 父深度2 pos1；深度3 pos2 -> 父深度2 pos1
// 这里深度3 pos1 -> 父 pos (1+1)/2 = 1，深度2 pos1 不存在
// 深度4 pos1 -> 父深度3 pos1
// 重新看：[111,217,314,425]
// 111: 深度1 pos1 val1
// 217: 深度2 pos1... 不对，217 深度2 pos1 val7？百位2十位1个位7
//   是深度2 pos1 val7
// 314: 深度3 pos1 val4
// 425: 深度4 pos1 val5
// 但深度3 pos1的父是深度2 pos1=7，深度4 pos1父是深度3 pos1=4
//        1
//       /
//      7
//     /
//    4
//   /
//  5
// 路径：1+7+4+5=17
console.log("测试3:", pathSum([111, 217, 314, 425])); // 期望 17

// 测试4: 单节点
console.log("测试4:", pathSum([113])); // 期望 3

export {};
