// ============================================================
// 169. 二叉树的最近公共祖先 II
// ============================================================
// LeetCode 1644. Lowest Common Ancestor of a Binary Tree II
// 给定一棵二叉树和两个节点 p 和 q，找到它们的最近公共祖先。
// 节点可能不存在于树中。
// 时间复杂度：O(n)，空间复杂度：O(h)

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

// 方法1：DFS递归+计数（推荐）
// 后序遍历，返回找到的 LCA（如果两节点都找到）
// 用一个全局计数器统计找到的 p 和 q 数量
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null,
): TreeNode | null {
  let count = 0;
  const lca = dfs(root, p!, q!);
  return count === 2 ? lca : null;

  function dfs(node: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    if (node === null) return null;
    // 先递归左右子树（不能提前返回，否则可能漏掉另一个节点）
    const left = dfs(node.left, p, q);
    const right = dfs(node.right, p, q);
    // 当前节点是 p 或 q
    if (node === p || node === q) {
      count++;
      // 若当前节点是 p 或 q，且子树中已找到另一个，则当前节点是 LCA
      return node;
    }
    // 左右子树都找到，当前节点是 LCA
    if (left !== null && right !== null) return node;
    // 否则返回非空的那一个
    return left !== null ? left : right;
  }
}

// 方法2：分别查找路径
// 分别找到从根到 p、q 的路径，然后比较路径找最后一个公共节点
function lowestCommonAncestorPath(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null,
): TreeNode | null {
  const pathP: TreeNode[] = [];
  const pathQ: TreeNode[] = [];
  const foundP = findPath(root, p!, pathP);
  const foundQ = findPath(root, q!, pathQ);
  if (!foundP || !foundQ) return null;

  let lca: TreeNode | null = null;
  const len = Math.min(pathP.length, pathQ.length);
  for (let i = 0; i < len; i++) {
    if (pathP[i] === pathQ[i]) {
      lca = pathP[i];
    } else {
      break;
    }
  }
  return lca;

  function findPath(node: TreeNode | null, target: TreeNode, path: TreeNode[]): boolean {
    if (node === null) return false;
    path.push(node);
    if (node === target) return true;
    if (findPath(node.left, target, path) || findPath(node.right, target, path)) {
      return true;
    }
    path.pop();
    return false;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 169. 二叉树的最近公共祖先 II =====");

// 构建测试树:
//       3
//      / \
//     5   1
//    / \ / \
//   6  2 0  8
//     / \
//    7   4
const n3 = new TreeNode(3);
const n5 = new TreeNode(5);
const n1 = new TreeNode(1);
const n6 = new TreeNode(6);
const n2 = new TreeNode(2);
const n0 = new TreeNode(0);
const n8 = new TreeNode(8);
const n7 = new TreeNode(7);
const n4 = new TreeNode(4);
n3.left = n5;
n3.right = n1;
n5.left = n6;
n5.right = n2;
n1.left = n0;
n1.right = n8;
n2.left = n7;
n2.right = n4;

// 测试1: p=5, q=1 -> LCA=3
console.log("测试1 DFS计数法:", lowestCommonAncestor(n3, n5, n1)?.val); // 3
console.log("测试1 路径法:", lowestCommonAncestorPath(n3, n5, n1)?.val); // 3

// 测试2: p=5, q=4 -> LCA=5
console.log("测试2 DFS计数法:", lowestCommonAncestor(n3, n5, n4)?.val); // 5
console.log("测试2 路径法:", lowestCommonAncestorPath(n3, n5, n4)?.val); // 5

// 测试3: p=6, q=4 -> LCA=5
console.log("测试3 DFS计数法:", lowestCommonAncestor(n3, n6, n4)?.val); // 5
console.log("测试3 路径法:", lowestCommonAncestorPath(n3, n6, n4)?.val); // 5

// 测试4: p 不在树中
const notInTree = new TreeNode(100);
console.log("测试4 节点不存在 DFS计数法:", lowestCommonAncestor(n3, n5, notInTree)); // null
console.log("测试4 节点不存在 路径法:", lowestCommonAncestorPath(n3, n5, notInTree)); // null

export {};
