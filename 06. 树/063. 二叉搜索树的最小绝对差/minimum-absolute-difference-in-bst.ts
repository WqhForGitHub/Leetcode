// ============================================================
// 063. 二叉搜索树的最小绝对差
// ============================================================
// LeetCode 530. Minimum Absolute Difference in BST
// 给你一个二叉搜索树的根节点 root，返回树中任意两个不同节点值之间的最小差值。
// 时间复杂度：O(n)，空间复杂度：O(n)（方法1）/ O(1)（方法2）

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

// 方法1：中序遍历递归（推荐）
// BST中序遍历得到升序序列，相邻节点差值取最小
function getMinimumDifference(root: TreeNode | null): number {
  let prev: TreeNode | null = null;
  let minDiff = Infinity;
  function inorder(node: TreeNode | null): void {
    if (node === null) return;
    inorder(node.left);
    if (prev !== null) {
      minDiff = Math.min(minDiff, node.val - prev.val);
    }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  return minDiff;
}

// 方法2：Morris中序遍历
// 利用线索化思想，空间复杂度 O(1)
function getMinimumDifferenceMorris(root: TreeNode | null): number {
  let minDiff = Infinity;
  let prev: TreeNode | null = null;
  let curr: TreeNode | null = root;
  while (curr !== null) {
    if (curr.left === null) {
      // 访问当前节点
      if (prev !== null) {
        minDiff = Math.min(minDiff, curr.val - prev.val);
      }
      prev = curr;
      curr = curr.right;
    } else {
      // 找到前驱节点
      let predecessor = curr.left;
      while (predecessor.right !== null && predecessor.right !== curr) {
        predecessor = predecessor.right;
      }
      if (predecessor.right === null) {
        // 建立线索
        predecessor.right = curr;
        curr = curr.left;
      } else {
        // 删除线索并访问当前节点
        predecessor.right = null;
        if (prev !== null) {
          minDiff = Math.min(minDiff, curr.val - prev.val);
        }
        prev = curr;
        curr = curr.right;
      }
    }
  }
  return minDiff;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 二叉搜索树的最小绝对差 =====");
// BST:
//        4
//       / \
//      2   6
//     / \
//    1   3
// 中序: 1,2,3,4,6 最小差值 1
const tree1 = new TreeNode(
  4,
  new TreeNode(2, new TreeNode(1), new TreeNode(3)),
  new TreeNode(6)
);
console.log("中序 [4,2,6,1,3]:", getMinimumDifference(tree1)); // 1
console.log("Morris [4,2,6,1,3]:", getMinimumDifferenceMorris(tree1)); // 1

// BST:
//        1
//         \
//          3
//         / \
//        2   4
// 中序: 1,2,3,4 最小差值 1
const tree2 = new TreeNode(
  1,
  null,
  new TreeNode(3, new TreeNode(2), new TreeNode(4))
);
console.log("中序 [1,null,3,2,4]:", getMinimumDifference(tree2)); // 1
console.log("Morris [1,null,3,2,4]:", getMinimumDifferenceMorris(tree2)); // 1

// BST:
//        5
//       / \
//      0   48
//         /  \
//        1    7
// 中序: 0,1,5,7,48 最小差值 1
const tree3 = new TreeNode(
  5,
  new TreeNode(0),
  new TreeNode(48, new TreeNode(1), new TreeNode(7))
);
console.log("中序 [5,0,48,null,null,1,7]:", getMinimumDifference(tree3)); // 1
console.log("Morris [5,0,48,null,null,1,7]:", getMinimumDifferenceMorris(tree3)); // 1

export {};
