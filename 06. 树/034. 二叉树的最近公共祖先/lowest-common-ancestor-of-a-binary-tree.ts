// ============================================================
// 034. 二叉树的最近公共祖先
// ============================================================
// LeetCode 236. Lowest Common Ancestor of a Binary Tree
// 给定一个二叉树，找到该树中两个指定节点的最近公共祖先。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：递归后序遍历（推荐）
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (root === null || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left !== null && right !== null) return root;
  return left !== null ? left : right;
}

// 方法2：存储父节点
function lowestCommonAncestorHash(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (root === null) return null;
  const parent = new Map<TreeNode, TreeNode>();
  const visited = new Set<TreeNode>();
  // 用栈进行 DFS，建立父节点映射
  const stack: TreeNode[] = [root];
  parent.set(root, null as any);
  while (
    stack.length > 0 &&
    !parent.has(p) &&
    !parent.has(q)
  ) {
    const node = stack.pop()!;
    if (node.left !== null) {
      parent.set(node.left, node);
      stack.push(node.left);
    }
    if (node.right !== null) {
      parent.set(node.right, node);
      stack.push(node.right);
    }
  }
  // 从 p 向上遍历并标记
  let curr: TreeNode | null = p;
  while (curr !== null) {
    visited.add(curr);
    curr = parent.get(curr) ?? null;
  }
  // 从 q 向上遍历，第一个访问过的节点即为 LCA
  curr = q;
  while (curr !== null) {
    if (visited.has(curr)) return curr;
    curr = parent.get(curr) ?? null;
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 二叉树的最近公共祖先 =====");
// 构造树: [3,5,1,6,2,0,8,null,null,7,4]
const tree34 = new TreeNode(
  3,
  new TreeNode(
    5,
    new TreeNode(6),
    new TreeNode(2, new TreeNode(7), new TreeNode(4))
  ),
  new TreeNode(1, new TreeNode(0), new TreeNode(8))
);
const p34 = tree34.left!; // 5
const q34 = tree34.right!; // 1
console.log("递归 LCA(5,1):", lowestCommonAncestor(tree34, p34, q34)?.val); // 期望 3
console.log("哈希 LCA(5,1):", lowestCommonAncestorHash(tree34, p34, q34)?.val); // 期望 3

const p34b = tree34.left!; // 5
const q34b = tree34.left!.right!.right!; // 4
console.log("递归 LCA(5,4):", lowestCommonAncestor(tree34, p34b, q34b)?.val); // 期望 5
console.log("哈希 LCA(5,4):", lowestCommonAncestorHash(tree34, p34b, q34b)?.val); // 期望 5

export {};
