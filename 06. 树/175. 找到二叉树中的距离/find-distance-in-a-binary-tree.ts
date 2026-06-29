// ============================================================
// 175. 找到二叉树中的距离
// ============================================================
// LeetCode 1740. Find Distance in a Binary Tree
// 给定一棵二叉树的根节点 root 和两个节点 p、q，返回 p 和 q 之间的距离（路径上的边数）。
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

// 方法1：LCA + DFS求深度（推荐）
// 先找到 p 和 q 的最近公共祖先 lca
// 距离 = depth(p, lca) + depth(q, lca)
function findDistance(
  root: TreeNode | null,
  p: number,
  q: number
): number {
  if (p === q) return 0;

  // 找 LCA
  const lca = findLCA(root, p, q);
  // 求从 lca 到 p 和 q 的距离
  const distP = getDepth(lca, p);
  const distQ = getDepth(lca, q);
  return distP + distQ;

  function findLCA(
    node: TreeNode | null,
    p: number,
    q: number
  ): TreeNode | null {
    if (node === null) return null;
    if (node.val === p || node.val === q) return node;
    const left = findLCA(node.left, p, q);
    const right = findLCA(node.right, p, q);
    if (left !== null && right !== null) return node;
    return left !== null ? left : right;
  }

  function getDepth(node: TreeNode | null, target: number): number {
    if (node === null) return -1;
    if (node.val === target) return 0;
    const left = getDepth(node.left, target);
    if (left !== -1) return left + 1;
    const right = getDepth(node.right, target);
    if (right !== -1) return right + 1;
    return -1;
  }
}

// 方法2：一次DFS同时找LCA和深度
// DFS 返回 [找到的目标数量, 距离]
function findDistanceDFS(
  root: TreeNode | null,
  p: number,
  q: number
): number {
  let result = 0;
  dfs(root, p, q);
  return result;

  function dfs(
    node: TreeNode | null,
    p: number,
    q: number
  ): number {
    if (node === null) return 0;
    // 返回值表示当前子树中找到的目标节点数
    let found = 0;
    if (node.val === p || node.val === q) found = 1;

    const leftFound = dfs(node.left, p, q);
    const rightFound = dfs(node.right, p, q);

    // 如果当前节点本身找到一个，子树找到另一个
    if (found === 1) {
      if (leftFound > 0) {
        result = getDistToChild(node.left, node.val === p ? q : p);
      } else if (rightFound > 0) {
        result = getDistToChild(node.right, node.val === p ? q : p);
      }
    }
    // 左右子树各找到一个，当前是 LCA
    if (leftFound === 1 && rightFound === 1) {
      result = getDistToChild(node.left, p) + getDistToChild(node.right, q);
      if (result < 0) {
        result = getDistToChild(node.left, q) + getDistToChild(node.right, p);
      }
    }
    return found + leftFound + rightFound;
  }

  function getDistToChild(node: TreeNode | null, target: number): number {
    if (node === null) return -1;
    if (node.val === target) return 1;
    const left = getDistToChild(node.left, target);
    if (left !== -1) return left + 1;
    const right = getDistToChild(node.right, target);
    return right !== -1 ? right + 1 : -1;
  }
}

// 方法3：建图后BFS
function findDistanceBFS(
  root: TreeNode | null,
  p: number,
  q: number
): number {
  if (p === q) return 0;
  // 建无向图
  const graph = new Map<number, number[]>();
  function build(node: TreeNode | null): void {
    if (node === null) return;
    if (!graph.has(node.val)) graph.set(node.val, []);
    if (node.left !== null) {
      if (!graph.has(node.left.val)) graph.set(node.left.val, []);
      graph.get(node.val)!.push(node.left.val);
      graph.get(node.left.val)!.push(node.val);
      build(node.left);
    }
    if (node.right !== null) {
      if (!graph.has(node.right.val)) graph.set(node.right.val, []);
      graph.get(node.val)!.push(node.right.val);
      graph.get(node.right.val)!.push(node.val);
      build(node.right);
    }
  }
  build(root);

  // BFS 从 p 找 q
  const visited = new Set<number>([p]);
  const queue: number[] = [p];
  let dist = 0;
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node === q) return dist;
      for (const next of graph.get(node) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    dist++;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 175. 找到二叉树中的距离 =====");

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

// 测试1: p=5, q=0 -> LCA=3, dist=2 (5->3->0)
console.log("测试1 LCA法:", findDistance(n3, 5, 0)); // 2
console.log("测试1 BFS法:", findDistanceBFS(n3, 5, 0)); // 2

// 测试2: p=8, q=7 -> LCA=3, dist=4 (8->1->3->5->2->7 = 4 边)
// 8 -> 1 -> 3 -> 5 -> 2 -> 7 共 5 条边? 重新计算
// 8 到 1: 1, 1 到 3: 1, 3 到 5: 1, 5 到 2: 1, 2 到 7: 1 = 5? 不对
// 8->1 (1), 1->3 (2), 3->5 (3), 5->2 (4), 2->7 (5) = 5 边
// 但实际 8 和 7 的 LCA 是 3: 8->1->3 = 2, 7->2->5->3 = 3, 总 5
console.log("测试2 LCA法:", findDistance(n3, 8, 7)); // 5
console.log("测试2 BFS法:", findDistanceBFS(n3, 8, 7)); // 5

// 测试3: p=6, q=4 -> LCA=5, 6->5=1, 4->2->5=2, 总 3
console.log("测试3 LCA法:", findDistance(n3, 6, 4)); // 3
console.log("测试3 BFS法:", findDistanceBFS(n3, 6, 4)); // 3

// 测试4: p=q=3 -> 0
console.log("测试4 相同节点:", findDistance(n3, 3, 3)); // 0

export {};
