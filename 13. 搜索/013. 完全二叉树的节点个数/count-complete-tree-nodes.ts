// ============================================================
// 013. 完全二叉树的节点个数
// ============================================================
// LeetCode 222. Count Complete Tree Nodes
// 给定完全二叉树的根节点，返回树的节点个数。时间复杂度低于 O(n)。

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 方法1：利用完全二叉树特性二分（O(log² n)）
function countNodes(root: TreeNode | null): number {
  if (!root) return 0;
  let leftDepth = 0;
  let node: TreeNode | null = root;
  while (node) {
    leftDepth++;
    node = node.left;
  }
  let rightDepth = 0;
  node = root;
  while (node) {
    rightDepth++;
    node = node.right;
  }
  // 如果左右深度相同，是满二叉树
  if (leftDepth === rightDepth) {
    return Math.pow(2, leftDepth) - 1;
  }
  // 否则递归
  return 1 + countNodes(root.left) + countNodes(root.right);
}

// 方法2：二分查找最后一层（O(log² n)）
function countNodesBinary(root: TreeNode | null): number {
  if (!root) return 0;
  // 计算深度
  let depth = 0;
  let node: TreeNode | null = root;
  while (node.left) {
    depth++;
    node = node.left;
  }
  if (depth === 0) return 1;
  // 最后一层节点数范围 [1, 2^depth - 1]
  let left = 1;
  let right = Math.pow(2, depth) - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (exists(root, depth, mid)) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // 前 depth 层 + 最后一层的节点数
  return Math.pow(2, depth) - 1 + left;
}

// 判断第 depth 层第 idx 个节点是否存在（idx 从 1 开始）
function exists(root: TreeNode, depth: number, idx: number): boolean {
  let node: TreeNode | null = root;
  let left = 0;
  let right = Math.pow(2, depth) - 1;
  for (let i = 0; i < depth; i++) {
    const mid = Math.floor((left + right) / 2);
    if (idx <= mid) {
      node = node!.left;
      right = mid;
    } else {
      node = node!.right;
      left = mid + 1;
    }
  }
  return node !== null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 完全二叉树的节点个数 =====");
const tree = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, new TreeNode(6), null),
);
console.log("特性法:", countNodes(tree)); // 6
console.log("二分法:", countNodesBinary(tree)); // 6

export {};
