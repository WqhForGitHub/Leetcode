// ============================================================
// 014. 二叉搜索树迭代器
// ============================================================
// LeetCode 173. Binary Search Tree Iterator
// 实现一个二叉搜索树迭代器 BSTIterator，按升序遍历。

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ------------------------------------------------------------
// 方法1：栈（模拟中序遍历）
// ------------------------------------------------------------
// 构造时一路向左压栈；next 时弹出栈顶（最小），并对其右子树一路向左压栈。
// hasNext：栈非空。平均 next O(1)，空间 O(h)。
class BSTIterator {
  private stack: TreeNode[] = [];

  constructor(root: TreeNode | null) {
    this.pushLeft(root);
  }

  private pushLeft(node: TreeNode | null): void {
    while (node !== null) {
      this.stack.push(node);
      node = node.left;
    }
  }

  next(): number {
    const node = this.stack.pop()!;
    this.pushLeft(node.right);
    return node.val;
  }

  hasNext(): boolean {
    return this.stack.length > 0;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  //     7
  //    / \
  //   3   15
  //  /   / \
  // 9   6  20(示意，简化)
  const root = new TreeNode(7, new TreeNode(3), new TreeNode(15, new TreeNode(9), new TreeNode(20)));
  const it = new BSTIterator(root);
  const result: number[] = [];
  while (it.hasNext()) {
    result.push(it.next());
  }
  console.log('测试1:', result, '期望: [3,7,9,15,20]');
}

test();

export {};
