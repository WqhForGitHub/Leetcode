// ============================================================
// 158. N 叉树的直径
// ============================================================
// LeetCode 1522. Diameter of N-Ary Tree
// 给定一棵 N 叉树，计算其直径长度。
// 直径是任意两个节点之间路径长度的最大值（边数）。
// 时间复杂度：O(n)，空间复杂度：O(h)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：DFS后序遍历找最大和次大深度
// 直径 = 过某节点的 最大深度 + 次大深度 的最大值
// 因为直径路径必然在某节点处"拐弯"（这个节点是路径上最靠近根的节点）
function diameter(root: Node | null): number {
  let ans = 0;

  // 返回从 node 向下最深路径长度（边数）
  function dfs(node: Node | null): number {
    if (node === null) return 0;
    // 叶子节点：深度 0
    if (node.children.length === 0) return 0;

    // 找最大和次大深度
    let max1 = 0;
    let max2 = 0;
    for (const child of node.children) {
      const d = dfs(child) + 1; // +1 表示当前边
      if (d > max1) {
        max2 = max1;
        max1 = d;
      } else if (d > max2) {
        max2 = d;
      }
    }
    // 经过当前节点拐弯的路径长度 = max1 + max2
    ans = Math.max(ans, max1 + max2);
    return max1;
  }

  dfs(root);
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 158. N 叉树的直径 =====");

// 测试1:
//       1
//     / | \
//    2  3  4
//   / \
//  5   6
// 直径 = 5-2-1-3 或 5-2-1-4 或 6-2-1-3 等，长度 3
const t1 = new Node(1, [
  new Node(2, [new Node(5), new Node(6)]),
  new Node(3, []),
  new Node(4, []),
]);
console.log("测试1:", diameter(t1)); // 期望 3

// 测试2:
//       1
//      /
//     2
//    /
//   3
//  /
// 4
// 直径 = 4-3-2-1，长度 3
const t2 = new Node(1, [
  new Node(2, [
    new Node(3, [
      new Node(4, []),
    ]),
  ]),
]);
console.log("测试2:", diameter(t2)); // 期望 3

// 测试3: 单节点
console.log("测试3:", diameter(new Node(1))); // 期望 0

// 测试4:
//        1
//      / | \
//     2  3  4
//    /       \
//   5         6
//  / \
// 7   8
// 直径 = 7-5-2-1-4-6 或 8-5-2-1-4-6，长度 5
const t4 = new Node(1, [
  new Node(2, [
    new Node(5, [new Node(7), new Node(8)]),
  ]),
  new Node(3, []),
  new Node(4, [
    new Node(6),
  ]),
]);
console.log("测试4:", diameter(t4)); // 期望 5

export {};
