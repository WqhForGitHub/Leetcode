// ============================================================
// 086. 反转链表
// ============================================================
// LeetCode 206. Reverse Linked List
// 给你单链表的头节点 head，请你反转链表，并返回反转后的链表。
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

// 辅助函数：由数组构建链表
function buildList(arr: number[]): ListNode | null {
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
  const arr: number[] = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  return arr;
}

// ------------------------------------------------------------
// 方法1：迭代法（三指针 prev / curr / next）
// ------------------------------------------------------------
// 使用 prev 指向已反转部分的头，curr 指向当前待处理节点，next 暂存下一节点。
// 每次将 curr.next 指向 prev，然后三个指针整体后移。
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;

  while (curr !== null) {
    const next: ListNode | null = curr.next; // 暂存下一节点
    curr.next = prev; // 反转指针方向
    prev = curr; // prev 前进
    curr = next; // curr 前进
  }

  // prev 即为新的头节点
  return prev;
}

// ------------------------------------------------------------
// 方法2：递归法
// ------------------------------------------------------------
// 递归到链表末尾，回溯时将后继节点的 next 指向当前节点，当前节点 next 置空。
// 递归返回的是反转后链表的头节点（原链表的尾节点）。
function reverseListRecursive(head: ListNode | null): ListNode | null {
  // 边界：空链表或只有一个节点
  if (head === null || head.next === null) {
    return head;
  }

  // 递归反转后面的部分，newHead 是反转后的头节点
  const newHead = reverseListRecursive(head.next);

  // 回溯时：head.next 此时是反转后子链表的尾节点
  // 让它指向 head，实现反转
  head.next.next = head;
  // head 的 next 置空，避免成环
  head.next = null;

  return newHead;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：正常链表
  const list1 = buildList([1, 2, 3, 4, 5]);
  console.log("测试1 - 迭代法:");
  console.log("  原链表:", listToArray(list1));
  const reversed1 = reverseList(list1);
  console.log("  反转后:", listToArray(reversed1));
  console.log("  期望:  [5, 4, 3, 2, 1]");

  // 测试2：递归法
  const list2 = buildList([1, 2, 3, 4, 5]);
  console.log("测试2 - 递归法:");
  console.log("  原链表:", listToArray(list2));
  const reversed2 = reverseListRecursive(list2);
  console.log("  反转后:", listToArray(reversed2));
  console.log("  期望:  [5, 4, 3, 2, 1]");

  // 测试3：空链表
  const list3 = buildList([]);
  console.log("测试3 - 空链表:");
  console.log("  反转后:", listToArray(reverseList(list3)));
  console.log("  期望:  []");

  // 测试4：单节点
  const list4 = buildList([42]);
  console.log("测试4 - 单节点:");
  console.log("  反转后:", listToArray(reverseList(list4)));
  console.log("  期望:  [42]");
}

test();

export {};
