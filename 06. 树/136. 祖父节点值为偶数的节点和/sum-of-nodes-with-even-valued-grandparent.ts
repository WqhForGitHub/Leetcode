// ============================================================
// 136. 祖父节点值为偶数的节点和
// ============================================================
// LeetCode 1315. Sum of Nodes with Even-Valued Grandparent
// 给你一棵二叉树，请你返回满足以下条件的所有节点值之和：
// 该节点的祖父节点（即父节点的父节点）的值是偶数。
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

// 方法1：DFS递归传祖父节点（推荐）
// 递归时同时传递父节点和祖父节点，若祖父节点存在且值为偶数，累加当前节点值
function sumEvenGrandparent(root: TreeNode | null): number {
  let sum = 0;

  function dfs(node: TreeNode | null, parent: TreeNode | null, grandparent: TreeNode | null): void {
    if (node === null) return;
    if (grandparent !== null && grandparent.val % 2 === 0) {
      sum += node.val;
    }
    dfs(node.left, node, parent);
    dfs(node.right, node, parent);
  }

  dfs(root, null, null);
  return sum;
}

// 方法2：BFS层序遍历
// 队列中保存 (节点, 父节点, 祖父节点)，逐层处理
function sumEvenGrandparentBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  let sum = 0;
  // 队列元素: [节点, 父节点, 祖父节点]
  const queue: [TreeNode, TreeNode | null, TreeNode | null][] = [[root, null, null]];

  while (queue.length > 0) {
    const [node, parent, grandparent] = queue.shift()!;
    if (grandparent !== null && grandparent.val % 2 === 0) {
      sum += node.val;
    }
    if (node.left) queue.push([node.left, node, parent]);
    if (node.right) queue.push([node.right, node, parent]);
  }

  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 136. 祖父节点值为偶数的节点和 =====");

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
//        6
//       / \
//      7   8
//     / \ / \
//    2  7 1  3
//   / \     / \
//  9   1   4   5
// 祖父为6(偶数): 2,7,1,3 -> 和=13
// 祖父为7(奇数): 9,1 不计
// 祖父为8(偶数): 4,5 -> 和=9
// 总和=18
const tree1 = buildTree([6, 7, 8, 2, 7, 1, 3, 9, null, 1, 4, null, null, null, 5]);
console.log("测试1 DFS:", sumEvenGrandparent(tree1)); // 期望 18
console.log("测试1 BFS:", sumEvenGrandparentBFS(tree1)); // 期望 18

// 测试2: 单节点
const tree2 = buildTree([1]);
console.log("测试2 DFS:", sumEvenGrandparent(tree2)); // 期望 0
console.log("测试2 BFS:", sumEvenGrandparentBFS(tree2)); // 期望 0

export {};
