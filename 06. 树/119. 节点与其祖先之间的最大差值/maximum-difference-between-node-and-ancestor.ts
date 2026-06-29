// ============================================================
// 119. 节点与其祖先之间的最大差值
// ============================================================
// LeetCode 1026. Maximum Difference Between Node and Ancestor
// 给定二叉树的根节点 root，找出存在于不同节点之间的最大值 V，其中 V = |祖先节点值 - 子孙节点值|。
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

// 方法1：DFS递归传递最大最小值（推荐）
// 沿路径维护从根到当前节点的最大值和最小值
// 对每个节点，计算其值与路径最大/最小值的差，更新答案
let maxDiff: number;

function maxAncestorDiff(root: TreeNode | null): number {
  maxDiff = 0;
  dfs(root, root!.val, root!.val);
  return maxDiff;
}

function dfs(node: TreeNode | null, minVal: number, maxVal: number): void {
  if (node === null) return;

  // 用当前节点值与路径上的最大最小值比较，更新答案
  maxDiff = Math.max(
    maxDiff,
    Math.abs(node.val - minVal),
    Math.abs(node.val - maxVal)
  );

  // 更新路径上的最大最小值，继续递归
  const newMin = Math.min(minVal, node.val);
  const newMax = Math.max(maxVal, node.val);
  dfs(node.left, newMin, newMax);
  dfs(node.right, newMin, newMax);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 119. 节点与其祖先之间的最大差值 =====");

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

// 测试1: root = [8,3,10,1,6,null,14,null,null,4,7,13]
//         8
//        / \
//       3  10
//      / \   \
//     1   6   14
//        / \  /
//       4  7 13
// 最大差值: |8 - 1| = 7 或 |14 - 3| = 11 -> 7? 实际上 |14-1|=13 (1的祖先是3,8,3不是14的祖先)
// 答案是7（8和1）实际上正确答案是7
const tree1 = buildTree([8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13]);
console.log("测试1:", maxAncestorDiff(tree1)); // 期望 7

// 测试2: root = [1,null,2,null,0,3]
//     1
//      \
//       2
//        \
//         0
//        /
//       3
// 路径 1->2->0->3: 最大值2，最小值0，差值2
// 路径 1->2: 差值1
// 1和3: |3-1|=2
// 2和3: |3-2|=1
// 最大差值: |2-0|=2 实际正确答案应为3（|0-3|但0和3是父子）
// 注意：题目要求祖先和子孙，所以3的祖先是0,2,1，最大差值是|3-0|=3
const tree2 = buildTree([1, null, 2, null, 0, 3]);
console.log("测试2:", maxAncestorDiff(tree2)); // 期望 3

// 测试3: 单节点
const tree3 = buildTree([5]);
console.log("测试3:", maxAncestorDiff(tree3)); // 期望 0

// 测试4: root = [2,1,3]
//     2
//    / \
//   1   3
// 最大差值: |2-1|=1 或 |2-3|=1 -> 1
const tree4 = buildTree([2, 1, 3]);
console.log("测试4:", maxAncestorDiff(tree4)); // 期望 1

export {};
