// ============================================================
// 007. 有序链表转换二叉搜索树
// ============================================================
// LeetCode 109. Convert Sorted List to Binary Search Tree
// 给定一个单链表的头节点 head，其中的元素已经按升序排列，
// 将其转换为高度平衡的二叉搜索树。
// 时间复杂度：O(n log n), 空间复杂度：O(log n)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 二叉树节点定义
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

// 方法1：分治 - 快慢指针找中点（推荐）
// 用快慢指针找到链表中点作为根，断开左半部分，递归构建左右子树
// 时间复杂度 O(n log n)，空间复杂度 O(log n)（递归栈）
function sortedListToBST(head: ListNode | null): TreeNode | null {
  if (head === null) return null;
  if (head.next === null) return new TreeNode(head.val);

  // 快慢指针找中点的前一个节点（便于断开链表）
  let prev: ListNode | null = null;
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    prev = slow;
    // 循环内 fast 和 fast.next 都非空，说明 slow.next 必非空
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 断开左半部分
  if (prev !== null) prev.next = null;
  const midNode: ListNode = slow;

  // 中点作为根
  const root: TreeNode = new TreeNode(midNode.val);
  // 左子树从头节点到 prev
  root.left = sortedListToBST(head === midNode ? null : head);
  // 右子树从中点下一个开始
  root.right = sortedListToBST(midNode.next);

  return root;
}

// 方法2：先转数组再分治
// 将链表转为数组，再用数组中点分治构建 BST
// 时间复杂度 O(n)，空间复杂度 O(n)
function sortedListToBSTArray(head: ListNode | null): TreeNode | null {
  const arr: number[] = [];
  let curr: ListNode | null = head;
  while (curr !== null) {
    arr.push(curr.val);
    curr = curr.next;
  }

  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    const mid: number = left + Math.floor((right - left) / 2);
    const root: TreeNode = new TreeNode(arr[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }

  return build(0, arr.length - 1);
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy: ListNode = new ListNode(0);
  let curr: ListNode = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：中序遍历（BST 中序应为升序）
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function traverse(node: TreeNode | null): void {
    if (node === null) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}

// 辅助函数：计算树高
function treeHeight(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 有序链表转换二叉搜索树 =====");
const tree1: TreeNode | null = sortedListToBST(arrayToList([-10, -3, 0, 5, 9]));
console.log(inorderTraversal(tree1)); // 期望结果: [-10, -3, 0, 5, 9]（升序）
console.log("根节点值:", tree1!.val); // 期望结果: 0
console.log("左子树高:", treeHeight(tree1!.left)); // 期望结果: 2
console.log("右子树高:", treeHeight(tree1!.right)); // 期望结果: 2

const tree2: TreeNode | null = sortedListToBST(arrayToList([]));
console.log(tree2); // 期望结果: null

console.log("--- 方法2测试 ---");
const tree3: TreeNode | null = sortedListToBSTArray(arrayToList([-10, -3, 0, 5, 9]));
console.log(inorderTraversal(tree3)); // 期望结果: [-10, -3, 0, 5, 9]
console.log("根节点值:", tree3!.val); // 期望结果: 0

export {};
