// ============================================================
// 141. 二叉树中的最长交错路径
// ============================================================
// LeetCode 1372. Longest ZigZag Path in a Binary Tree
// 给你一棵以 root 为根的二叉树，交错路径定义为：从任意节点出发，
// 先左后右（或先右后左）交替方向的路径。返回最长的交错路径长度（边数）。
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

// 方法1：DFS递归返回左右方向长度（推荐）
// 返回从当前节点出发向左走和向右走的最长交错路径长度
// 全局维护最大值
function longestZigZag(root: TreeNode | null): number {
  let maxLength = 0;

  // 返回 [向左走的长度, 向右走的长度]
  function dfs(node: TreeNode | null): [number, number] {
    if (node === null) return [-1, -1];

    const left = dfs(node.left);
    const right = dfs(node.right);

    // 当前节点向左走 = 左子节点向右走的长度 + 1
    const goLeft = left[1] + 1;
    // 当前节点向右走 = 右子节点向左走的长度 + 1
    const goRight = right[0] + 1;

    if (goLeft > maxLength) maxLength = goLeft;
    if (goRight > maxLength) maxLength = goRight;

    return [goLeft, goRight];
  }

  dfs(root);
  return maxLength;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 141. 二叉树中的最长交错路径 =====");

function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left!);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right!);
    }
    i++;
  }
  return root;
}

// 测试1:
//        1
//         \
//          1
//         / \
//        1   1
//         \   \
//          1   1
//           \
//            1
// 期望 3
// 路径: 节点(2,即右1) -> (3,即左) -> (5,即右) -> (6,即左)? 实际题意
// LeetCode示例1: right=null表示
// 实际测试用例: [1,null,1,1,1,null,null,1,null,1,null,null,null,1]
const tree1 = buildTree([1, null, 1, 1, 1, null, null, 1, null, 1, null, null, null, 1]);
console.log("测试1:", longestZigZag(tree1)); // 期望 3

// 测试2:
//       1
//      / \
//     1   1
//    /     \
//   1       1
//  /         \
// 1           1
// 期望 4
const tree2 = buildTree([1, 1, 1, 1, null, null, 1, 1, null, null, null, null, 1]);
console.log("测试2:", longestZigZag(tree2)); // 期望 4

// 测试3: 单节点
const tree3 = buildTree([1]);
console.log("测试3:", longestZigZag(tree3)); // 期望 0

export {};
