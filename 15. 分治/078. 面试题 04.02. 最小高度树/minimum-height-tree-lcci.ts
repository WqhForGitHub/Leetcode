// ============================================================
// 078. 面试题 04.02. 最小高度树
// ============================================================
// LeetCode 面试题 04.02 / 108. Minimum Height Tree
// 给定一个有序整数数组，元素各不相同且按升序排列，
// 编写算法创建一棵高度最小的二叉搜索树。
// 时间复杂度：O(n), 空间复杂度：O(log n)

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

// 方法1：分治 - 取中间元素为根（推荐）
// 每次取数组中间元素作为根，左半递归构造左子树，右半递归构造右子树
// 时间复杂度 O(n)，空间复杂度 O(log n) 递归栈
function sortedArrayToBSTMid(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) {
      return null;
    }
    const mid: number = left + Math.floor((right - left) / 2);
    const root: TreeNode = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 方法2：分治 - 偶数长度时取中间偏左元素为根
// 取 Math.floor((left + right) / 2)，与法1相同思路，但偶数时取左中点
// 这里采用 (left + right + 1) >> 1 即向上取整做对比
// 时间复杂度 O(n)，空间复杂度 O(log n)
function sortedArrayToBSTMidRight(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) {
      return null;
    }
    // 偶数长度时取右中点
    const mid: number = left + Math.floor((right - left + 1) / 2);
    const root: TreeNode = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 辅助：层序遍历转数组（用于测试输出）
function treeToArray(root: TreeNode | null): (number | null)[] {
  const result: (number | null)[] = [];
  const queue: Array<TreeNode | null> = [root];
  while (queue.length > 0) {
    const node: TreeNode | null = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 辅助：计算树的高度
function treeHeight(root: TreeNode | null): number {
  if (root === null) {
    return 0;
  }
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 面试题 04.02. 最小高度树 =====");
console.log(treeToArray(sortedArrayToBSTMid([-10, -3, 0, 5, 9]))); // 期望结果: [0, -3, 9, -10, null, 5]
console.log(treeToArray(sortedArrayToBSTMid([1, 3]))); // 期望结果: [1, null, 3] 或 [3, 1]
console.log(treeHeight(sortedArrayToBSTMid([-10, -3, 0, 5, 9]))); // 期望结果: 3
console.log("--- 方法2测试 ---");
console.log(treeToArray(sortedArrayToBSTMidRight([-10, -3, 0, 5, 9]))); // 期望结果: [0, -3, 9, -10, null, 5]
console.log(treeHeight(sortedArrayToBSTMidRight([1, 2, 3, 4, 5, 6, 7]))); // 期望结果: 3

export {};
