// ============================================================
// 004. 从前序与中序遍历序列构造二叉树
// ============================================================
// LeetCode 105. Construct Binary Tree from Preorder and Inorder Traversal
// 给定两个整数数组 preorder 和 inorder，其中 preorder 是二叉树的先序遍历，
// inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
// 时间复杂度：O(n), 空间复杂度：O(n)

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

// 方法1：递归分治 + 哈希表优化（推荐）
// 先序遍历第一个元素为根，用哈希表在中序中定位根，分治构建左右子树
// 时间复杂度 O(n)，空间复杂度 O(n)
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // 中序值 -> 索引 的映射，O(1) 查找
  const indexMap: Map<number, number> = new Map<number, number>();
  for (let i: number = 0; i < inorder.length; i++) {
    indexMap.set(inorder[i], i);
  }

  // 分治：构建 preorder[preStart..preEnd] 对应的子树
  // inStart 为该子树在中序数组中的起始位置
  function build(
    preStart: number,
    preEnd: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null {
    if (preStart > preEnd) return null;

    // 先序第一个为根节点
    const rootVal: number = preorder[preStart];
    const root: TreeNode = new TreeNode(rootVal);

    // 在中序中定位根的位置
    const inRoot: number = indexMap.get(rootVal)!;
    const leftSize: number = inRoot - inStart;

    // 递归构建左子树
    root.left = build(preStart + 1, preStart + leftSize, inStart, inRoot - 1);
    // 递归构建右子树
    root.right = build(preStart + leftSize + 1, preEnd, inRoot + 1, inEnd);

    return root;
  }

  return build(0, preorder.length - 1, 0, inorder.length - 1);
}

// 方法2：递归分治（无哈希表，线性查找）
// 每次在中序数组中线性查找根节点位置
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function buildTreeLinear(preorder: number[], inorder: number[]): TreeNode | null {
  // 在 inorder[inStart..inEnd] 中查找 target 的索引
  function findIndex(arr: number[], target: number, start: number, end: number): number {
    for (let i: number = start; i <= end; i++) {
      if (arr[i] === target) return i;
    }
    return -1;
  }

  function build(
    preStart: number,
    preEnd: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null {
    if (preStart > preEnd) return null;

    const rootVal: number = preorder[preStart];
    const root: TreeNode = new TreeNode(rootVal);

    const inRoot: number = findIndex(inorder, rootVal, inStart, inEnd);
    const leftSize: number = inRoot - inStart;

    root.left = build(preStart + 1, preStart + leftSize, inStart, inRoot - 1);
    root.right = build(preStart + leftSize + 1, preEnd, inRoot + 1, inEnd);

    return root;
  }

  return build(0, preorder.length - 1, 0, inorder.length - 1);
}

// 辅助函数：前序遍历
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function traverse(node: TreeNode | null): void {
    if (node === null) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

// 辅助函数：中序遍历
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

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 从前序与中序遍历序列构造二叉树 =====");
const tree1: TreeNode | null = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
console.log(preorderTraversal(tree1)); // 期望结果: [3, 9, 20, 15, 7]
console.log(inorderTraversal(tree1)); // 期望结果: [9, 3, 15, 20, 7]

const tree2: TreeNode | null = buildTree([-1], [-1]);
console.log(preorderTraversal(tree2)); // 期望结果: [-1]

console.log("--- 方法2测试 ---");
const tree3: TreeNode | null = buildTreeLinear([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
console.log(preorderTraversal(tree3)); // 期望结果: [3, 9, 20, 15, 7]
console.log(inorderTraversal(tree3)); // 期望结果: [9, 3, 15, 20, 7]

export {};
