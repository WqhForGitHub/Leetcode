// ============================================================
// 053. N 叉树的层序遍历
// ============================================================
// LeetCode 429. N-ary Tree Level Order Traversal
// 给定一个 N 叉树，返回其节点值的层序遍历（即从左到右，逐层遍历）。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：BFS队列（推荐）
// 使用队列进行层序遍历，每次处理一整层
function levelOrder(root: Node | null): number[][] {
  if (root === null) return [];
  const result: number[][] = [];
  const queue: Node[] = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      for (const child of node.children) {
        queue.push(child);
      }
    }
    result.push(level);
  }
  return result;
}

// 方法2：DFS递归
// 通过深度优先遍历，根据当前深度将节点值加入对应层
function levelOrderDFS(root: Node | null): number[][] {
  const result: number[][] = [];
  function dfs(node: Node | null, depth: number): void {
    if (node === null) return;
    if (result.length === depth) {
      result.push([]);
    }
    result[depth].push(node.val);
    for (const child of node.children) {
      dfs(child, depth + 1);
    }
  }
  dfs(root, 0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. N 叉树的层序遍历 =====");
// 构造N叉树:
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
const tree1 = new Node(1);
tree1.children = [new Node(3), new Node(2), new Node(4)];
tree1.children[0].children = [new Node(5), new Node(6)];
console.log("BFS:", levelOrder(tree1)); // 期望结果 [[1],[3,2,4],[5,6]]
console.log("DFS:", levelOrderDFS(tree1)); // 期望结果 [[1],[3,2,4],[5,6]]

// 空树
console.log("空树BFS:", levelOrder(null)); // 期望结果 []
console.log("空树DFS:", levelOrderDFS(null)); // 期望结果 []

// 单节点
const tree2 = new Node(1);
console.log("单节点BFS:", levelOrder(tree2)); // 期望结果 [[1]]
console.log("单节点DFS:", levelOrderDFS(tree2)); // 期望结果 [[1]]

export {};
