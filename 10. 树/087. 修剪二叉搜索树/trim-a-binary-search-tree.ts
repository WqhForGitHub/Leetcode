// ============================================================
// 087. 修剪二叉搜索树
// ============================================================
// LeetCode 669. Trim a Binary Search Tree
// 给你二叉搜索树的根节点 root，同时给定最小边界 low 和最大边界 high。
// 通过修剪二叉搜索树，使得所有节点的值在 [low, high] 中。
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

// 方法1：递归（推荐）
// - 若 node.val < low：左子树全部舍弃，返回修剪后的右子树
// - 若 node.val > high：右子树全部舍弃，返回修剪后的左子树
// - 否则：递归修剪左右子树并保留当前节点
function trimBST(root: TreeNode | null, low: number, high: number): TreeNode | null {
  if (root === null) return null;
  if (root.val < low) {
    // 当前节点太小，连同左子树都舍弃
    return trimBST(root.right, low, high);
  }
  if (root.val > high) {
    // 当前节点太大，连同右子树都舍弃
    return trimBST(root.left, low, high);
  }
  // 当前节点在范围内，修剪左右子树
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}

// 方法2：迭代
// 先找到第一个在范围内的根节点
// 然后分别迭代修剪左子树（删太小的）和右子树（删太大的）
function trimBSTIterative(root: TreeNode | null, low: number, high: number): TreeNode | null {
  if (root === null) return null;
  // 找到第一个在 [low, high] 范围内的根
  while (root !== null && (root.val < low || root.val > high)) {
    if (root.val < low) {
      root = root.right;
    } else {
      root = root.left;
    }
  }
  if (root === null) return null;
  // 修剪左子树：删除所有值 < low 的节点
  let curr: TreeNode | null = root;
  while (curr !== null) {
    while (curr.left !== null && curr.left.val < low) {
      // 左孩子太小，用其右孩子替换
      curr.left = curr.left.right;
    }
    curr = curr.left;
  }
  // 修剪右子树：删除所有值 > high 的节点
  curr = root;
  while (curr !== null) {
    while (curr.right !== null && curr.right.val > high) {
      // 右孩子太大，用其左孩子替换
      curr.right = curr.right.left;
    }
    curr = curr.right;
  }
  return root;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. 修剪二叉搜索树 =====");

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: root = [1,0,2], low = 1, high = 2
//     1          1
//    / \   =>     \
//   0   2          2
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(0);
tree1.right = new TreeNode(2);
console.log("递归:", treeToArray(trimBST(tree1, 1, 2))); // 期望 [1,null,2]
const tree1b = new TreeNode(1);
tree1b.left = new TreeNode(0);
tree1b.right = new TreeNode(2);
console.log("迭代:", treeToArray(trimBSTIterative(tree1b, 1, 2))); // 期望 [1,null,2]

// 测试2: root = [3,0,4,null,2,null,null,1], low = 1, high = 3
//       3              3
//      / \            /
//     0   4    =>    2
//      \            /
//       2          1
//      /
//     1
const tree2 = new TreeNode(3);
tree2.left = new TreeNode(0);
tree2.right = new TreeNode(4);
tree2.left.right = new TreeNode(2);
tree2.left.right.left = new TreeNode(1);
console.log("递归:", treeToArray(trimBST(tree2, 1, 3))); // 期望 [3,2,null,1]
const tree2b = new TreeNode(3);
tree2b.left = new TreeNode(0);
tree2b.right = new TreeNode(4);
tree2b.left.right = new TreeNode(2);
tree2b.left.right.left = new TreeNode(1);
console.log("迭代:", treeToArray(trimBSTIterative(tree2b, 1, 3))); // 期望 [3,2,null,1]

// 测试3: root = [1], low = 1, high = 2
const tree3 = new TreeNode(1);
console.log("递归:", treeToArray(trimBST(tree3, 1, 2))); // 期望 [1]
const tree3b = new TreeNode(1);
console.log("迭代:", treeToArray(trimBSTIterative(tree3b, 1, 2))); // 期望 [1]

// 测试4: root = [1,null,2], low = 2, high = 4
const tree4 = new TreeNode(1);
tree4.right = new TreeNode(2);
console.log("递归:", treeToArray(trimBST(tree4, 2, 4))); // 期望 [2]
const tree4b = new TreeNode(1);
tree4b.right = new TreeNode(2);
console.log("迭代:", treeToArray(trimBSTIterative(tree4b, 2, 4))); // 期望 [2]

export {};
