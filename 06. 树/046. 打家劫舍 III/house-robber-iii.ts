// ============================================================
// 046. 打家劫舍 III
// ============================================================
// LeetCode 337. House Robber III
// 小偷发现了一个新的地方，这个地区的所有房屋的排列类似于一棵二叉树。
// 如果两个直接相连的房子在同一天晚上被打劫，房屋将自动报警。
// 返回在不触动警报的情况下，小偷一晚能够盗取的最高金额。
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

// 方法1：递归返回[偷/不偷]（推荐）
// 对于每个节点，返回一个长度为2的数组：
// result[0] 表示不偷当前节点能获得的最大金额
// result[1] 表示偷当前节点能获得的最大金额
function rob(root: TreeNode | null): number {
  function dfs(node: TreeNode | null): [number, number] {
    if (node === null) return [0, 0];
    const left = dfs(node.left);
    const right = dfs(node.right);
    // 不偷当前节点：左右子节点可偷可不偷，取各自最大值相加
    const notRob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    // 偷当前节点：左右子节点都不能偷
    const rob = node.val + left[0] + right[0];
    return [notRob, rob];
  }
  const result = dfs(root);
  return Math.max(result[0], result[1]);
}

// 方法2：记忆化递归
// 使用 Map 缓存以每个节点为根的子树的最大金额
function robMemo(root: TreeNode | null): number {
  const memo = new Map<TreeNode, number>();

  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    if (memo.has(node)) return memo.get(node)!;

    // 偷当前节点，则跳过直接子节点
    let rob = node.val;
    if (node.left !== null) {
      rob += dfs(node.left.left) + dfs(node.left.right);
    }
    if (node.right !== null) {
      rob += dfs(node.right.left) + dfs(node.right.right);
    }

    // 不偷当前节点
    const notRob = dfs(node.left) + dfs(node.right);

    const result = Math.max(rob, notRob);
    memo.set(node, result);
    return result;
  }

  return dfs(root);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 打家劫舍 III =====");
// 构造树: [3,2,3,null,3,null,1]
//       3
//      / \
//     2   3
//      \   \
//       3   1
const tree1 = new TreeNode(3);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(3);
tree1.left.right = new TreeNode(3);
tree1.right.right = new TreeNode(1);
console.log("递归[偷/不偷]:", rob(tree1)); // 期望结果 7
console.log("记忆化递归:", robMemo(tree1)); // 期望结果 7

// 构造树: [3,4,5,1,3,null,1]
//        3
//       / \
//      4   5
//     / \   \
//    1   3   1
const tree2 = new TreeNode(3);
tree2.left = new TreeNode(4);
tree2.right = new TreeNode(5);
tree2.left.left = new TreeNode(1);
tree2.left.right = new TreeNode(3);
tree2.right.right = new TreeNode(1);
console.log("递归[偷/不偷]:", rob(tree2)); // 期望结果 9
console.log("记忆化递归:", robMemo(tree2)); // 期望结果 9

export {};
