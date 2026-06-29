// ============================================================
// 049. 左叶子之和
// ============================================================
// LeetCode 404. Sum of Left Leaves
// 给定二叉树的根节点 root，返回所有左叶子值之和。
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
// 判断左孩子是否为叶子节点，若是则累加其值，否则继续递归
function sumOfLeftLeaves(root: TreeNode | null): number {
  if (root === null) return 0;

  let sum = 0;
  // 判断左孩子是否是左叶子
  if (root.left !== null) {
    if (root.left.left === null && root.left.right === null) {
      // 左孩子是叶子节点
      sum += root.left.val;
    } else {
      // 左孩子不是叶子节点，继续递归
      sum += sumOfLeftLeaves(root.left);
    }
  }
  // 右子树继续递归
  sum += sumOfLeftLeaves(root.right);
  return sum;
}

// 方法2：迭代BFS
// 使用队列进行层序遍历，对每个节点检查其左孩子是否为叶子节点
function sumOfLeftLeavesBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  let sum = 0;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    // 检查左孩子是否是叶子节点
    if (node.left !== null) {
      if (node.left.left === null && node.left.right === null) {
        sum += node.left.val;
      } else {
        queue.push(node.left);
      }
    }
    // 右孩子入队
    if (node.right !== null) {
      queue.push(node.right);
    }
  }
  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 左叶子之和 =====");
// 构造树: [3,9,20,null,null,15,7]
//       3
//      / \
//     9  20
//       /  \
//      15   7
const tree1 = new TreeNode(3);
tree1.left = new TreeNode(9);
tree1.right = new TreeNode(20);
tree1.right.left = new TreeNode(15);
tree1.right.right = new TreeNode(7);
console.log("递归:", sumOfLeftLeaves(tree1)); // 期望结果 24 (9+15)
console.log("迭代BFS:", sumOfLeftLeavesBFS(tree1)); // 期望结果 24

// 构造树: [1]
const tree2 = new TreeNode(1);
console.log("递归:", sumOfLeftLeaves(tree2)); // 期望结果 0
console.log("迭代BFS:", sumOfLeftLeavesBFS(tree2)); // 期望结果 0

// 构造树: [1,2,3,4,5]
//       1
//      / \
//     2   3
//    / \
//   4   5
const tree3 = new TreeNode(1);
tree3.left = new TreeNode(2);
tree3.right = new TreeNode(3);
tree3.left.left = new TreeNode(4);
tree3.left.right = new TreeNode(5);
console.log("递归:", sumOfLeftLeaves(tree3)); // 期望结果 4
console.log("迭代BFS:", sumOfLeftLeavesBFS(tree3)); // 期望结果 4

export {};
