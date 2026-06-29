// ============================================================
// 106. 二叉搜索树的范围和
// ============================================================
// LeetCode 938. Range Sum of BST
// 给定二叉搜索树的根结点 root，返回值位于范围 [low, high] 之间的所有结点的值的和。
// 时间复杂度：O(n)，空间复杂度：O(h) （n为节点数，h为树高）

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

// 方法1：递归利用BST性质（推荐）
// 利用 BST 性质剪枝：若当前值小于 low，只递归右子树；若当前值大于 high，只递归左子树
function rangeSumBST(root: TreeNode | null, low: number, high: number): number {
  if (root === null) return 0;

  // 当前值在范围内，累加当前值并递归左右子树
  if (root.val >= low && root.val <= high) {
    return (
      root.val +
      rangeSumBST(root.left, low, high) +
      rangeSumBST(root.right, low, high)
    );
  }

  // 当前值小于 low，只递归右子树（左子树都更小，不可能在范围内）
  if (root.val < low) {
    return rangeSumBST(root.right, low, high);
  }

  // 当前值大于 high，只递归左子树（右子树都更大，不可能在范围内）
  return rangeSumBST(root.left, low, high);
}

// 方法2：迭代BFS
// 使用队列层序遍历，累加范围内的值
function rangeSumBSTBFS(root: TreeNode | null, low: number, high: number): number {
  if (root === null) return 0;
  let sum = 0;
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.val >= low && node.val <= high) {
      sum += node.val;
    }
    // 利用 BST 性质剪枝
    if (node.left !== null && node.val > low) {
      queue.push(node.left);
    }
    if (node.right !== null && node.val < high) {
      queue.push(node.right);
    }
  }

  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 106. 二叉搜索树的范围和 =====");

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

// 测试1: root = [10,5,15,3,7,null,18], low = 7, high = 15
//       10
//      /  \
//     5    15
//    / \     \
//   3   7    18
// 范围内节点：7, 10, 15 -> 和 = 32
const tree1 = buildTree([10, 5, 15, 3, 7, null, 18]);
console.log("测试1 递归:", rangeSumBST(tree1, 7, 15)); // 期望 32
console.log("测试1 BFS:", rangeSumBSTBFS(tree1, 7, 15)); // 期望 32

// 测试2: root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10
//         10
//        /  \
//       5    15
//      / \  / \
//     3  7 13 18
//    /  /
//   1  6
// 范围内节点：6, 7, 10 -> 和 = 23
const tree2 = buildTree([10, 5, 15, 3, 7, 13, 18, 1, null, 6]);
console.log("测试2 递归:", rangeSumBST(tree2, 6, 10)); // 期望 23
console.log("测试2 BFS:", rangeSumBSTBFS(tree2, 6, 10)); // 期望 23

// 测试3: 单节点在范围内
const tree3 = buildTree([5]);
console.log("测试3 递归:", rangeSumBST(tree3, 5, 5)); // 期望 5
console.log("测试3 BFS:", rangeSumBSTBFS(tree3, 5, 5)); // 期望 5

// 测试4: 单节点不在范围内
console.log("测试4 递归:", rangeSumBST(tree3, 6, 10)); // 期望 0

export {};
