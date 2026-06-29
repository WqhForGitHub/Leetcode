// ============================================================
// 075. N 叉树的后序遍历
// ============================================================
// LeetCode 590. N-ary Tree Postorder Traversal
// 给定一个 n 叉树的根节点 root，返回其节点值的后序遍历。
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
// 后序: 依次遍历各子树 -> 根
function postorder(root: Node | null): number[] {
  const result: number[] = [];
  function dfs(node: Node | null): void {
    if (node === null) return;
    for (const child of node.children) {
      dfs(child);
    }
    result.push(node.val);
  }
  dfs(root);
  return result;
}

// 方法2：迭代栈
// 类似前序但根先入结果，最后反转（根-右到左子树 => 反转 => 左到右子树-根）
function postorderIterative(root: Node | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const stack: Node[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    // 子节点正序入栈，使最左孩子最后被处理（出栈时先处理右孩子）
    for (const child of node.children) {
      stack.push(child);
    }
  }
  // 反转结果得到后序
  result.reverse();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. N 叉树的后序遍历 =====");
// N叉树:
//        1
//      / | \
//     3  2  4
//    / \
//   5   6
// 后序: [5,6,3,2,4,1]
const tree1 = new Node(1);
tree1.children = [new Node(3), new Node(2), new Node(4)];
tree1.children[0].children = [new Node(5), new Node(6)];
console.log("递归 [5,6,3,2,4,1]:", postorder(tree1)); // [5,6,3,2,4,1]
console.log("迭代 [5,6,3,2,4,1]:", postorderIterative(tree1)); // [5,6,3,2,4,1]

// 空树
console.log("递归 空树:", postorder(null)); // []
console.log("迭代 空树:", postorderIterative(null)); // []

// 单节点
const single = new Node(1);
console.log("递归 单节点:", postorder(single)); // [1]
console.log("迭代 单节点:", postorderIterative(single)); // [1]

// 深层树
//     1
//    /
//   2
//  / \
// 3   4
// 后序: [3,4,2,1]
const tree2 = new Node(1);
tree2.children = [new Node(2)];
tree2.children[0].children = [new Node(3), new Node(4)];
console.log("递归 深层:", postorder(tree2)); // [3,4,2,1]
console.log("迭代 深层:", postorderIterative(tree2)); // [3,4,2,1]

export {};
