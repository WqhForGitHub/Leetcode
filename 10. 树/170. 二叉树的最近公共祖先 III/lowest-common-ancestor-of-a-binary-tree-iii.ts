// ============================================================
// 170. 二叉树的最近公共祖先 III
// ============================================================
// LeetCode 1650. Lowest Common Ancestor of a Binary Tree III
// 给定一棵二叉树中的两个节点 p 和 q（节点有 parent 指针），找到它们的最近公共祖先。
// 时间复杂度：O(h)，空间复杂度：O(h)

// 节点定义（带 parent 指针）
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  parent: Node | null;
  constructor(val?: number) {
    this.val = val ?? 0;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

// 方法1：父指针+集合（推荐）
// 从 p 向上走到根，记录所有祖先到集合
// 再从 q 向上走，第一个在集合中的节点即为 LCA
function lowestCommonAncestor(p: Node | null, q: Node | null): Node | null {
  const ancestors = new Set<Node>();
  let cur: Node | null = p;
  while (cur !== null) {
    ancestors.add(cur);
    cur = cur.parent;
  }
  cur = q;
  while (cur !== null) {
    if (ancestors.has(cur)) return cur;
    cur = cur.parent;
  }
  return null;
}

// 方法2：双指针法
// 指针 a 从 p 出发，指针 b 从 q 出发，各自向上走到根后切换到另一节点继续走
// 两者走过的路径长度相同，会在 LCA 相遇
// 原理：a 走完 p->根 后再从 q 走，b 走完 q->根 后再从 p 走，
// 两者走过的总长度 = (p到根) + (q到根) 相同，必然在 LCA 相遇
function lowestCommonAncestorTwoPointer(p: Node | null, q: Node | null): Node | null {
  let a: Node | null = p;
  let b: Node | null = q;
  while (a !== b) {
    a = a === null ? q : a.parent;
    b = b === null ? p : b.parent;
  }
  return a;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 170. 二叉树的最近公共祖先 III =====");

// 构建测试树:
//       3
//      / \
//     5   1
//    / \
//   6   2
//      / \
//     7   4
const n3 = new Node(3);
const n5 = new Node(5);
const n1 = new Node(1);
const n6 = new Node(6);
const n2 = new Node(2);
const n7 = new Node(7);
const n4 = new Node(4);
n3.left = n5;
n3.right = n1;
n5.left = n6;
n5.right = n2;
n2.left = n7;
n2.right = n4;
// 设置 parent 指针
n5.parent = n3;
n1.parent = n3;
n6.parent = n5;
n2.parent = n5;
n7.parent = n2;
n4.parent = n2;

// 测试1: p=4, q=6 -> LCA=5
console.log("测试1 集合法:", lowestCommonAncestor(n4, n6)?.val); // 5
console.log("测试1 双指针法:", lowestCommonAncestorTwoPointer(n4, n6)?.val); // 5

// 测试2: p=4, q=7 -> LCA=2
console.log("测试2 集合法:", lowestCommonAncestor(n4, n7)?.val); // 2
console.log("测试2 双指针法:", lowestCommonAncestorTwoPointer(n4, n7)?.val); // 2

// 测试3: p=5, q=1 -> LCA=3
console.log("测试3 集合法:", lowestCommonAncestor(n5, n1)?.val); // 3
console.log("测试3 双指针法:", lowestCommonAncestorTwoPointer(n5, n1)?.val); // 3

// 测试4: p=3, q=4 -> LCA=3（根节点本身）
console.log("测试4 集合法:", lowestCommonAncestor(n3, n4)?.val); // 3
console.log("测试4 双指针法:", lowestCommonAncestorTwoPointer(n3, n4)?.val); // 3

export {};
