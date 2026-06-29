// ============================================================
// 070. N 叉树的最大深度
// ============================================================
// LeetCode 559. Maximum Depth of N-ary Tree
// 给定一个 N 叉树，找到其最大深度（从根节点到最远叶子节点的最长路径上的节点数）。
// 时间复杂度：O(n)，空间复杂度：O(h)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：递归（推荐）
// 最大深度 = 1 + max(各子树最大深度)
function maxDepth(root: Node | null): number {
  if (root === null) return 0;
  let maxChildDepth = 0;
  for (const child of root.children) {
    maxChildDepth = Math.max(maxChildDepth, maxDepth(child));
  }
  return 1 + maxChildDepth;
}

// 方法2：BFS层序
// 逐层遍历，记录层数
function maxDepthBFS(root: Node | null): number {
  if (root === null) return 0;
  const queue: Node[] = [root];
  let depth = 0;
  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      for (const child of node.children) {
        queue.push(child);
      }
    }
    depth++;
  }
  return depth;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. N 叉树的最大深度 =====");
// N叉树:
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
// 最大深度 3
const tree1 = new Node(1);
tree1.children = [new Node(3), new Node(2), new Node(4)];
tree1.children[0].children = [new Node(5), new Node(6)];
console.log("递归 [1,3,2,4,5,6]:", maxDepth(tree1)); // 3
console.log("BFS  [1,3,2,4,5,6]:", maxDepthBFS(tree1)); // 3

// 单节点
const single = new Node(1);
console.log("递归 单节点:", maxDepth(single)); // 1
console.log("BFS  单节点:", maxDepthBFS(single)); // 1

// 空树
console.log("递归 空树:", maxDepth(null)); // 0
console.log("BFS  空树:", maxDepthBFS(null)); // 0

// 深层单分支
//   1
//   |
//   2
//   |
//   3
const tree2 = new Node(1);
tree2.children = [new Node(2)];
tree2.children[0].children = [new Node(3)];
console.log("递归 单分支:", maxDepth(tree2)); // 3
console.log("BFS  单分支:", maxDepthBFS(tree2)); // 3

export {};
