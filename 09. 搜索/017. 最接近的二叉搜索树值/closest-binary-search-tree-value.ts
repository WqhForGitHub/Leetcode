// ============================================================
// 017. 最接近的二叉搜索树值
// ============================================================
// LeetCode 270. Closest Binary Search Tree Value
// 给定非空二叉搜索树的根节点和一个目标值，找到树中最接近目标值的节点值。

class TreeNode270 {
  val: number;
  left: TreeNode270 | null;
  right: TreeNode270 | null;
  constructor(val?: number, left?: TreeNode270 | null, right?: TreeNode270 | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 方法1：利用 BST 特性二分搜索（O(log n)）
function closestValue(root: TreeNode270 | null, target: number): number {
  let closest = root!.val;
  let node: TreeNode270 | null = root;
  while (node) {
    if (Math.abs(node.val - target) < Math.abs(closest - target)) {
      closest = node.val;
    }
    if (target < node.val) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return closest;
}

// 方法2：中序遍历得到有序数组再二分（O(n)）
function closestValueInorder(
  root: TreeNode270 | null,
  target: number
): number {
  const vals: number[] = [];
  function inorder(node: TreeNode270 | null) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  let left = 0;
  let right = vals.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (vals[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  // 比较 left 和 left-1
  if (
    left > 0 &&
    Math.abs(vals[left - 1] - target) <= Math.abs(vals[left] - target)
  ) {
    return vals[left - 1];
  }
  return vals[left];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 最接近的二叉搜索树值 =====");
const bst = new TreeNode270(
  4,
  new TreeNode270(2, new TreeNode270(1), new TreeNode270(3)),
  new TreeNode270(5)
);
console.log("BST搜索 4,3.714286:", closestValue(bst, 3.714286)); // 4
console.log("中序 4,3.714286:", closestValueInorder(bst, 3.714286)); // 4

export {};
