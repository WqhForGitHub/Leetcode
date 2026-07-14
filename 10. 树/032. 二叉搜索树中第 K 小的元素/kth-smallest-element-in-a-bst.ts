// ============================================================
// 032. 二叉搜索树中第 K 小的元素
// ============================================================
// LeetCode 230. Kth Smallest Element in a BST
// 给定一个二叉搜索树的根节点 root 和一个整数 k，设计一个算法查找其中第 k 小的元素。
// 时间复杂度：O(H + k)，空间复杂度：O(H)

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

// 方法1：中序遍历递归（推荐）
function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0;
  let result = 0;
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    count++;
    if (count === k) {
      result = node.val;
      return;
    }
    if (count < k) inorder(node.right);
  }
  inorder(root);
  return result;
}

// 方法2：中序遍历迭代栈
function kthSmallestIterative(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop()!;
    k--;
    if (k === 0) return curr.val;
    curr = curr.right;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 二叉搜索树中第 K 小的元素 =====");
// 构造 BST: [3,1,4,null,2]
const tree32 = new TreeNode(3, new TreeNode(1, null, new TreeNode(2)), new TreeNode(4));
console.log("递归 k=1:", kthSmallest(tree32, 1)); // 期望 1
console.log("迭代 k=1:", kthSmallestIterative(tree32, 1)); // 期望 1
// 注意：递归会修改状态，重新构造树测试
const tree32b = new TreeNode(
  5,
  new TreeNode(3, new TreeNode(2, new TreeNode(1)), new TreeNode(4)),
  new TreeNode(6),
);
console.log("递归 k=3:", kthSmallest(tree32b, 3)); // 期望 3
const tree32c = new TreeNode(
  5,
  new TreeNode(3, new TreeNode(2, new TreeNode(1)), new TreeNode(4)),
  new TreeNode(6),
);
console.log("迭代 k=3:", kthSmallestIterative(tree32c, 3)); // 期望 3

export {};
