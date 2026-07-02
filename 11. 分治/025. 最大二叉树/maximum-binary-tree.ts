// ============================================================
// 025. 最大二叉树
// ============================================================
// LeetCode 654. Maximum Binary Tree
// 给定数组 nums，构造最大二叉树：
//   根是数组最大元素，左子树由最大元素左侧部分递归构造，右子树由右侧部分递归构造。
// 时间复杂度：O(n^2) 最坏 / O(n log n) 平均，空间复杂度：O(n)

// 二叉树节点定义
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

// 方法1：分治递归 + 线性扫描找最大值（推荐）
// 思路：在 [left, right] 区间内线性扫描找到最大值及其下标，
//       以该值为根，递归构造左右子树。
function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
  return build(nums, 0, nums.length - 1);
}

function build(nums: number[], left: number, right: number): TreeNode | null {
  if (left > right) return null;

  // 找到区间内最大值下标
  let maxIdx = left;
  for (let i = left + 1; i <= right; i++) {
    if (nums[i] > nums[maxIdx]) maxIdx = i;
  }

  const root = new TreeNode(nums[maxIdx]);
  root.left = build(nums, left, maxIdx - 1);
  root.right = build(nums, maxIdx + 1, right);
  return root;
}

// 方法2：单调栈（O(n)）
// 思路：维护一个递减栈。遍历每个 nums[i]：
//   - 弹出栈顶比 nums[i] 小的元素，最后一个被弹出的成为 nums[i] 的左孩子；
//   - 若弹出后栈非空，则栈顶的右孩子设为 nums[i]；
//   - 把 nums[i] 压栈。
//   最终栈底的元素就是整棵树的根。
function constructMaximumBinaryTreeStack(nums: number[]): TreeNode | null {
  const stack: TreeNode[] = [];

  for (const num of nums) {
    const node = new TreeNode(num);
    let lastPopped: TreeNode | null = null;

    // 弹出所有比当前值小的栈顶，最后一个弹出的作为当前节点左孩子
    while (stack.length > 0 && stack[stack.length - 1].val < num) {
      lastPopped = stack.pop()!;
    }

    node.left = lastPopped;

    // 若栈非空，当前节点是栈顶的右孩子
    if (stack.length > 0) {
      stack[stack.length - 1].right = node;
    }

    stack.push(node);
  }

  // 栈底元素为根
  return stack.length > 0 ? stack[0] : null;
}

// ============================================================
// 测试
// ============================================================
// 辅助：层序序列化二叉树（用于验证结构）
function serialize(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: Array<TreeNode | null> = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left, node.right);
    }
  }
  // 去掉末尾多余的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

console.log("===== 025. 最大二叉树 =====");
console.log(
  "分治 [3,2,1,6,0,5]:",
  JSON.stringify(serialize(constructMaximumBinaryTree([3, 2, 1, 6, 0, 5]))),
);
// 期望: [6,3,5,null,2,0,null,null,1]
console.log("分治 [3,2,1]:", JSON.stringify(serialize(constructMaximumBinaryTree([3, 2, 1]))));
// 期望: [3,null,2,null,1]
console.log(
  "单调栈 [3,2,1,6,0,5]:",
  JSON.stringify(serialize(constructMaximumBinaryTreeStack([3, 2, 1, 6, 0, 5]))),
);
// 期望: [6,3,5,null,2,0,null,null,1]
console.log(
  "单调栈 [3,2,1]:",
  JSON.stringify(serialize(constructMaximumBinaryTreeStack([3, 2, 1]))),
);
// 期望: [3,null,2,null,1]

export {};
