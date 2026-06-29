// ============================================================
// 055. 路径总和 III
// ============================================================
// LeetCode 437. Path Sum III
// 给定一个二叉树的根节点 root 和一个整数 targetSum，
// 求该二叉树里节点值之和等于 targetSum 的路径的数目。
// 路径不需要从根节点开始，也不需要在叶子节点结束，
// 但是路径方向必须是向下的（只能从父节点到子节点）。
// 时间复杂度：O(n)，空间复杂度：O(n)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：前缀和+DFS（推荐）
// 类似数组的前缀和思想：如果当前前缀和为 curSum，
// 且之前存在前缀和为 curSum - targetSum 的节点，
// 则这两个节点之间的路径和为 targetSum
function pathSum(root: TreeNode | null, targetSum: number): number {
  // 前缀和 -> 出现次数
  const prefixSumCount = new Map<number, number>();
  // 初始化：前缀和0出现1次（从根开始的路径）
  prefixSumCount.set(0, 1);
  let result = 0;

  function dfs(node: TreeNode | null, currentSum: number): void {
    if (node === null) return;
    // 当前前缀和
    currentSum += node.val;
    // 查找是否存在前缀和为 currentSum - targetSum
    const need = currentSum - targetSum;
    result += prefixSumCount.get(need) ?? 0;
    // 更新前缀和计数
    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) ?? 0) + 1);
    // 递归处理子节点
    dfs(node.left, currentSum);
    dfs(node.right, currentSum);
    // 回溯：移除当前前缀和
    const count = prefixSumCount.get(currentSum)!;
    if (count === 1) {
      prefixSumCount.delete(currentSum);
    } else {
      prefixSumCount.set(currentSum, count - 1);
    }
  }

  dfs(root, 0);
  return result;
}

// 方法2：双重递归
// 外层递归遍历每个节点作为路径起点，内层递归计算以该节点为起点的路径数
function pathSumDouble(root: TreeNode | null, targetSum: number): number {
  if (root === null) return 0;
  // 以当前节点为起点的路径数 + 左子树的路径数 + 右子树的路径数
  return (
    countPathsFrom(root, targetSum) +
    pathSumDouble(root.left, targetSum) +
    pathSumDouble(root.right, targetSum)
  );
}

// 计算以 node 为起点，和为 targetSum 的路径数
function countPathsFrom(node: TreeNode | null, targetSum: number): number {
  if (node === null) return 0;
  let count = 0;
  if (node.val === targetSum) count++;
  count += countPathsFrom(node.left, targetSum - node.val);
  count += countPathsFrom(node.right, targetSum - node.val);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 路径总和 III =====");
// 构造树: [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
//         10
//        /  \
//       5    -3
//      / \     \
//     3   2    11
//    / \   \
//   3  -2   1
const tree1 = new TreeNode(10);
tree1.left = new TreeNode(5);
tree1.right = new TreeNode(-3);
tree1.left.left = new TreeNode(3);
tree1.left.right = new TreeNode(2);
tree1.right.right = new TreeNode(11);
tree1.left.left.left = new TreeNode(3);
tree1.left.left.right = new TreeNode(-2);
tree1.left.right.right = new TreeNode(1);
console.log("前缀和DFS:", pathSum(tree1, 8)); // 期望结果 3
console.log("双重递归:", pathSumDouble(tree1, 8)); // 期望结果 3

// 构造树: [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
const tree2 = new TreeNode(5);
tree2.left = new TreeNode(4);
tree2.right = new TreeNode(8);
tree2.left.left = new TreeNode(11);
tree2.right.left = new TreeNode(13);
tree2.right.right = new TreeNode(4);
tree2.left.left.left = new TreeNode(7);
tree2.left.left.right = new TreeNode(2);
tree2.right.right.left = new TreeNode(5);
tree2.right.right.right = new TreeNode(1);
console.log("前缀和DFS:", pathSum(tree2, 22)); // 期望结果 3
console.log("双重递归:", pathSumDouble(tree2, 22)); // 期望结果 3

export {};
