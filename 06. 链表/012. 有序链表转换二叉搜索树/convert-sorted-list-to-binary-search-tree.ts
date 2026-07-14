// ============================================================
// 012. 有序链表转换二叉搜索树
// ============================================================
// LeetCode 109. Convert Sorted List to Binary Search Tree
// 给定一个单链表的头节点 head，其中的元素已经按升序排列，
// 将其转换为高度平衡的二叉搜索树。本题中，一个高度平衡二叉树是指
// 一个二叉树每个节点的左右两个子树的高度差的绝对值不超过 1。
// 时间复杂度：O(n log n)，空间复杂度：O(log n) 递归栈

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

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// 辅助函数：前序遍历二叉树转数组（用于验证结果）
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  // 去掉末尾多余的 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 方法1：快慢指针找中点作为根（推荐）
// 用快慢指针找到链表中点作为根节点，递归构建左右子树
function sortedListToBST(head: ListNode | null): TreeNode | null {
  return buildBST(head, null);
}

// 构建平衡 BST，区间为 [head, tail)
function buildBST(head: ListNode | null, tail: ListNode | null): TreeNode | null {
  if (head === tail) return null;

  // 快慢指针找中点
  let slow: ListNode = head!;
  let fast: ListNode = head!;
  while (fast !== tail && fast.next !== null && fast.next !== tail) {
    slow = slow.next!;
    fast = fast.next.next!;
  }

  // slow 即为中点，作为根节点
  const root = new TreeNode(slow.val);
  root.left = buildBST(head, slow);
  root.right = buildBST(slow.next, tail);

  return root;
}

// 方法2：转数组 + 递归分治
// 先将链表转为数组，再用分治法构建平衡 BST
function sortedListToBST2(head: ListNode | null): TreeNode | null {
  const arr: number[] = [];
  let cur = head;
  while (cur !== null) {
    arr.push(cur.val);
    cur = cur.next;
  }

  // 分治法构建 BST
  function build(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);
    const root = new TreeNode(arr[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }

  return build(0, arr.length - 1);
}

// 方法3：中序遍历模拟法
// 利用 BST 中序遍历结果与有序链表一致的性质，模拟中序遍历构建
function sortedListToBST3(head: ListNode | null): TreeNode | null {
  // 计算链表长度
  let n = 0;
  let cur = head;
  while (cur !== null) {
    n++;
    cur = cur.next;
  }

  // 用全局指针模拟中序遍历
  let current = head;

  function inorderBuild(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);

    // 先递归构建左子树
    const leftChild = inorderBuild(left, mid - 1);

    // 处理当前节点
    const root = new TreeNode(current!.val);
    root.left = leftChild;
    current = current!.next;

    // 再递归构建右子树
    root.right = inorderBuild(mid + 1, right);

    return root;
  }

  return inorderBuild(0, n - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 012. 有序链表转换二叉搜索树 =====");
// [-10,-3,0,5,9] => [0,-3,9,-10,null,5]
console.log("结果:", treeToArray(sortedListToBST(arrayToList([-10, -3, 0, 5, 9]))));
// [] => []
console.log("结果:", treeToArray(sortedListToBST(arrayToList([]))));
// [1] => [1]
console.log("结果:", treeToArray(sortedListToBST(arrayToList([1]))));

export {};
