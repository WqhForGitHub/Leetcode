// ============================================================
// 053. 二叉树中的链表
// ============================================================
// LeetCode 1367. Linked List in Binary Tree
// 判断链表是否作为一条向下路径存在于二叉树中（路径可不从根开始，但必须连续向下）。
// 时间复杂度：O(n * min(L, h))，空间复杂度：O(h)

// 链表节点
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 二叉树节点
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// 辅助函数：从某个树节点开始，尝试向下匹配整条链表
function dfs(head: ListNode | null, root: TreeNode | null): boolean {
  if (head === null) return true; // 链表匹配完毕
  if (root === null) return false; // 树先结束
  if (head.val !== root.val) return false; // 值不等
  return dfs(head.next, root.left) || dfs(head.next, root.right);
}

// 方法1：对每个树节点尝试作为链表起点
// 递归：从 root 开始匹配，或在左右子树中继续寻找起点
function isSubPath(head: ListNode | null, root: TreeNode | null): boolean {
  if (head === null) return true;
  if (root === null) return false;
  return dfs(head, root) || isSubPath(head, root.left) || isSubPath(head, root.right);
}

// 测试
(function test() {
  // 树:
  //        1
  //       / \
  //      4   4
  //       \  /
  //       2 2
  //      /
  //     1
  const root = new TreeNode(1);
  root.left = new TreeNode(4);
  root.right = new TreeNode(4);
  root.left.right = new TreeNode(2);
  root.right.left = new TreeNode(2);
  root.left.right.left = new TreeNode(1);
  console.log(isSubPath(arrayToList([4, 2, 1]), root)); // true
  console.log(isSubPath(arrayToList([4, 1]), root)); // false
  console.log(isSubPath(arrayToList([1, 4, 2, 1]), root)); // true
})();

export {};
