// ============================================================
// 005. 从中序与后序遍历序列构造二叉树
// ============================================================
// LeetCode 106. Construct Binary Tree from Inorder and Postorder Traversal
// 给定两个整数数组 inorder 和 postorder，其中 inorder 是二叉树的中序遍历，
// postorder 是同一棵树的后序遍历，请你构造并返回这棵二叉树。
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
// 后序遍历最后一个元素为根，用哈希表在中序中定位根，分治构建左右子树
// 时间复杂度 O(n)，空间复杂度 O(n)
function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  // 中序值 -> 索引 的映射
  const indexMap: Map<number, number> = new Map<number, number>();
  for (let i: number = 0; i < inorder.length; i++) {
    indexMap.set(inorder[i], i);
  }

  // 分治：构建 postorder[postStart..postEnd] 对应的子树
  // inStart 为该子树在中序数组中的起始位置
  function build(
    postStart: number,
    postEnd: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null {
    if (postStart > postEnd) return null;

    // 后序最后一个为根节点
    const rootVal: number = postorder[postEnd];
    const root: TreeNode = new TreeNode(rootVal);

    // 在中序中定位根的位置
    const inRoot: number = indexMap.get(rootVal)!;
    const leftSize: number = inRoot - inStart;

    // 递归构建左子树
    root.left = build(postStart, postStart + leftSize - 1, inStart, inRoot - 1);
    // 递归构建右子树
    root.right = build(postStart + leftSize, postEnd - 1, inRoot + 1, inEnd);

    return root;
  }

  return build(0, postorder.length - 1, 0, inorder.length - 1);
}

// 方法2：递归分治（无哈希表，线性查找）
// 每次在中序数组中线性查找根节点位置
// 时间复杂度 O(n^2)，空间复杂度 O(n)
function buildTreeLinear(inorder: number[], postorder: number[]): TreeNode | null {
  // 在 inorder[inStart..inEnd] 中查找 target 的索引
  function findIndex(arr: number[], target: number, start: number, end: number): number {
    for (let i: number = start; i <= end; i++) {
      if (arr[i] === target) return i;
    }
    return -1;
  }

  function build(
    postStart: number,
    postEnd: number,
    inStart: number,
    inEnd: number,
  ): TreeNode | null {
    if (postStart > postEnd) return null;

    const rootVal: number = postorder[postEnd];
    const root: TreeNode = new TreeNode(rootVal);

    const inRoot: number = findIndex(inorder, rootVal, inStart, inEnd);
    const leftSize: number = inRoot - inStart;

    root.left = build(postStart, postStart + leftSize - 1, inStart, inRoot - 1);
    root.right = build(postStart + leftSize, postEnd - 1, inRoot + 1, inEnd);

    return root;
  }

  return build(0, postorder.length - 1, 0, inorder.length - 1);
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

// 辅助函数：后序遍历
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function traverse(node: TreeNode | null): void {
    if (node === null) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }
  traverse(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 从中序与后序遍历序列构造二叉树 =====");
const tree1: TreeNode | null = buildTree([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
console.log(inorderTraversal(tree1)); // 期望结果: [9, 3, 15, 20, 7]
console.log(postorderTraversal(tree1)); // 期望结果: [9, 15, 7, 20, 3]

const tree2: TreeNode | null = buildTree([-1], [-1]);
console.log(inorderTraversal(tree2)); // 期望结果: [-1]

console.log("--- 方法2测试 ---");
const tree3: TreeNode | null = buildTreeLinear([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
console.log(inorderTraversal(tree3)); // 期望结果: [9, 3, 15, 20, 7]
console.log(postorderTraversal(tree3)); // 期望结果: [9, 15, 7, 20, 3]

export {};
