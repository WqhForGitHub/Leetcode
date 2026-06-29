// ============================================================
// 115. 二叉树的堂兄弟节点
// ============================================================
// LeetCode 993. Cousins in Binary Tree
// 在二叉树中，根节点位于深度 0 处，每个深度为 k 的节点的子节点位于深度 k+1 处。
// 如果深度相同的两个节点有相同的父节点，则它们是兄弟节点；否则是堂兄弟节点。
// 给定两个节点值 x 和 y，判断它们是否是堂兄弟节点。
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

// 方法1：DFS递归（推荐）
// 分别找到 x 和 y 的深度和父节点，比较
let depthX: number;
let depthY: number;
let parentX: TreeNode | null;
let parentY: TreeNode | null;
let targetX: number;
let targetY: number;

function isCousins(root: TreeNode | null, x: number, y: number): boolean {
  targetX = x;
  targetY = y;
  depthX = -1;
  depthY = -1;
  parentX = null;
  parentY = null;
  dfs(root, null, 0);

  // 深度相同且父节点不同 -> 堂兄弟
  return depthX === depthY && parentX !== parentY;
}

function dfs(node: TreeNode | null, parent: TreeNode | null, depth: number): void {
  if (node === null) return;
  if (node.val === targetX) {
    depthX = depth;
    parentX = parent;
  }
  if (node.val === targetY) {
    depthY = depth;
    parentY = parent;
  }
  // 找到两个就可以提前结束
  if (depthX !== -1 && depthY !== -1) return;
  dfs(node.left, node, depth + 1);
  dfs(node.right, node, depth + 1);
}

// 方法2：BFS迭代
// 层序遍历，同一层中检查 x 和 y 是否有相同父节点
function isCousinsBFS(root: TreeNode | null, x: number, y: number): boolean {
  if (root === null) return false;
  const queue: { node: TreeNode; parent: TreeNode | null }[] = [
    { node: root, parent: null },
  ];

  while (queue.length > 0) {
    const size = queue.length;
    let foundX = false;
    let foundY = false;
    let parentX: TreeNode | null = null;
    let parentY: TreeNode | null = null;

    for (let i = 0; i < size; i++) {
      const { node, parent } = queue.shift()!;
      if (node.val === x) {
        foundX = true;
        parentX = parent;
      }
      if (node.val === y) {
        foundY = true;
        parentY = parent;
      }
      if (node.left !== null) queue.push({ node: node.left, parent: node });
      if (node.right !== null) queue.push({ node: node.right, parent: node });
    }

    // 同层找到了两个
    if (foundX && foundY) {
      return parentX !== parentY; // 父节点不同才是堂兄弟
    }
    // 只找到一个，说明不同层
    if (foundX || foundY) return false;
  }

  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 115. 二叉树的堂兄弟节点 =====");

// 辅助函数：从数组构建二叉树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 测试1: root = [1,2,3,4], x = 4, y = 3
//     1
//    / \
//   2   3
//  /
// 4
// 4在深度2，3在深度1，不同深度 -> false
const tree1 = buildTree([1, 2, 3, 4]);
console.log("测试1 DFS:", isCousins(tree1, 4, 3)); // 期望 false
const tree1b = buildTree([1, 2, 3, 4]);
console.log("测试1 BFS:", isCousinsBFS(tree1b, 4, 3)); // 期望 false

// 测试2: root = [1,2,3,null,4,null,5], x = 5, y = 4
//     1
//    / \
//   2   3
//    \   \
//     4   5
// 4和5都在深度2，父节点不同 -> true
const tree2 = buildTree([1, 2, 3, null, 4, null, 5]);
console.log("测试2 DFS:", isCousins(tree2, 5, 4)); // 期望 true
const tree2b = buildTree([1, 2, 3, null, 4, null, 5]);
console.log("测试2 BFS:", isCousinsBFS(tree2b, 5, 4)); // 期望 true

// 测试3: root = [1,2,3,null,4], x = 2, y = 3
//     1
//    / \
//   2   3
//    \
//     4
// 2和3同深度1，但父节点都是1 -> 兄弟而非堂兄弟 -> false
const tree3 = buildTree([1, 2, 3, null, 4]);
console.log("测试3 DFS:", isCousins(tree3, 2, 3)); // 期望 false

// 测试4: 根节点本身
const tree4 = buildTree([1, 2, 3]);
console.log("测试4 DFS:", isCousins(tree4, 1, 2)); // 期望 false

export {};
