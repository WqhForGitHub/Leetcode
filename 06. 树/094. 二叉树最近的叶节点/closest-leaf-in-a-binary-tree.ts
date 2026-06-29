// ============================================================
// 094. 二叉树最近的叶节点
// ============================================================
// LeetCode 742. Closest Leaf in a Binary Tree
// 给定一个二叉树（每个节点值唯一）和一个整数值 k，找到距离值为 k 的节点最近的叶节点。
// 距离指两个节点之间边的数量。返回最近的叶节点的值。
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

// 方法1：图 BFS（先建图再 BFS）
// 思路：把树转成无向图，然后从值为 k 的节点开始 BFS，
// 第一个遇到的叶节点（在原树中左右孩子都为空）即为答案。

function findClosestLeaf(root: TreeNode | null, k: number): number {
  if (root === null) return -1;

  // 建立无向图：邻接表 + 节点值 -> TreeNode 映射 + 叶节点集合
  const graph = new Map<number, number[]>();
  const leaves = new Set<number>();
  let startNode: TreeNode | null = null;

  function dfs(node: TreeNode | null, parent: TreeNode | null): void {
    if (node === null) return;
    if (node.val === k) startNode = node;
    if (node.left === null && node.right === null) {
      leaves.add(node.val);
    }
    if (parent !== null) {
      if (!graph.has(node.val)) graph.set(node.val, []);
      if (!graph.has(parent.val)) graph.set(parent.val, []);
      graph.get(node.val)!.push(parent.val);
      graph.get(parent.val)!.push(node.val);
    }
    dfs(node.left, node);
    dfs(node.right, node);
  }

  dfs(root, null);

  // 如果起点本身就是叶节点，直接返回
  if (startNode && leaves.has(startNode.val)) return startNode.val;

  // BFS 从 k 开始找最近的叶节点
  const visited = new Set<number>([k]);
  const queue: number[] = [k];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (leaves.has(curr)) return curr;
    const neighbors = graph.get(curr) || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 二叉树最近的叶节点 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForClosestLeaf(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 测试1: root = [1,3,2], k = 1
//     1
//    / \
//   3   2
// 节点1到叶节点2距离1，到叶节点3距离1，取较小值，叶节点3（或2，按题意通常返回先遇到的）
const tree1 = buildTreeForClosestLeaf([1, 3, 2]);
console.log("测试1 - 距离1最近的叶节点:", findClosestLeaf(tree1, 1)); // 期望 2 或 3

// 测试2: root = [1,2,3,4,null,null,null,5,null,6], k = 2
//           1
//          / \
//         2   3
//        /
//       4
//      /
//     5
//    /
//   6
// k=2 节点的最近叶节点为 3，距离1
const tree2 = buildTreeForClosestLeaf([1, 2, 3, 4, null, null, null, 5, null, 6]);
console.log("测试2 - 距离2最近的叶节点:", findClosestLeaf(tree2, 2)); // 期望 3

// 测试3: root = [1,2,3,null,null,4,5,6,null,null,null,7,8], k = 4
//                1
//               / \
//              2   3
//                 / \
//                4   5
//               /
//              6
//             / \
//            7   8
// k=4 的最近叶节点是 7（距离2）或 8（距离2）或 2（距离2）
const tree3 = buildTreeForClosestLeaf([1, 2, 3, null, null, 4, 5, 6, null, null, null, 7, 8]);
console.log("测试3 - 距离4最近的叶节点:", findClosestLeaf(tree3, 4));

// 测试4: 单节点
const tree4 = buildTreeForClosestLeaf([1]);
console.log("测试4 - 单节点:", findClosestLeaf(tree4, 1)); // 期望 1

export {};
