// ============================================================
// 074. N 叉树的前序遍历
// ============================================================
// LeetCode 589. N-ary Tree Preorder Traversal
// 给定一个 n 叉树的根节点 root，返回其节点值的前序遍历。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Node {
  val: number;
  children: Node[];
  constructor(val?: number, children?: Node[]) {
    this.val = val ?? 0;
    this.children = children ?? [];
  }
}

// 方法1：递归（推荐）
// 前序: 根 -> 依次遍历各子树
function preorder(root: Node | null): number[] {
  const result: number[] = [];
  function dfs(node: Node | null): void {
    if (node === null) return;
    result.push(node.val);
    for (const child of node.children) {
      dfs(child);
    }
  }
  dfs(root);
  return result;
}

// 方法2：迭代栈
// 使用栈模拟，子节点需逆序入栈以保证从左到右访问
function preorderIterative(root: Node | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const stack: Node[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    // 子节点逆序入栈，使最左孩子先被访问
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. N 叉树的前序遍历 =====");
// N叉树:
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
// 前序: [1,3,5,6,2,4]
const tree1 = new Node(1);
tree1.children = [new Node(3), new Node(2), new Node(4)];
tree1.children[0].children = [new Node(5), new Node(6)];
console.log("递归 [1,3,5,6,2,4]:", preorder(tree1)); // [1,3,5,6,2,4]
console.log("迭代 [1,3,5,6,2,4]:", preorderIterative(tree1)); // [1,3,5,6,2,4]

// 空树
console.log("递归 空树:", preorder(null)); // []
console.log("迭代 空树:", preorderIterative(null)); // []

// 单节点
const single = new Node(1);
console.log("递归 单节点:", preorder(single)); // [1]
console.log("迭代 单节点:", preorderIterative(single)); // [1]

// 深层树
//     1
//    /
//   2
//  / \
// 3   4
const tree2 = new Node(1);
tree2.children = [new Node(2)];
tree2.children[0].children = [new Node(3), new Node(4)];
console.log("递归 深层:", preorder(tree2)); // [1,2,3,4]
console.log("迭代 深层:", preorderIterative(tree2)); // [1,2,3,4]

export {};
