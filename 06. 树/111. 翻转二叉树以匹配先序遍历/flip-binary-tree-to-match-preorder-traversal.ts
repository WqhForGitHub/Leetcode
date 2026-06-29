// ============================================================
// 111. 翻转二叉树以匹配先序遍历
// ============================================================
// LeetCode 971. Flip Binary Tree To Match Preorder Traversal
// 给定一棵有 N 个节点的二叉树，其节点值为 1...N 的排列。给定一个 voyage（前序遍历期望值数组）。
// 通过翻转某些节点的左右子树，使其前序遍历与 voyage 匹配。返回翻转节点的值列表，若不可能返回 [-1]。
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
// 按前序遍历顺序匹配 voyage
// 若当前节点值不匹配 -> 失败
// 若下一个期望值是左孩子值 -> 不翻转，正常递归
// 若下一个期望值是右孩子值 -> 翻转（记录当前节点值），先递归右再递归左
let voy: number[];
let idx: number;
let flipped: number[];

function flipMatchVoyage(root: TreeNode | null, voyage: number[]): number[] {
  voy = voyage;
  idx = 0;
  flipped = [];
  return dfs(root) ? flipped : [-1];
}

function dfs(node: TreeNode | null): boolean {
  if (node === null) return true;
  // 当前节点值不匹配 voyage
  if (node.val !== voy[idx]) return false;
  idx++;

  // 如果当前左孩子存在，且下一个期望值不等于左孩子值，
  // 但等于右孩子值，则需要翻转
  if (
    node.left !== null &&
    node.left.val !== voy[idx] &&
    node.right !== null &&
    node.right.val === voy[idx]
  ) {
    // 翻转左右子树
    flipped.push(node.val);
    const temp = node.left;
    node.left = node.right;
    node.right = temp;
  }

  // 正常前序递归
  return dfs(node.left) && dfs(node.right);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 111. 翻转二叉树以匹配先序遍历 =====");

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

// 测试1: root = [1,2,3], voyage = [1,3,2]
// 翻转节点1，前序变为 1,3,2
const tree1 = buildTree([1, 2, 3]);
console.log("测试1:", flipMatchVoyage(tree1, [1, 3, 2])); // 期望 [1]

// 测试2: root = [1,2,3], voyage = [1,2,3]
// 不需要翻转
const tree2 = buildTree([1, 2, 3]);
console.log("测试2:", flipMatchVoyage(tree2, [1, 2, 3])); // 期望 []

// 测试3: root = [1,2,3], voyage = [1,2,4]
// 不可能匹配
const tree3 = buildTree([1, 2, 3]);
console.log("测试3:", flipMatchVoyage(tree3, [1, 2, 4])); // 期望 [-1]

// 测试4: 单节点
const tree4 = buildTree([1]);
console.log("测试4:", flipMatchVoyage(tree4, [1])); // 期望 []

// 测试5: root = [1,null,2,null,3], voyage = [1,2,3]
const tree5 = buildTree([1, null, 2, null, 3]);
console.log("测试5:", flipMatchVoyage(tree5, [1, 2, 3])); // 期望 []

export {};
