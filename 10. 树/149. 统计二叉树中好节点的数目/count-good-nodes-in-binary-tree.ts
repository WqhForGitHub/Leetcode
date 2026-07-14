// ============================================================
// 149. 统计二叉树中好节点的数目
// ============================================================
// LeetCode 1448. Count Good Nodes in Binary Tree
// 给定一棵二叉树的根节点 root，请统计树中的"好节点"数目。
// 好节点是指从根到该节点路径上没有比它更大的节点（即该节点值 >= 路径最大值）。
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

// 方法1：DFS递归传最大值（推荐）
// 递归时维护从根到当前节点路径上的最大值，若当前节点值>=最大值则计数
function goodNodes(root: TreeNode | null): number {
  let count = 0;

  function dfs(node: TreeNode | null, maxVal: number): void {
    if (node === null) return;
    if (node.val >= maxVal) {
      count++;
      maxVal = node.val;
    }
    dfs(node.left, maxVal);
    dfs(node.right, maxVal);
  }

  dfs(root, -Infinity);
  return count;
}

// 方法2：BFS迭代
// 队列中保存 (节点, 路径最大值)
function goodNodesBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  let count = 0;
  const queue: [TreeNode, number][] = [[root, root.val]];

  while (queue.length > 0) {
    const [node, maxVal] = queue.shift()!;
    if (node.val >= maxVal) {
      count++;
    }
    const newMax = Math.max(maxVal, node.val);
    if (node.left) queue.push([node.left, newMax]);
    if (node.right) queue.push([node.right, newMax]);
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 149. 统计二叉树中好节点的数目 =====");

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

// 测试1: [3,1,4,3,null,1,5]
//        3
//       / \
//      1   4
//     /   / \
//    3   1   5
// 好节点: 3(根),3(左子树3>=3),4(>=3),5(>=4) = 4个
const tree1 = buildTree([3, 1, 4, 3, null, 1, 5]);
console.log("测试1 DFS:", goodNodes(tree1)); // 期望 4
console.log("测试1 BFS:", goodNodesBFS(tree1)); // 期望 4

// 测试2: [3,3,null,4,2]
//        3
//       /
//      3
//     / \
//    4   2
// 好节点: 3(根),3(>=3),4(>=3) = 3个 (2<3不算)
const tree2 = buildTree([3, 3, null, 4, 2]);
console.log("测试2 DFS:", goodNodes(tree2)); // 期望 3
console.log("测试2 BFS:", goodNodesBFS(tree2)); // 期望 3

// 测试3: [1] 单节点
const tree3 = buildTree([1]);
console.log("测试3 DFS:", goodNodes(tree3)); // 期望 1
console.log("测试3 BFS:", goodNodesBFS(tree3)); // 期望 1

// 测试4: [2,null,4,10,8,null,null,4]
//        2
//         \
//          4
//         / \
//        10  8
//           /
//          4
// 好节点: 2,4,10,8 (4<8不算) = 4个
const tree4 = buildTree([2, null, 4, 10, 8, null, null, 4]);
console.log("测试4 DFS:", goodNodes(tree4)); // 期望 4
console.log("测试4 BFS:", goodNodesBFS(tree4)); // 期望 4

export {};
