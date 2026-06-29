// ============================================================
// 108. 二叉树的完全性检验
// ============================================================
// LeetCode 958. Check Completeness of a Binary Tree
// 给定一个二叉树，确定它是否是一个完全二叉树。
// 完全二叉树：除最后一层外全满，最后一层节点从左到右连续。
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

// 方法1：BFS层序标记（推荐）
// 层序遍历，遇到第一个 null 后，后面不应该再有非空节点
function isCompleteTree(root: TreeNode | null): boolean {
  if (root === null) return true;

  const queue: (TreeNode | null)[] = [root];
  let seenNull = false;

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      // 标记已遇到 null
      seenNull = true;
    } else {
      // 如果之前已遇到 null，但当前节点非空，则不是完全二叉树
      if (seenNull) return false;
      // 把左右孩子（包括 null）都入队
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 108. 二叉树的完全性检验 =====");

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

// 测试1: [1,2,3,4,5,6] 是完全二叉树
//       1
//      / \
//     2   3
//    / \  /
//   4   5 6
const tree1 = buildTree([1, 2, 3, 4, 5, 6]);
console.log("测试1:", isCompleteTree(tree1)); // 期望 true

// 测试2: [1,2,3,4,5,null,7] 不是完全二叉树
//       1
//      / \
//     2   3
//    / \   \
//   4   5   7
const tree2 = buildTree([1, 2, 3, 4, 5, null, 7]);
console.log("测试2:", isCompleteTree(tree2)); // 期望 false

// 测试3: 单节点
const tree3 = buildTree([1]);
console.log("测试3:", isCompleteTree(tree3)); // 期望 true

// 测试4: [1,2,3,4,5,6,7] 满二叉树，是完全二叉树
const tree4 = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("测试4:", isCompleteTree(tree4)); // 期望 true

// 测试5: [1,2,3,4,null,6] 中间缺节点，不是完全二叉树
const tree5 = buildTree([1, 2, 3, 4, null, 6]);
console.log("测试5:", isCompleteTree(tree5)); // 期望 false

export {};
