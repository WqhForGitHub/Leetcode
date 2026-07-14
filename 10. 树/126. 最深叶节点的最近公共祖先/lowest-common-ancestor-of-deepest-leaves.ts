// ============================================================
// 126. 最深叶节点的最近公共祖先
// ============================================================
// LeetCode 1123. Lowest Common Ancestor of Deepest Leaves
// 给定一个二叉树，返回它的最深叶节点的最近公共祖先。
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

// 方法1：DFS返回深度和节点（推荐）
// 后序遍历，对每个节点返回 [该子树最深叶节点的深度, 该子树中最深叶节点的LCA]
// 如果左子树深度 > 右子树深度：返回左子树结果，深度+1
// 如果右子树深度 > 左子树深度：返回右子树结果，深度+1
// 如果两边深度相等：当前节点就是 LCA，深度+1
function lcaDeepestLeaves(root: TreeNode | null): TreeNode | null {
  return dfs(root)[1];
}

// 返回 [深度, LCA节点]
function dfs(node: TreeNode | null): [number, TreeNode | null] {
  if (node === null) return [0, null];
  const [leftDepth, leftLca] = dfs(node.left);
  const [rightDepth, rightLca] = dfs(node.right);

  if (leftDepth > rightDepth) {
    return [leftDepth + 1, leftLca];
  } else if (rightDepth > leftDepth) {
    return [rightDepth + 1, rightLca];
  } else {
    // 两边深度相等，当前节点是这一层最深叶节点的 LCA
    return [leftDepth + 1, node];
  }
}

// 方法2：BFS找最深节点后 LCA
// 先用 BFS 找到最深层所有叶子节点，再求这些节点的 LCA
function lcaDeepestLeavesBFS(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  if (root.left === null && root.right === null) return root;

  // BFS 找最深层
  let deepestNodes: TreeNode[] = [root];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    const level: TreeNode[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    deepestNodes = level;
  }

  // 求所有最深叶节点的 LCA
  let lca: TreeNode | null = deepestNodes[0];
  for (let i = 1; i < deepestNodes.length; i++) {
    lca = findLCA(root, deepestNodes[i], lca);
  }
  return lca;
}

function findLCA(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (root === null || root === p || root === q) return root;
  const left = findLCA(root.left, p, q);
  const right = findLCA(root.right, p, q);
  if (left !== null && right !== null) return root;
  return left !== null ? left : right;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 126. 最深叶节点的最近公共祖先 =====");

// 辅助函数：数组构建树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const leftVal = arr[i++];
        node.left = leftVal !== null ? new TreeNode(leftVal) : null;
        queue.push(node.left);
      }
      if (i < arr.length) {
        const rightVal = arr[i++];
        node.right = rightVal !== null ? new TreeNode(rightVal) : null;
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 测试1: root = [3,5,1,6,2,0,8,null,null,7,4]
// 最深叶节点为 7 和 4，它们的 LCA 是 2
console.log(
  "测试1 DFS:",
  lcaDeepestLeaves(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]))?.val,
); // 期望 2

// 测试2: root = [1]
// 只有一个节点，返回自身
console.log("测试2 DFS:", lcaDeepestLeaves(buildTree([1]))?.val); // 期望 1

// 测试3: root = [0,1,3,null,2]
// 最深叶节点为 2，返回 2 本身
console.log("测试3 DFS:", lcaDeepestLeaves(buildTree([0, 1, 3, null, 2]))?.val); // 期望 2

console.log("测试3 BFS:", lcaDeepestLeavesBFS(buildTree([0, 1, 3, null, 2]))?.val); // 期望 2

export {};
