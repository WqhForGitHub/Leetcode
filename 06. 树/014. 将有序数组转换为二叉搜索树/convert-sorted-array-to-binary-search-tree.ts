// ============================================================
// 014. 将有序数组转换为二叉搜索树
// ============================================================
// LeetCode 108. Convert Sorted Array to Binary Search Tree
// 给你一个整数数组 nums，将其转换为高度平衡的二叉搜索树。
// 时间复杂度：O(n)，空间复杂度：O(log n) 递归栈

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

// 方法1：递归分治（推荐）
// 取中间元素作为根节点，递归构造左右子树
function sortedArrayToBST(nums: number[]): TreeNode | null {
  return buildBST(nums, 0, nums.length - 1);
}

function buildBST(nums: number[], left: number, right: number): TreeNode | null {
  if (left > right) return null;
  // 取中间元素作为根节点（保证平衡）
  const mid = Math.floor((left + right) / 2);
  const root = new TreeNode(nums[mid]);
  // 左半部分构造左子树
  root.left = buildBST(nums, left, mid - 1);
  // 右半部分构造右子树
  root.right = buildBST(nums, mid + 1, right);
  return root;
}

// 方法2：迭代
// 使用栈模拟递归过程
function sortedArrayToBSTIterative(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;
  const root = new TreeNode(0);
  // 栈中存储 {节点, 处理的左边界, 右边界}
  const stack: {
    node: TreeNode;
    left: number;
    right: number;
  }[] = [{ node: root, left: 0, right: nums.length - 1 }];

  while (stack.length > 0) {
    const { node, left, right } = stack.pop()!;
    const mid = Math.floor((left + right) / 2);
    node.val = nums[mid];
    // 处理左半部分
    if (left <= mid - 1) {
      node.left = new TreeNode(0);
      stack.push({ node: node.left, left: left, right: mid - 1 });
    }
    // 处理右半部分
    if (mid + 1 <= right) {
      node.right = new TreeNode(0);
      stack.push({ node: node.right, left: mid + 1, right: right });
    }
  }
  return root;
}

// 辅助函数：中序遍历（BST 中序遍历应为递增序列）
function inorderArray(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// 辅助函数：检查树是否平衡
function isBalanced(root: TreeNode | null): boolean {
  function check(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = check(node.left);
    const right = check(node.right);
    if (left === -1 || right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 014. 将有序数组转换为二叉搜索树 =====");
// 测试1: [-10,-3,0,5,9]
const tree1 = sortedArrayToBST([-10, -3, 0, 5, 9]);
console.log("[-10,-3,0,5,9] (递归) 中序:", JSON.stringify(inorderArray(tree1))); // [-10,-3,0,5,9]
console.log("是否平衡:", isBalanced(tree1)); // true

const tree1b = sortedArrayToBSTIterative([-10, -3, 0, 5, 9]);
console.log("[-10,-3,0,5,9] (迭代) 中序:", JSON.stringify(inorderArray(tree1b))); // [-10,-3,0,5,9]
console.log("是否平衡:", isBalanced(tree1b)); // true

// 测试2: [1,3]
const tree2 = sortedArrayToBST([1, 3]);
console.log("[1,3] (递归) 中序:", JSON.stringify(inorderArray(tree2))); // [1,3]
console.log("是否平衡:", isBalanced(tree2)); // true

// 测试3: [1]
const tree3 = sortedArrayToBST([1]);
console.log("[1] (递归) 中序:", JSON.stringify(inorderArray(tree3))); // [1]

export {};
