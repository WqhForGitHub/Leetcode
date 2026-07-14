// ============================================================
// 088. 重排链表
// ============================================================
// LeetCode 143. Reorder List
// 给定单链表 L：L0 -> L1 -> ... -> Ln-1 -> Ln
// 重新排列为：L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
// 不能只是改变节点内部的值，必须实际修改节点的 next 指针。
// 时间复杂度：O(n)，空间复杂度：O(1)

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
// 方法1：三步法（找中点 -> 反转后半 -> 交错合并）
// ------------------------------------------------------------
// 第一步：快慢指针找到链表中点。
// 第二步：反转中点之后的后半部分链表。
// 第三步：将前半部分与反转后的后半部分交错合并。
function reorderList(head: ListNode | null): void {
  if (head === null || head.next === null) return;

  // 第一步：快慢指针找中点（slow 停在前半部分最后一个节点）
  let slow: ListNode = head;
  let fast: ListNode = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 第二步：反转后半部分（从 slow.next 开始）
  const secondHalf = reverseList(slow.next);
  slow.next = null; // 断开前后两部分

  // 第三步：交错合并前半部分 head 与反转后的后半部分 secondHalf
  let first: ListNode | null = head;
  let second: ListNode | null = secondHalf;
  while (second !== null) {
    const nextFirst: ListNode | null = first!.next;
    const nextSecond: ListNode | null = second.next;

    first!.next = second; // 前半节点指向后半节点
    second.next = nextFirst; // 后半节点指向下一个前半节点

    first = nextFirst;
    second = nextSecond;
  }
}

// 反转链表辅助函数
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// ------------------------------------------------------------
// 方法2：线性表辅助法（用数组存储节点后按序重连）
// ------------------------------------------------------------
// 将所有节点存入数组，然后用双指针从两端向中间交错连接。
// 时间复杂度：O(n)，空间复杂度：O(n)
function reorderListArray(head: ListNode | null): void {
  if (head === null) return;

  const nodes: ListNode[] = [];
  let cur: ListNode | null = head;
  while (cur !== null) {
    nodes.push(cur);
    cur = cur.next;
  }

  let i = 0;
  let j = nodes.length - 1;
  while (i < j) {
    nodes[i].next = nodes[j];
    i++;
    if (i >= j) break;
    nodes[j].next = nodes[i];
    j--;
  }
  // 最后一个节点的 next 置空
  nodes[i].next = null;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：[1,2,3,4] -> [1,4,2,3]
  const list1 = buildList([1, 2, 3, 4]);
  console.log("测试1 - 三步法:");
  console.log("  原链表:", listToArray(list1));
  reorderList(list1);
  console.log("  重排后:", listToArray(list1));
  console.log("  期望:  [1, 4, 2, 3]");

  // 测试2：[1,2,3,4,5] -> [1,5,2,4,3]
  const list2 = buildList([1, 2, 3, 4, 5]);
  console.log("测试2 - 线性表法:");
  console.log("  原链表:", listToArray(list2));
  reorderListArray(list2);
  console.log("  重排后:", listToArray(list2));
  console.log("  期望:  [1, 5, 2, 4, 3]");

  // 测试3：单节点
  const list3 = buildList([1]);
  console.log("测试3 - 单节点:");
  reorderList(list3);
  console.log("  重排后:", listToArray(list3));
  console.log("  期望:  [1]");

  // 测试4：两节点 [1,2] -> [1,2]
  const list4 = buildList([1, 2]);
  console.log("测试4 - 两节点:");
  reorderListArray(list4);
  console.log("  重排后:", listToArray(list4));
  console.log("  期望:  [1, 2]");

  // 测试5：[1,2,3,4,5,6] -> [1,6,2,5,3,4]
  const list5 = buildList([1, 2, 3, 4, 5, 6]);
  console.log("测试5 - 三步法:");
  console.log("  原链表:", listToArray(list5));
  reorderList(list5);
  console.log("  重排后:", listToArray(list5));
  console.log("  期望:  [1, 6, 2, 5, 3, 4]");
}

test();

export {};
