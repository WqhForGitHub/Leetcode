// ============================================================
// 100. 具有所有最深节点的最小子树
// ============================================================
// LeetCode 865. Smallest Subtree with all the Deepest Nodes
// 给定一个根节点为 root 的二叉树，返回其最深的叶子节点所在的子树
// （具有所有最深节点的最小子树）。
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

// 方法1：DFS 返回深度和节点（推荐）
// 后序遍历，每个节点返回 [该子树最深深度, 对应的子树节点]
// - 若左右子树深度相同：当前节点是最深节点的 LCA，返回当前节点
// - 若左子树更深：返回左子树的结果（深度+1）
// - 若右子树更深：返回右子树的结果（深度+1）

interface DepthNode {
  depth: number;
  node: TreeNode | null;
}

function subtreeWithAllDeepest(root: TreeNode | null): TreeNode | null {
  function dfs(node: TreeNode | null): DepthNode {
    if (node === null) return { depth: 0, node: null };

    const left = dfs(node.left);
    const right = dfs(node.right);

    if (left.depth === right.depth) {
      // 左右深度相同，当前节点是这些最深节点的 LCA
      return { depth: left.depth + 1, node: node };
    } else if (left.depth > right.depth) {
      // 左更深，最深节点都在左子树
      return { depth: left.depth + 1, node: left.node };
    } else {
      // 右更深，最深节点都在右子树
      return { depth: right.depth + 1, node: right.node };
    }
  }

  return dfs(root).node;
}

// 方法2：BFS 找最深节点 + LCA
// 思路：先 BFS 找到所有最深叶子节点，然后求这些节点的最近公共祖先 LCA。
function subtreeWithAllDeepestBFS(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  // BFS 找所有最深叶子节点
  let level: TreeNode[] = [root];
  while (true) {
    const next: TreeNode[] = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    if (next.length === 0) break; // 当前 level 已是最深
    level = next;
  }

  // 求多个节点的 LCA：依次两两求 LCA
  function lca(u: TreeNode | null, v: TreeNode | null): TreeNode | null {
    if (u === null || v === null) return u ?? v;
    const pathU = getPath(root, u);
    const pathV = getPath(root, v);
    let result: TreeNode | null = null;
    for (let i = 0; i < Math.min(pathU.length, pathV.length); i++) {
      if (pathU[i] === pathV[i]) result = pathU[i];
      else break;
    }
    return result;
  }
  function getPath(root: TreeNode | null, target: TreeNode): TreeNode[] {
    const path: TreeNode[] = [];
    function dfs(node: TreeNode | null): boolean {
      if (node === null) return false;
      path.push(node);
      if (node === target) return true;
      if (dfs(node.left) || dfs(node.right)) return true;
      path.pop();
      return false;
    }
    dfs(root);
    return path;
  }

  let result: TreeNode | null = level[0];
  for (let i = 1; i < level.length; i++) {
    result = lca(result, level[i]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 具有所有最深节点的最小子树 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForDeepest(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 测试1: root = [3,5,1,6,2,0,8,null,null,7,4]
//         3
//        / \
//       5   1
//      / \ / \
//     6  2 0  8
//       / \
//      7   4
// 最深节点为 7 和 4，深度 3。它们的 LCA 是 2。
const tree1 = buildTreeForDeepest([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const res1 = subtreeWithAllDeepest(tree1);
console.log("方法1 - 最小子树根:", res1?.val); // 期望 2
const res1BFS = subtreeWithAllDeepestBFS(tree1);
console.log("方法2 - 最小子树根:", res1BFS?.val); // 期望 2

// 测试2: root = [1]
const tree2 = buildTreeForDeepest([1]);
console.log("单节点:", subtreeWithAllDeepest(tree2)?.val); // 期望 1

// 测试3: root = [0,1,3,null,2]
//      0
//     / \
//    1   3
//     \
//      2
// 最深节点是 2（深度 2），其本身即为答案
const tree3 = buildTreeForDeepest([0, 1, 3, null, 2]);
console.log("测试3 - 最小子树根:", subtreeWithAllDeepest(tree3)?.val); // 期望 2

// 测试4: root = [0,3,1,null,2,null,null,4]
// 最深节点 4
const tree4 = buildTreeForDeepest([0, 3, 1, null, 2, null, null, 4]);
console.log("测试4 - 最小子树根:", subtreeWithAllDeepest(tree4)?.val); // 期望 4

export {};
