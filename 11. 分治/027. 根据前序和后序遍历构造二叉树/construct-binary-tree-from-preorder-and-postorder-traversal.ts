// ============================================================
// 027. 根据前序和后序遍历构造二叉树
// ============================================================
// LeetCode 889. Construct Binary Tree from Preorder and Postorder Traversal
// 给定前序遍历与后序遍历，构造任意一棵满足条件的二叉树（答案不唯一）。
// 时间复杂度：O(n^2) 最坏，空间复杂度：O(n)

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

// 方法1：分治递归 + 线性查找（推荐）
// 思路：前序首元素是根。若仅一个元素，即为叶子节点。
//       前序第二个元素是左子树根，在后序中找到它的位置 idx，
//       则后序 [postStart..idx] 是左子树，[idx+1..postEnd-1] 是右子树。
//       据此划分前序区间并递归构造。
function constructFromPrePost(preorder: number[], postorder: number[]): TreeNode | null {
  return build(preorder, 0, preorder.length - 1, postorder, 0, postorder.length - 1);
}

function build(
  pre: number[],
  preStart: number,
  preEnd: number,
  post: number[],
  postStart: number,
  postEnd: number,
): TreeNode | null {
  if (preStart > preEnd) return null;

  const root = new TreeNode(pre[preStart]);
  if (preStart === preEnd) return root; // 单节点为叶子

  // 前序第二个元素是左子树根
  const leftRootVal = pre[preStart + 1];
  // 在后序 [postStart..postEnd-1] 中找 leftRootVal 的下标
  let idx = postStart;
  while (post[idx] !== leftRootVal) idx++;

  // 左子树大小
  const leftSize = idx - postStart + 1;

  root.left = build(pre, preStart + 1, preStart + leftSize, post, postStart, idx);
  root.right = build(pre, preStart + leftSize + 1, preEnd, post, idx + 1, postEnd - 1);
  return root;
}

// 方法2：分治递归 + 哈希表加速查找（O(n)）
// 思路：与方法1相同，但用哈希表预存后序值到下标的映射，省去线性查找。
function constructFromPrePostHash(preorder: number[], postorder: number[]): TreeNode | null {
  const postIndex = new Map<number, number>();
  postorder.forEach((v, i) => postIndex.set(v, i));
  return buildHash(preorder, 0, preorder.length - 1, postorder, 0, postorder.length - 1, postIndex);
}

function buildHash(
  pre: number[],
  preStart: number,
  preEnd: number,
  post: number[],
  postStart: number,
  postEnd: number,
  postIndex: Map<number, number>,
): TreeNode | null {
  if (preStart > preEnd) return null;

  const root = new TreeNode(pre[preStart]);
  if (preStart === preEnd) return root;

  const leftRootVal = pre[preStart + 1];
  const idx = postIndex.get(leftRootVal)!;
  const leftSize = idx - postStart + 1;

  root.left = buildHash(pre, preStart + 1, preStart + leftSize, post, postStart, idx, postIndex);
  root.right = buildHash(
    pre,
    preStart + leftSize + 1,
    preEnd,
    post,
    idx + 1,
    postEnd - 1,
    postIndex,
  );
  return root;
}

// ============================================================
// 测试
// ============================================================
// 辅助：前序遍历
function preorderTraversal(root: TreeNode | null): number[] {
  const res: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    res.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return res;
}

// 辅助：后序遍历
function postorderTraversal(root: TreeNode | null): number[] {
  const res: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    dfs(node.right);
    res.push(node.val);
  }
  dfs(root);
  return res;
}

console.log("===== 027. 根据前序和后序遍历构造二叉树 =====");
const pre1 = [1, 2, 4, 5, 3, 6, 7];
const post1 = [4, 5, 2, 6, 7, 3, 1];
const tree1 = constructFromPrePost(pre1, post1);
console.log("分治 前序:", JSON.stringify(preorderTraversal(tree1))); // 期望: [1,2,4,5,3,6,7]
console.log("分治 后序:", JSON.stringify(postorderTraversal(tree1))); // 期望: [4,5,2,6,7,3,1]

const pre2 = [1, 2, 3];
const post2 = [2, 3, 1];
const tree2 = constructFromPrePost(pre2, post2);
console.log("分治 前序:", JSON.stringify(preorderTraversal(tree2))); // 期望: [1,2,3] 或 [1,2,3]（左偏或右偏均可）
console.log("分治 后序:", JSON.stringify(postorderTraversal(tree2))); // 期望: [2,3,1]

const tree3 = constructFromPrePostHash(pre1, post1);
console.log("哈希 前序:", JSON.stringify(preorderTraversal(tree3))); // 期望: [1,2,4,5,3,6,7]
console.log("哈希 后序:", JSON.stringify(postorderTraversal(tree3))); // 期望: [4,5,2,6,7,3,1]

export {};
