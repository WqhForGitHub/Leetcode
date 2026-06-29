// ============================================================
// 018. 路径总和
// ============================================================
// LeetCode 112. Path Sum
// 给你二叉树的根节点 root 和一个整数 targetSum，判断树中是否存在根节点到叶子节点的路径，
// 这条路径上所有节点值相加等于目标和。
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
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;
  // 到达叶子节点，判断剩余值是否等于当前节点值
  if (root.left === null && root.right === null) {
    return targetSum === root.val;
  }
  // 递归检查左右子树，减去当前节点值
  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// 方法2：迭代 BFS（使用双队列分别存节点和当前路径和）
function hasPathSumBFS(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;
  const nodeQueue: TreeNode[] = [root];
  const sumQueue: number[] = [root.val];
  while (nodeQueue.length > 0) {
    const node = nodeQueue.shift()!;
    const sum = sumQueue.shift()!;
    // 叶子节点判断
    if (node.left === null && node.right === null) {
      if (sum === targetSum) return true;
      continue;
    }
    if (node.left !== null) {
      nodeQueue.push(node.left);
      sumQueue.push(sum + node.left.val);
    }
    if (node.right !== null) {
      nodeQueue.push(node.right);
      sumQueue.push(sum + node.right.val);
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 路径总和 =====");
// 树: [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22
const tree018 = new TreeNode(
  5,
  new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))),
  new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1)))
);
console.log("递归 targetSum=22:", hasPathSum(tree018, 22)); // true
console.log("BFS   targetSum=22:", hasPathSumBFS(tree018, 22)); // true

console.log("递归 targetSum=26:", hasPathSum(tree018, 26)); // false
console.log("BFS   targetSum=26:", hasPathSumBFS(tree018, 26)); // false

console.log("空树 targetSum=0:", hasPathSum(null, 0)); // false
console.log("空树 targetSum=0:", hasPathSumBFS(null, 0)); // false

// 单节点树
const singleNode = new TreeNode(1);
console.log("单节点 targetSum=1:", hasPathSum(singleNode, 1)); // true
console.log("单节点 targetSum=1:", hasPathSumBFS(singleNode, 1)); // true

export {};
