// ============================================================
// 006. 将有序数组转换为二叉搜索树
// ============================================================
// LeetCode 108. Convert Sorted Array to Binary Search Tree
// 给你一个整数数组 nums，其中元素已经按升序排列，请你将其转换为一棵
// 高度平衡的二叉搜索树。高度平衡二叉树是指每个节点的左右两个子树的
// 高度差的绝对值不超过 1。
// 时间复杂度：O(n), 空间复杂度：O(log n)

// 二叉树节点定义
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

// 方法1：分治 - 取中间元素作为根（推荐）
// 取数组中点为根，左半部分递归构建左子树，右半部分递归构建右子树
// 时间复杂度 O(n)，空间复杂度 O(log n)（递归栈）
function sortedArrayToBST(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 取中点作为根（偏右中点）
    const mid: number = left + Math.floor((right - left) / 2);
    const root: TreeNode = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 方法2：分治 - 偶数长度时取中间偏左元素作为根
// 与方法1类似，但中点选取偏左，构建出形状略有不同的平衡 BST
// 时间复杂度 O(n)，空间复杂度 O(log n)
function sortedArrayToBSTLeft(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 取偏左中点：当长度为偶数时，选左边那个
    const mid: number = left + Math.floor((right - left + 1) / 2);
    const root: TreeNode = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 辅助函数：中序遍历（BST 中序应为升序）
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function traverse(node: TreeNode | null): void {
    if (node === null) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

// 辅助函数：计算树高
function treeHeight(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 将有序数组转换为二叉搜索树 =====");
const tree1: TreeNode | null = sortedArrayToBST([-10, -3, 0, 5, 9]);
console.log(inorderTraversal(tree1)); // 期望结果: [-10, -3, 0, 5, 9]（升序）
console.log("根节点值:", tree1!.val); // 期望结果: 0
console.log("左子树高:", treeHeight(tree1!.left)); // 期望结果: 2
console.log("右子树高:", treeHeight(tree1!.right)); // 期望结果: 2

const tree2: TreeNode | null = sortedArrayToBST([1, 3]);
console.log(inorderTraversal(tree2)); // 期望结果: [1, 3]
console.log("根节点值:", tree2!.val); // 期望结果: 1 或 3

console.log("--- 方法2测试 ---");
const tree3: TreeNode | null = sortedArrayToBSTLeft([-10, -3, 0, 5, 9]);
console.log(inorderTraversal(tree3)); // 期望结果: [-10, -3, 0, 5, 9]
const tree4: TreeNode | null = sortedArrayToBSTLeft([1, 3]);
console.log("根节点值:", tree4!.val); // 期望结果: 3（偏左中点）

export {};
