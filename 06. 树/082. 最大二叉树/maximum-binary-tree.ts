// ============================================================
// 082. 最大二叉树
// ============================================================
// LeetCode 654. Maximum Binary Tree
// 给定一个不重复的整数数组 nums。
// 构造最大二叉树：根节点是数组中的最大值，左右子树递归构造。
// 时间复杂度：方法1 O(n^2)，方法2 O(n)；空间复杂度：O(n)

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

// 方法1：递归分治（推荐，易理解）
// 在 [left, right] 区间内找最大值作为根，递归构造左右子树
function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    // 找最大值的下标
    let maxIndex = left;
    for (let i = left + 1; i <= right; i++) {
      if (nums[i] > nums[maxIndex]) {
        maxIndex = i;
      }
    }
    const root = new TreeNode(nums[maxIndex]);
    root.left = build(left, maxIndex - 1);
    root.right = build(maxIndex + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}

// 方法2：单调栈（最优）
// 维护递减栈，当遇到比栈顶大的元素时弹出栈顶并作为新元素的左子树
// 弹出的栈顶元素的右子树被新元素取代
function constructMaximumBinaryTreeStack(nums: number[]): TreeNode | null {
  const stack: TreeNode[] = [];
  for (const num of nums) {
    const node = new TreeNode(num);
    // 弹出比当前小的元素，最后一个弹出的作为当前节点的左子树
    let lastPopped: TreeNode | null = null;
    while (stack.length > 0 && stack[stack.length - 1].val < num) {
      lastPopped = stack.pop()!;
    }
    node.left = lastPopped;
    if (stack.length > 0) {
      // 栈顶是第一个比当前大的元素，当前作为其右孩子
      stack[stack.length - 1].right = node;
    }
    stack.push(node);
  }
  return stack.length > 0 ? stack[0] : null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 最大二叉树 =====");

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
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
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: nums = [3,2,1,6,0,5]
//         6
//       /   \
//      3     5
//       \   /
//        2 0
//         \
//          1
console.log("递归:", treeToArray(constructMaximumBinaryTree([3, 2, 1, 6, 0, 5])));
// 期望 [6,3,5,null,2,0,null,null,1]
console.log("单调栈:", treeToArray(constructMaximumBinaryTreeStack([3, 2, 1, 6, 0, 5])));
// 期望 [6,3,5,null,2,0,null,null,1]

// 测试2: nums = [3,2,1]
//     3
//      \
//       2
//        \
//         1
console.log("递归:", treeToArray(constructMaximumBinaryTree([3, 2, 1]))); // 期望 [3,null,2,null,1]
console.log("单调栈:", treeToArray(constructMaximumBinaryTreeStack([3, 2, 1]))); // 期望 [3,null,2,null,1]

// 测试3: nums = [1]
console.log("递归:", treeToArray(constructMaximumBinaryTree([1]))); // 期望 [1]
console.log("单调栈:", treeToArray(constructMaximumBinaryTreeStack([1]))); // 期望 [1]

export {};
