// ============================================================
// 025. 反转链表
// ============================================================
// LeetCode 206. Reverse Linked List
// 给定单链表的头节点 head，反转链表并返回新的头节点。
// 时间复杂度：O(n)，空间复杂度：O(1)（迭代）/ O(n)（递归）

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode();
  let curr = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

// ============================================================
// 方法1：迭代（三指针 prev / curr / next）—— 推荐
// ============================================================
// 每次把 curr.next 指向 prev，然后三个指针整体后移一位。
// 时间复杂度 O(n)，空间复杂度 O(1)
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next: ListNode | null = curr.next; // 暂存下一个节点
    curr.next = prev; // 反转指针方向
    prev = curr; // prev 前进
    curr = next; // curr 前进
  }
  return prev; // 循环结束时 curr 为 null，prev 即为新头
}

// ============================================================
// 方法2：递归
// ============================================================
// 递归到链表末尾，回溯时让下一个节点指回当前节点。
// 时间复杂度 O(n)，空间复杂度 O(n)（递归栈）
function reverseListRecursive(head: ListNode | null): ListNode | null {
  // base case：空链表或只有一个节点
  if (head === null || head.next === null) {
    return head;
  }
  // 递归反转后面的部分，newHead 是反转后的头节点
  const newHead = reverseListRecursive(head.next);
  // head.next 此时是反转后子链表的尾节点，让它指回 head
  head.next.next = head;
  // 断开 head 原本的 next 指针，避免成环
  head.next = null;
  return newHead;
}

// 测试
console.log("===== 025. 反转链表 =====");
console.log("方法1 迭代：", listToArray(reverseList(arrayToList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
console.log("方法1 迭代：", listToArray(reverseList(arrayToList([1, 2])))); // [2,1]
console.log("方法1 迭代：", listToArray(reverseList(arrayToList([])))); // []
console.log("方法2 递归：", listToArray(reverseListRecursive(arrayToList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
console.log("方法2 递归：", listToArray(reverseListRecursive(arrayToList([])))); // []

export {};
