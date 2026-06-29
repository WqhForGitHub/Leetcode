// ============================================================
// 08. 将有序数组转换为二叉搜索树
// ============================================================
// LeetCode 108. Convert Sorted Array to Binary Search Tree
// 给定升序数组，将其转换为高度平衡的二叉搜索树。
// 时间复杂度：O(n)，空间复杂度：O(log n)（递归栈深度）

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

// 方法1：递归-取中间元素为根（推荐）
// 取区间中点为根，左半区间构造左子树，右半区间构造右子树
function sortedArrayToBST(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 左中点：(left + right) / 2 的下取整，保证左右子树节点数差不超过 1
    const mid = Math.floor((left + right) / 2);
    const root = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 方法2：递归-取中间偏右元素为根
// 与方法1类似，选择右中点为根，构造出的 BST 形态不同但同样平衡
function sortedArrayToBSTRightMid(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 右中点：(left + right + 1) / 2 的下取整
    // 当区间长度为偶数时，选择靠右的中点，使右子树节点数更少
    const mid = Math.floor((left + right + 1) / 2);
    const root = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 辅助函数：层序遍历序列化二叉树（用于测试展示，null 用 null 表示）
function serialize(root: TreeNode | null): (number | null)[] {
  const result: (number | null)[] = [];
  if (root === null) return result;
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  // 去掉末尾多余的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 08. 将有序数组转换为二叉搜索树 =====");
console.log("取中间元素 [-10,-3,0,5,9]:", serialize(sortedArrayToBST([-10, -3, 0, 5, 9]))); // 期望结果 [0,-10,5,null,-3,null,9]（左中点，形态之一）
console.log("取中间元素 [1,3]:", serialize(sortedArrayToBST([1, 3]))); // 期望结果 [1,null,3]
console.log("取中间偏右 [-10,-3,0,5,9]:", serialize(sortedArrayToBSTRightMid([-10, -3, 0, 5, 9]))); // 期望结果 [0,-3,9,-10,null,5]（右中点，形态之一）
console.log("取中间偏右 [1,3]:", serialize(sortedArrayToBSTRightMid([1, 3]))); // 期望结果 [3,1]
console.log("空数组 []:", serialize(sortedArrayToBST([]))); // 期望结果 []

export {};
