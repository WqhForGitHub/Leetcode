// ============================================================
// 008. 二叉树展开为链表
// ============================================================
// LeetCode 114. Flatten Binary Tree to Linked List
// 给你二叉树的根结点 root，将它展开为一个单链表（右子树串联，类似先序遍历顺序）。

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
// 方法1：栈（先序遍历原地展开）
// ------------------------------------------------------------
// 用栈做先序遍历，依次把节点串到右指针。
// 时间 O(n)，空间 O(n)。
function flatten(root: TreeNode | null): void {
  if (root === null) return;
  const stack: TreeNode[] = [root];
  let prev: TreeNode | null = null;
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (prev !== null) {
      prev.right = node;
      prev.left = null;
    }
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
    prev = node;
  }
}

// ------------------------------------------------------------
// 方法2：原地反向（O(1) 空间）
// ------------------------------------------------------------
// 利用先序前驱关系：把当前左子树最右节点接到当前右子树前。
// 时间 O(n)，空间 O(1)。
function flattenO1(root: TreeNode | null): void {
  let cur = root;
  while (cur !== null) {
    if (cur.left !== null) {
      let prev = cur.left;
      while (prev.right !== null) prev = prev.right;
      prev.right = cur.right;
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  //     1
  //    / \
  //   2   5
  //  / \   \
  // 3   4   6
  const root = new TreeNode(
    1,
    new TreeNode(2, new TreeNode(3), new TreeNode(4)),
    new TreeNode(5, null, new TreeNode(6)),
  );
  flatten(root);
  const result: number[] = [];
  let cur: TreeNode | null = root;
  while (cur) {
    result.push(cur.val);
    cur = cur.right;
  }
  console.log("测试1 - 栈法:", result, "期望: [1,2,3,4,5,6]");

  const root2 = new TreeNode(
    1,
    new TreeNode(2, new TreeNode(3), new TreeNode(4)),
    new TreeNode(5, null, new TreeNode(6)),
  );
  flattenO1(root2);
  const result2: number[] = [];
  let cur2: TreeNode | null = root2;
  while (cur2) {
    result2.push(cur2.val);
    cur2 = cur2.right;
  }
  console.log("测试2 - 原地:", result2, "期望: [1,2,3,4,5,6]");
}

test();

export {};
