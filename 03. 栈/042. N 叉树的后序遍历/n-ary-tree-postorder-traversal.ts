// ============================================================
// 042. N 叉树的后序遍历
// ============================================================
// LeetCode 590. N-ary Tree Postorder Traversal
// 给定一个 n 叉树的根节点 root，返回其节点值的后序遍历。

class Node {
  val: number;
  children: Node[];
  constructor(val: number = 0, children: Node[] = []) {
    this.val = val;
    this.children = children;
  }
}

// ------------------------------------------------------------
// 方法1：迭代栈（反转法）
// ------------------------------------------------------------
// 后序：子节点（从左到右）-> 根。先做「根->子节点从右到左」再反转。
// 时间 O(n)，空间 O(n)。
function postorder(root: Node | null): number[] {
  const result: number[] = [];
  if (root === null) return result;
  const stack: Node[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(node.val);
    for (const child of node.children) stack.push(child);
  }
  result.reverse();
  return result;
}

// ------------------------------------------------------------
// 方法2：递归
// ------------------------------------------------------------
function postorderRecursive(root: Node | null): number[] {
  const result: number[] = [];
  function dfs(node: Node | null): void {
    if (node === null) return;
    for (const child of node.children) dfs(child);
    result.push(node.val);
  }
  dfs(root);
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const root = new Node(1, [
    new Node(3, [new Node(5), new Node(6)]),
    new Node(2),
    new Node(4),
  ]);
  console.log('测试1 - 迭代:', postorder(root), '期望: [5,6,3,2,4,1]');
  console.log('测试2 - 递归:', postorderRecursive(root), '期望: [5,6,3,2,4,1]');
}

test();

export {};
