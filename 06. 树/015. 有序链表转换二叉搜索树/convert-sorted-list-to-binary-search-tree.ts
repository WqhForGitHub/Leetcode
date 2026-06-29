// ============================================================
// 015. 有序链表转换二叉搜索树
// ============================================================
// LeetCode 109. Convert Sorted List to Binary Search Tree
// 给定一个单链表的头节点 head，其中的元素已经按升序排列，将其转换为高度平衡的二叉搜索树。
// 时间复杂度：O(n log n) 快慢指针 / O(n) 中序模拟，空间复杂度：O(log n) 递归栈

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val ?? 0;
    this.next = next ?? null;
  }
}

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：快慢指针找中点递归（推荐）
// 使用快慢指针找到链表中点作为根节点，递归构造左右子树
function sortedListToBST(head: ListNode | null): TreeNode | null {
  if (head === null) return null;
  // 只有一个节点
  if (head.next === null) return new TreeNode(head.val);

  // 快慢指针找中点的前一个节点
  const dummy = new ListNode(0, head);
  let slow: ListNode = dummy;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  // slow.next 是中点
  const mid = slow.next!;
  // 断开链表
  slow.next = null;

  const root = new TreeNode(mid.val);
  // 左半段从 head 到 slow
  root.left = sortedListToBST(head);
  // 右半段从 mid.next 开始
  root.right = sortedListToBST(mid.next);
  return root;
}

// 方法2：中序遍历模拟
// BST 的中序遍历就是有序链表顺序，模拟中序遍历构造树
function sortedListToBSTInorder(head: ListNode | null): TreeNode | null {
  if (head === null) return null;
  // 先统计链表长度
  let length = 0;
  let curr: ListNode | null = head;
  while (curr !== null) {
    length++;
    curr = curr.next;
  }
  // 用一个对象保存当前链表指针（模拟全局变量）
  let current: ListNode | null = head;

  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;
    const mid = Math.floor((left + right + 1) / 2);
    // 先构造左子树（中序：左根右）
    const leftChild = build(left, mid - 1);
    // 访问根节点：取当前链表节点的值
    const root = new TreeNode(current!.val);
    root.left = leftChild;
    // 链表指针后移
    current = current!.next;
    // 再构造右子树
    root.right = build(mid + 1, right);
    return root;
  }

  return build(0, length - 1);
}

// 辅助函数：从数组构造链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const num of arr) {
    curr.next = new ListNode(num);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：中序遍历
function inorderArray(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}

// 辅助函数：检查树是否平衡
function isBalanced(root: TreeNode | null): boolean {
  function check(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = check(node.left);
    const right = check(node.right);
    if (left === -1 || right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 015. 有序链表转换二叉搜索树 =====");
// 测试1: [-10,-3,0,5,9]
const list1 = arrayToList([-10, -3, 0, 5, 9]);
const tree1 = sortedListToBST(list1);
console.log("[-10,-3,0,5,9] (快慢指针) 中序:", JSON.stringify(inorderArray(tree1))); // [-10,-3,0,5,9]
console.log("是否平衡:", isBalanced(tree1)); // true

const list1b = arrayToList([-10, -3, 0, 5, 9]);
const tree1b = sortedListToBSTInorder(list1b);
console.log("[-10,-3,0,5,9] (中序模拟) 中序:", JSON.stringify(inorderArray(tree1b))); // [-10,-3,0,5,9]
console.log("是否平衡:", isBalanced(tree1b)); // true

// 测试2: 空链表
console.log("null (快慢指针):", sortedListToBST(null)); // null

// 测试3: 单节点
const list3 = arrayToList([1]);
const tree3 = sortedListToBST(list3);
console.log("[1] (快慢指针) 中序:", JSON.stringify(inorderArray(tree3))); // [1]

export {};
