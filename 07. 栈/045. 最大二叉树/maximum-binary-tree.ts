// ============================================================
// 045. 最大二叉树
// ============================================================
// LeetCode 654. Maximum Binary Tree
// 给定一个不重复整数数组，构造最大二叉树：根为数组最大值，左右子树递归构造左右子数组。

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 维护单调递减栈。当前节点比栈顶大时，弹出栈顶，弹出的左子树挂到当前节点左指针；
// 当前节点作为栈新顶的右子树。时间 O(n)，空间 O(n)。
function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
  const stack: TreeNode[] = [];
  for (const num of nums) {
    const node = new TreeNode(num);
    let lastPopped: TreeNode | null = null;
    while (stack.length > 0 && stack[stack.length - 1].val < num) {
      lastPopped = stack.pop()!;
    }
    node.left = lastPopped;
    if (stack.length > 0) {
      stack[stack.length - 1].right = node;
    }
    stack.push(node);
  }
  return stack.length > 0 ? stack[0] : null;
}

// ------------------------------------------------------------
// 方法2：递归
// ------------------------------------------------------------
function constructMaximumBinaryTreeRecursive(nums: number[]): TreeNode | null {
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    let maxIdx = left;
    for (let i = left + 1; i <= right; i++) {
      if (nums[i] > nums[maxIdx]) maxIdx = i;
    }
    const node = new TreeNode(nums[maxIdx]);
    node.left = build(left, maxIdx - 1);
    node.right = build(maxIdx + 1, right);
    return node;
  }
  return build(0, nums.length - 1);
}

function preorder(node: TreeNode | null): number[] {
  if (node === null) return [];
  return [node.val, ...preorder(node.left), ...preorder(node.right)];
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1 - 栈法:",
    preorder(constructMaximumBinaryTree([3, 2, 1, 6, 0, 5])),
    "期望: [6,3,2,1,5,0,5]",
  );
  console.log(
    "测试2 - 递归:",
    preorder(constructMaximumBinaryTreeRecursive([3, 2, 1, 6, 0, 5])),
    "期望: [6,3,2,1,5,0,5]",
  );
}

test();

export {};
