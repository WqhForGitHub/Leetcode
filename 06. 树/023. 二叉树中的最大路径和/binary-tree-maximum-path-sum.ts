// ============================================================
// 023. 二叉树中的最大路径和
// ============================================================
// LeetCode 124. Binary Tree Maximum Path Sum
// 二叉树中的路径被定义为一条节点序列，序列中每对相邻节点之间都有一条边相连。
// 求该路径的最大路径和（路径至少包含一个节点，不一定经过根节点）。
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

// 方法1：递归后序遍历（推荐）
// 关键：对于每个节点，计算以该节点为最高点的路径最大和；
// 同时递归返回以该节点为端点向下的最大贡献值（只能选左或右一条）。
function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;

  // 返回以 node 为端点向下的最大路径贡献值
  function maxGain(node: TreeNode | null): number {
    if (node === null) return 0;
    // 左右子树的最大贡献值，负数则取 0（不选）
    const leftGain = Math.max(maxGain(node.left), 0);
    const rightGain = Math.max(maxGain(node.right), 0);

    // 以当前节点为最高点的路径和
    const pathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, pathSum);

    // 向上只能选一条路径
    return node.val + Math.max(leftGain, rightGain);
  }

  maxGain(root);
  return maxSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 二叉树中的最大路径和 =====");
// 树: [1,2,3]
const tree023a = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("[1,2,3]:", maxPathSum(tree023a)); // 6 (2+1+3)

// 树: [-10,9,20,null,null,15,7]
const tree023b = new TreeNode(
  -10,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7)),
);
console.log("[-10,9,20,null,null,15,7]:", maxPathSum(tree023b)); // 42 (15+20+7)

// 树: [-3]
const tree023c = new TreeNode(-3);
console.log("[-3]:", maxPathSum(tree023c)); // -3

// 树: [2,-1]
const tree023d = new TreeNode(2, new TreeNode(-1));
console.log("[2,-1]:", maxPathSum(tree023d)); // 2

export {};
