// ============================================================
// 138. 分裂二叉树的最大乘积
// ============================================================
// LeetCode 1339. Maximum Product of Splitted Binary Tree
// 给你一棵二叉树，将树分成两棵子树（断开一条边），
// 使得这两棵子树节点值之和的乘积最大。返回最大乘积 mod 1e9+7。
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

const MOD = 1e9 + 7;

// 方法1：DFS计算总和+遍历找最大乘积（推荐）
// 第一遍求整棵树和，第二遍每个子树和作为一部分，剩余总和-子树和作为另一部分
function maxProduct(root: TreeNode | null): number {
  // 第一遍：计算整棵树的总和
  function treeSum(node: TreeNode | null): number {
    if (node === null) return 0;
    return node.val + treeSum(node.left) + treeSum(node.right);
  }

  const total = treeSum(root);
  let maxProd = 0;

  // 第二遍：遍历每个节点，将以该节点为根的子树作为一部分
  function dfs(node: TreeNode | null): number {
    if (node === null) return 0;
    const subSum = node.val + dfs(node.left) + dfs(node.right);
    // 子树和 * (总和 - 子树和)
    const product = subSum * (total - subSum);
    if (product > maxProd) maxProd = product;
    return subSum;
  }

  dfs(root);
  return Math.floor(maxProd % MOD);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 138. 分裂二叉树的最大乘积 =====");

// 辅助函数：数组构建树（层序）
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
//       1
//      / \
//     2   3
//    / \
//   4   5
//  / \
// 6   7
// 总和=28, 切断1-3边: 3 * 25 = 75; 切断1-2边: 24 * 4 = 96...
// 子树2和为 2+4+5+6+7=24, 24*4=96
// 子树3和为3, 3*25=75
// 子树4和为 4+6+7=17, 17*11=187
// 子树5和为5, 5*23=115
// 子树6和为6, 6*22=132
// 子树7和为7, 7*21=147
// 最大=187
const tree1 = buildTree([1, 2, 3, 4, 5, 6, 7]);
console.log("测试1:", maxProduct(tree1)); // 期望 187 实际不同顺序

// 注：题目数组是层序，1的左子2，右子3；2的左4右5；3的左6右7
// 子树4和=4, 4*24=96
// 子树5和=5, 5*23=115
// 子树6和=6, 6*22=132
// 子树7和=7, 7*21=147
// 子树2和=2+4+5=11, 11*17=187
// 子树3和=3+6+7=16, 16*12=192
// 最大=192
console.log("测试1 修正:", maxProduct(buildTree([1, 2, 3, 4, 5, 6, 7]))); // 192

// 测试2: [1,null,2,3,4,null,null,5,6]
//        1
//         \
//          2
//         / \
//        3   4
//           / \
//          5   6
// 总和=21
// 子树2和=20, 20*1=20
// 子树3和=3, 3*18=54
// 子树4和=15, 15*6=90
// 子树5和=5, 5*16=80
// 子树6和=6, 6*15=90
// 最大=90
const tree2 = buildTree([1, null, 2, 3, 4, null, null, 5, 6]);
console.log("测试2:", maxProduct(tree2)); // 期望 90

export {};
