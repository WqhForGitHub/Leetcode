// ============================================================
// 099. 二叉树中所有距离为 K 的结点
// ============================================================
// LeetCode 863. All Nodes Distance K in Binary Tree
// 给定一个二叉树（具有根节点 root）、一个目标节点 target 和一个整数值 K。
// 返回到目标节点 target 距离为 K 的所有节点的值的列表。
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

// 方法1：DFS 建图 + BFS（推荐）
// 思路：把树当作无向图，从 target 出发 BFS 走 K 步即可。
// 先 DFS 建立邻接表，再从 target 做 BFS。

function distanceK(root: TreeNode | null, target: TreeNode | null, k: number): number[] {
  if (root === null || target === null) return [];

  const graph = new Map<number, number[]>();

  // DFS 建无向图
  function buildGraph(node: TreeNode | null, parent: TreeNode | null): void {
    if (node === null) return;
    if (parent !== null) {
      if (!graph.has(node.val)) graph.set(node.val, []);
      if (!graph.has(parent.val)) graph.set(parent.val, []);
      graph.get(node.val)!.push(parent.val);
      graph.get(parent.val)!.push(node.val);
    }
    buildGraph(node.left, node);
    buildGraph(node.right, node);
  }
  buildGraph(root, null);

  // BFS 从 target 出发
  const visited = new Set<number>([target.val]);
  const queue: number[] = [target.val];
  let distance = 0;

  while (queue.length > 0) {
    if (distance === k) return queue; // 当前层所有节点即答案
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const curr = queue.shift()!;
      for (const next of graph.get(curr) || []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    distance++;
  }
  return [];
}

// 方法2：DFS 递归
// 思路：从 root 出发 DFS。分两种情况：
// - 当节点就是 target：从该节点向下找深度为 k 的所有子孙
// - target 在某子树中：记录到 target 的距离，则答案在另一子树中深度为 k - dist - 2 的节点
//   以及向上返回 dist 让祖先处理

function distanceKDFS(root: TreeNode | null, target: TreeNode | null, k: number): number[] {
  if (root === null || target === null) return [];
  const result: number[] = [];

  // 从 node 向下找深度为 dist 的所有节点
  function collect(node: TreeNode | null, dist: number): void {
    if (node === null || dist < 0) return;
    if (dist === 0) {
      result.push(node.val);
      return;
    }
    collect(node.left, dist - 1);
    collect(node.right, dist - 1);
  }

  // 返回 node 到 target 的距离（若 target 不在 node 子树中返回 -1）
  function dfs(node: TreeNode | null): number {
    if (node === null) return -1;
    if (node === target) {
      collect(node, k);
      return 0;
    }
    const leftDist = dfs(node.left);
    if (leftDist !== -1) {
      // target 在左子树，距离 = leftDist + 1
      // 在右子树中找深度为 k - leftDist - 2 的节点
      if (leftDist + 1 === k) result.push(node.val);
      else collect(node.right, k - leftDist - 2);
      return leftDist + 1;
    }
    const rightDist = dfs(node.right);
    if (rightDist !== -1) {
      if (rightDist + 1 === k) result.push(node.val);
      else collect(node.left, k - rightDist - 2);
      return rightDist + 1;
    }
    return -1;
  }

  dfs(root);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 二叉树中所有距离为 K 的结点 =====");

// 辅助函数：通过层序数组构建二叉树，并返回根和按值查找节点的映射
function buildTreeWithMap(arr: (number | null)[]): { root: TreeNode | null; map: Map<number, TreeNode> } {
  const map = new Map<number, TreeNode>();
  if (arr.length === 0 || arr[0] === null) return { root: null, map };
  const root = new TreeNode(arr[0]);
  map.set(arr[0], root);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        map.set(arr[i] as number, node.left!);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        map.set(arr[i] as number, node.right!);
        queue.push(node.right);
      }
      i++;
    }
  }
  return { root, map };
}

// 测试1: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2
//         3
//        / \
//       5   1
//      / \ / \
//     6  2 0  8
//       / \
//      7   4
// 距离5为2的节点：[7,4,1]
const { root: tree1, map: map1 } = buildTreeWithMap([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const target1 = map1.get(5)!;
console.log("方法1 - 距离5为2的节点:", distanceK(tree1, target1, 2)); // 期望 [7,4,1]（顺序可能不同）
console.log("方法2 - 距离5为2的节点:", distanceKDFS(tree1, target1, 2));

// 测试2: root = [1], target = 1, k = 3
const { root: tree2, map: map2 } = buildTreeWithMap([1]);
const target2 = map2.get(1)!;
console.log("测试2 - 距离1为3:", distanceK(tree2, target2, 3)); // 期望 []

// 测试3: k = 0 时应返回 target 本身
console.log("测试3 - 距离5为0:", distanceK(tree1, target1, 0)); // 期望 [5]

export {};
