// ============================================================
// 071. 二叉树的坡度
// ============================================================
// LeetCode 563. Binary Tree Tilt
// 给定一个二叉树，计算整个树的坡度。一个节点的坡度是该节点左子树的节点之和
// 与右子树的节点之和的差的绝对值。整个树的坡度是所有节点坡度之和。
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

// 方法1：DFS后序递归（推荐）
// 后序遍历返回子树节点和，过程中累加每个节点的坡度
function findTilt(root: TreeNode | null): number {
  let totalTilt = 0;
  // 返回以 node 为根的子树节点之和
  function sum(node: TreeNode | null): number {
    if (node === null) return 0;
    const leftSum = sum(node.left);
    const rightSum = sum(node.right);
    // 当前节点的坡度 = |左子树和 - 右子树和|
    totalTilt += Math.abs(leftSum - rightSum);
    return node.val + leftSum + rightSum;
  }
  sum(root);
  return totalTilt;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. 二叉树的坡度 =====");
// 树:
//        1
//       / \
//      2   3
// 节点1坡度: |2-3|=1, 节点2坡度: 0, 节点3坡度: 0
// 总坡度: 1
const tree1 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log("[1,2,3]:", findTilt(tree1)); // 1

// 树:
//        4
//       / \
//      2   9
//     / \   \
//    3   5   7
// 节点3坡度0, 节点5坡度0
// 节点2坡度: |3-5|=2
// 节点7坡度0
// 节点9坡度: |0-7|=7
// 节点4坡度: |10-16|=6
// 总坡度: 0+0+2+0+7+6 = 15
const tree2 = new TreeNode(
  4,
  new TreeNode(2, new TreeNode(3), new TreeNode(5)),
  new TreeNode(9, null, new TreeNode(7))
);
console.log("[4,2,9,3,5,null,7]:", findTilt(tree2)); // 15

// 树:
//        21
//       /  \
//      7    14
//     / \   / \
//    1   1 2   2
//   / \
//  3   3
const tree3 = new TreeNode(
  21,
  new TreeNode(7, new TreeNode(1, new TreeNode(3), new TreeNode(3)), new TreeNode(1)),
  new TreeNode(14, new TreeNode(2), new TreeNode(2))
);
console.log("[21,7,14,1,1,2,2,3,3]:", findTilt(tree3)); // 9

// 单节点
const single = new TreeNode(1);
console.log("单节点:", findTilt(single)); // 0

// 空树
console.log("空树:", findTilt(null)); // 0

export {};
