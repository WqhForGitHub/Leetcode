// ============================================================
// 041. N 叉树的前序遍历
// ============================================================
// LeetCode 589. N-ary Tree Preorder Traversal
// 给定一个 n 叉树的根节点 root，返回其节点值的前序遍历。

class Node {
  val: number;
  children: Node[];
  constructor(val: number = 0, children: Node[] = []) {
    this.val = val;
    this.children = children;
  }
}

// ------------------------------------------------------------
// 方法1：迭代栈
// ------------------------------------------------------------
// 根 -> 子节点（从左到右）。入栈顺序：子节点从右到左。
// 时间 O(n)，空间 O(n)。
function preorder(root: Node | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const stack: Node[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    // 子节点从右到左入栈，保证从左到右弹出
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：递归
// ------------------------------------------------------------
function preorderRecursive(root: Node | null): number[] {
  const result: number[] = [];
  function dfs(node: Node | null): void {
    if (node === null) return;
    result.push(node.val);
    for (const child of node.children) dfs(child);
  }
  dfs(root);
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  //     1
  //   / | \
  //  3  2  4
  // / \
  //5  6
  const root = new Node(1, [
    new Node(3, [new Node(5), new Node(6)]),
    new Node(2),
    new Node(4),
  ]);
  console.log('测试1 - 迭代:', preorder(root), '期望: [1,3,5,6,2,4]');
  console.log('测试2 - 递归:', preorderRecursive(root), '期望: [1,3,5,6,2,4]');
}

test();

export {};
