// ============================================================
// 048. 寻找二叉树的叶子节点
// ============================================================
// LeetCode 366. Find Leaves of Binary Tree
// 给你一棵二叉树，请按从叶节点到根节点的顺序收集并移除所有叶子节点，
// 重复直到树为空。返回每次收集的叶子节点列表。
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

// 方法1：DFS计算高度分组（推荐）
// 每个节点的"高度" = 它到最远叶子节点的距离（叶子高度为0）
// 相同高度的节点会在同一轮被收集
function findLeaves(root: TreeNode | null): number[][] {
  const result: number[][] = [];

  // 返回节点的高度，同时将节点值加入到对应高度的分组
  function getHeight(node: TreeNode | null): number {
    if (node === null) return -1;
    const leftHeight = getHeight(node.left);
    const rightHeight = getHeight(node.right);
    const height = Math.max(leftHeight, rightHeight) + 1;
    // 如果该高度还没有分组，则创建
    if (result.length === height) {
      result.push([]);
    }
    result[height].push(node.val);
    return height;
  }

  getHeight(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 寻找二叉树的叶子节点 =====");
// 构造树: [1,2,3,4,5]
//       1
//      / \
//     2   3
//    / \
//   4   5
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(3);
tree1.left.left = new TreeNode(4);
tree1.left.right = new TreeNode(5);
console.log("findLeaves:", findLeaves(tree1)); // 期望结果 [[4,5,3],[2],[1]]

// 构造树: [1]
const tree2 = new TreeNode(1);
console.log("findLeaves:", findLeaves(tree2)); // 期望结果 [[1]]

export {};
