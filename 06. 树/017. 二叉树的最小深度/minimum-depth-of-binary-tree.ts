// ============================================================
// 017. 二叉树的最小深度
// ============================================================
// LeetCode 111. Minimum Depth of Binary Tree
// 给定一个二叉树，找出其最小深度。最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
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

// 方法1：递归（推荐）
function minDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  // 叶子节点
  if (root.left === null && root.right === null) return 1;
  // 只有右子树
  if (root.left === null) return minDepth(root.right) + 1;
  // 只有左子树
  if (root.right === null) return minDepth(root.left) + 1;
  // 左右子树都有
  return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
}

// 方法2：BFS 层序遍历（遇到第一个叶子节点即返回）
function minDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  const queue: TreeNode[] = [root];
  let depth = 0;
  while (queue.length > 0) {
    depth++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      // 遇到叶子节点直接返回当前深度
      if (node.left === null && node.right === null) {
        return depth;
      }
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return depth;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 二叉树的最小深度 =====");
// 树: [3,9,20,null,null,15,7]
const tree017 = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log("递归 [3,9,20,null,null,15,7]:", minDepth(tree017)); // 2
console.log("BFS   [3,9,20,null,null,15,7]:", minDepthBFS(tree017)); // 2

// 树: [2,null,3,null,4,null,5,null,6]
const tree017b = new TreeNode(
  2,
  null,
  new TreeNode(3, null, new TreeNode(4, null, new TreeNode(5, null, new TreeNode(6))))
);
console.log("递归 [2,null,3,null,4,null,5,null,6]:", minDepth(tree017b)); // 5
console.log("BFS   [2,null,3,null,4,null,5,null,6]:", minDepthBFS(tree017b)); // 5

console.log("空树:", minDepth(null)); // 0
console.log("空树:", minDepthBFS(null)); // 0

export {};
