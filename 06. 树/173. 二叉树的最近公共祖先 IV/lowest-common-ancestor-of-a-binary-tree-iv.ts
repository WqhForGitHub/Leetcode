// ============================================================
// 173. 二叉树的最近公共祖先 IV
// ============================================================
// LeetCode 1676. Lowest Common Ancestor of a Binary Tree IV
// 给定一棵二叉树和一组节点 nodes，找到这些节点的最近公共祖先。
// 时间复杂度：O(n)，空间复杂度：O(h + m)

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

// 方法1：DFS递归+集合（推荐）
// 将 nodes 放入集合，后序遍历找最近公共祖先
// 返回找到的节点，当左右子树都找到时当前节点为 LCA
function lowestCommonAncestor(
  root: TreeNode | null,
  nodes: TreeNode[]
): TreeNode | null {
  const nodeSet = new Set<TreeNode>(nodes);

  function dfs(node: TreeNode | null): TreeNode | null {
    if (node === null) return null;
    // 当前节点在目标集合中，直接返回（它是自身的祖先）
    if (nodeSet.has(node)) return node;

    const left = dfs(node.left);
    const right = dfs(node.right);

    // 左右都找到，当前节点是 LCA
    if (left !== null && right !== null) return node;
    // 否则返回非空的一侧
    return left !== null ? left : right;
  }

  return dfs(root);
}

// 方法2：迭代后序遍历
function lowestCommonAncestorIterative(
  root: TreeNode | null,
  nodes: TreeNode[]
): TreeNode | null {
  if (root === null) return null;
  const nodeSet = new Set<TreeNode>(nodes);
  const stack: TreeNode[] = [];
  let cur: TreeNode | null = root;
  let prev: TreeNode | null = null;
  const parent = new Map<TreeNode, TreeNode | null>();
  let foundCount = 0;

  while (stack.length > 0 || cur !== null) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    const node = stack[stack.length - 1];
    if (node.right !== null && node.right !== prev) {
      cur = node.right;
    } else {
      stack.pop();
      // 处理 node
      let leftChild: TreeNode | null = null;
      let rightChild: TreeNode | null = null;
      if (node.left !== null) leftChild = parent.get(node.left) ?? null;
      if (node.right !== null) rightChild = parent.get(node.right) ?? null;

      if (nodeSet.has(node)) {
        parent.set(node, node);
        foundCount++;
      } else if (leftChild !== null && rightChild !== null) {
        parent.set(node, node);
      } else if (leftChild !== null) {
        parent.set(node, leftChild);
      } else if (rightChild !== null) {
        parent.set(node, rightChild);
      } else {
        parent.set(node, null);
      }
      prev = node;
    }
  }
  return parent.get(root) ?? null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 173. 二叉树的最近公共祖先 IV =====");

// 构建测试树:
//        3
//       / \
//      5   1
//     / \ / \
//    6  2 0  8
//      / \
//     7   4
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

// 测试1: nodes = [4, 7] -> LCA = 2
console.log("测试1 DFS法:", lowestCommonAncestor(n3, [n4, n7])?.val); // 2

// 测试2: nodes = [4, 6, 7] -> LCA = 5
console.log("测试2 DFS法:", lowestCommonAncestor(n3, [n4, n6, n7])?.val); // 5

// 测试3: nodes = [4, 6, 0, 8] -> LCA = 3
console.log("测试3 DFS法:", lowestCommonAncestor(n3, [n4, n6, n0, n8])?.val); // 3

// 测试4: nodes = [1, 0, 8] -> LCA = 1
console.log("测试4 DFS法:", lowestCommonAncestor(n3, [n1, n0, n8])?.val); // 1

// 测试5: 单节点 nodes = [4] -> LCA = 4
console.log("测试5 单节点:", lowestCommonAncestor(n3, [n4])?.val); // 4

export {};
