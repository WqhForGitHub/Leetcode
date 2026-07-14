// ============================================================
// 033. 二叉搜索树的最近公共祖先
// ============================================================
// LeetCode 235. Lowest Common Ancestor of a Binary Search Tree
// 给定一个二叉搜索树，找到该树中两个指定节点的最近公共祖先。
// 时间复杂度：O(H)，空间复杂度：O(1) 迭代 / O(H) 递归

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

// 方法1：递归利用 BST 性质（推荐）
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null) return null;
  // 若 p、q 都在左子树
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }
  // 若 p、q 都在右子树
  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }
  // 一左一右（或其中一个等于 root），当前节点即为 LCA
  return root;
}

// 方法2：迭代
function lowestCommonAncestorIterative(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode,
): TreeNode | null {
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left;
    } else if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right;
    } else {
      return curr;
    }
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 033. 二叉搜索树的最近公共祖先 =====");
// 构造 BST: [6,2,8,0,4,7,9,null,null,3,5]
const tree33 = new TreeNode(
  6,
  new TreeNode(2, new TreeNode(0), new TreeNode(4, new TreeNode(3), new TreeNode(5))),
  new TreeNode(8, new TreeNode(7), new TreeNode(9)),
);
const p33 = tree33.left!; // 2
const q33 = tree33.right!; // 8
console.log("递归 LCA(2,8):", lowestCommonAncestor(tree33, p33, q33)?.val); // 期望 6
console.log("迭代 LCA(2,8):", lowestCommonAncestorIterative(tree33, p33, q33)?.val); // 期望 6

const p33b = tree33.left!; // 2
const q33b = tree33.left!.right!; // 4
console.log("递归 LCA(2,4):", lowestCommonAncestor(tree33, p33b, q33b)?.val); // 期望 2
console.log("迭代 LCA(2,4):", lowestCommonAncestorIterative(tree33, p33b, q33b)?.val); // 期望 2

export {};
