// ============================================================
// 164. 找到二叉树中最近的右侧节点
// ============================================================
// LeetCode 1602. Find Nearest Right Node in Binary Tree
// 给定一棵二叉树和节点 u，找到与 u 在同一层且在其右侧最近的节点。
// 时间复杂度：O(n)，空间复杂度：O(w)

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

// 方法1：BFS层序（推荐）
// 层序遍历，遇到 u 后返回队列中下一个节点（同一层右侧最近节点）
function findNearestRightNode(root: TreeNode | null, u: TreeNode | null): TreeNode | null {
  if (root === null || u === null) return null;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node === u) {
        // 如果不是本层最后一个节点，则返回下一个；否则返回 null
        return i < size - 1 ? queue[0] : null;
      }
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }
  return null;
}

// 方法2：DFS递归
// 记录目标节点的深度，遍历时找到深度相同且在 u 之后访问的第一个节点
let targetDepth: number;
let found: boolean;
let answer: TreeNode | null;

function findNearestRightNodeDFS(root: TreeNode | null, u: TreeNode | null): TreeNode | null {
  if (root === null || u === null) return null;
  targetDepth = -1;
  found = false;
  answer = null;

  function dfs(node: TreeNode | null, depth: number): void {
    if (node === null || answer !== null) return;
    if (found && depth === targetDepth) {
      answer = node;
      return;
    }
    if (node === u) {
      found = true;
      targetDepth = depth;
      return;
    }
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }

  dfs(root, 0);
  return answer;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 164. 找到二叉树中最近的右侧节点 =====");

// 辅助：从数组构建二叉树
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.left = new TreeNode(v);
          queue.push(node.left);
        } else queue.push(null);
      }
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.right = new TreeNode(v);
          queue.push(node.right);
        } else queue.push(null);
      }
    }
  }
  return root;
}

// 辅助：按值找到节点
function findNode(root: TreeNode | null, val: number): TreeNode | null {
  if (root === null) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
}

// 测试1:
//        1
//       / \
//      2   3
//     /   / \
//    4   5   6
// 找节点 4 的右侧最近节点 -> 5
const t1 = buildTree([1, 2, 3, 4, null, 5, 6]);
console.log("测试1 BFS:", findNearestRightNode(t1, findNode(t1, 4))?.val); // 期望 5
console.log("测试1 DFS:", findNearestRightNodeDFS(t1, findNode(t1, 4))?.val); // 期望 5

// 测试2:
//      1
//     /
//    2
// 找节点 2 的右侧最近节点 -> null（同层无其他节点）
const t2 = buildTree([1, 2]);
console.log("测试2 BFS:", findNearestRightNode(t2, findNode(t2, 2))); // 期望 null
console.log("测试2 DFS:", findNearestRightNodeDFS(t2, findNode(t2, 2))); // 期望 null

// 测试3: 节点本身在最右
const t3 = buildTree([1, 2, 3, null, null, null, 4]);
console.log("测试3 BFS:", findNearestRightNode(t3, findNode(t3, 4))); // 期望 null

export {};
