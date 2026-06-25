// ============================================================
// 098. 训练计划 III
// ============================================================
// 剑指 Offer 24. 反转链表
// 定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。
// 时间复杂度：O(n)，空间复杂度：O(1)（迭代）/ O(n)（递归）

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
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

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const res: number[] = [];
  let cur = head;
  while (cur !== null) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

// ============================================================
// 方法一：迭代法
// ============================================================
// 使用三个指针 prev、cur、next，逐个翻转每个节点的 next 指向。
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur: ListNode | null = head;

  while (cur !== null) {
    const next: ListNode | null = cur.next; // 暂存后继
    cur.next = prev; // 翻转指向
    prev = cur; // prev 前进
    cur = next; // cur 前进
  }

  return prev; // prev 即为新头节点
}

// ============================================================
// 方法二：递归法
// ============================================================
// 递归到链表末尾，回溯时将后继节点指向当前节点，当前节点 next 置空。
function reverseListRecursive(head: ListNode | null): ListNode | null {
  // 递归终止：空节点或单节点
  if (head === null || head.next === null) {
    return head;
  }
  // 递归反转后面的部分，newHead 是反转后的头节点
  const newHead = reverseListRecursive(head.next);
  // 回溯时翻转指向：head.next 此时是反转后子链表的尾节点
  head.next.next = head;
  head.next = null;
  return newHead;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,3,4,5] -> [5,4,3,2,1]
  console.log("测试1（迭代）:", listToArray(reverseList(arrayToList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
  console.log("测试1（递归）:", listToArray(reverseListRecursive(arrayToList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]

  // 测试用例 2: 单节点 [1] -> [1]
  console.log("测试2:", listToArray(reverseList(arrayToList([1])))); // [1]

  // 测试用例 3: 空链表
  console.log("测试3:", listToArray(reverseList(arrayToList([])))); // []

  // 测试用例 4: 两个节点
  console.log("测试4:", listToArray(reverseList(arrayToList([1, 2])))); // [2,1]
}

test();

export {};
