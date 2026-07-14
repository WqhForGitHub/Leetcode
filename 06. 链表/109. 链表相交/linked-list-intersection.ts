// ============================================================
// 109. 链表相交
// ============================================================
// LeetCode 160 / 面试题 02.07. 链表相交
// 给定两个单链表的头节点 headA 和 headB，找出并返回两个单链表相交的起始节点。
// 如果两个链表没有交点，返回 null。整个链式结构中不存在环。
// 时间复杂度：O(m + n)，空间复杂度：O(1)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：用数组构建链表
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

// 辅助函数：让链表 tailA 的末尾指向 intersect 节点，构造相交结构
function makeIntersection(
  listA: ListNode | null,
  listB: ListNode | null,
  skipA: number,
  skipB: number,
): { headA: ListNode | null; headB: ListNode | null } {
  // 找到 listA 的第 skipA 个节点（即相交节点前一个）
  let curA = listA;
  for (let i = 0; i < skipA - 1 && curA; i++) {
    curA = curA.next;
  }
  // 找到 listB 的末尾
  let curB = listB;
  while (curB && curB.next) {
    curB = curB.next;
  }
  // 让 listB 末尾连接到 listA 的第 skipA 个节点
  const intersectNode = curA ? curA.next : null;
  if (curB) {
    curB.next = intersectNode;
  }
  return { headA: listA, headB: listB };
}

// 辅助函数：将链表转为数组（便于打印）
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let cur = head;
  while (cur) {
    result.push(cur.val);
    cur = cur.next;
  }
  return result;
}

// ============================================================
// 方法1：双指针法
// ============================================================
// 指针 pA 从 headA 出发，走完 A 后走向 headB；
// 指针 pB 从 headB 出发，走完 B 后走向 headA。
// 若两链表相交，则两指针在交点相遇；若不相交，则两指针最终都为 null。
// 原理：两指针走过的总长度均为 a + c + b（相交）或 a + b（不相交）。
// 时间复杂度：O(m + n)，空间复杂度：O(1)
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (headA === null || headB === null) return null;

  let pA: ListNode | null = headA;
  let pB: ListNode | null = headB;

  // 当两指针不相等时继续遍历
  // 若走到末尾(null)，则切换到另一个链表的头节点
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }

  // 返回相交节点，或 null（不相交）
  return pA;
}

// ============================================================
// 方法2：计算长度差对齐后同步遍历
// ============================================================
// 先分别计算两个链表的长度，算出长度差 d。
// 让较长的链表先走 d 步，然后两个链表同步遍历，第一个相同的节点即为交点。
// 时间复杂度：O(m + n)，空间复杂度：O(1)
function getIntersectionNodeByLength(
  headA: ListNode | null,
  headB: ListNode | null,
): ListNode | null {
  if (headA === null || headB === null) return null;

  // 计算链表长度
  const getLength = (head: ListNode | null): number => {
    let len = 0;
    let cur = head;
    while (cur) {
      len++;
      cur = cur.next;
    }
    return len;
  };

  const lenA = getLength(headA);
  const lenB = getLength(headB);

  let curA: ListNode | null = headA;
  let curB: ListNode | null = headB;

  // 让较长的链表先走 |lenA - lenB| 步
  const diff = Math.abs(lenA - lenB);
  if (lenA > lenB) {
    for (let i = 0; i < diff; i++) {
      curA = curA!.next;
    }
  } else {
    for (let i = 0; i < diff; i++) {
      curB = curB!.next;
    }
  }

  // 同步遍历，找到第一个相同节点
  while (curA !== null && curB !== null) {
    if (curA === curB) {
      return curA;
    }
    curA = curA.next;
    curB = curB.next;
  }

  return null;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  console.log("===== 109. 链表相交 测试 =====\n");

  // 测试1：两链表在节点 8 相交
  // listA: 4 -> 1 -> 8 -> 4 -> 5
  // listB: 5 -> 6 -> 1 -> 8 -> 4 -> 5
  // 相交节点值为 8
  const commonPart = buildList([8, 4, 5]);
  const headA1 = new ListNode(4, new ListNode(1, commonPart));
  const headB1 = new ListNode(5, new ListNode(6, new ListNode(1, commonPart)));

  const result1 = getIntersectionNode(headA1, headB1);
  const result1b = getIntersectionNodeByLength(headA1, headB1);
  console.log("测试1 - 相交节点值:");
  console.log("  方法1(双指针):", result1 ? result1.val : null);
  console.log("  方法2(长度差):", result1b ? result1b.val : null);
  console.log("  期望: 8\n");

  // 测试2：两链表不相交
  // listA: 2 -> 6 -> 4
  // listB: 1 -> 5
  const headA2 = buildList([2, 6, 4]);
  const headB2 = buildList([1, 5]);

  const result2 = getIntersectionNode(headA2, headB2);
  const result2b = getIntersectionNodeByLength(headA2, headB2);
  console.log("测试2 - 不相交:");
  console.log("  方法1(双指针):", result2 ? result2.val : null);
  console.log("  方法2(长度差):", result2b ? result2b.val : null);
  console.log("  期望: null\n");

  // 测试3：在头节点相交
  // listA: 1 -> 2 -> 3
  // listB: 1 -> 2 -> 3 (相同头节点)
  const commonHead = buildList([1, 2, 3]);
  const result3 = getIntersectionNode(commonHead, commonHead);
  const result3b = getIntersectionNodeByLength(commonHead, commonHead);
  console.log("测试3 - 头节点相交:");
  console.log("  方法1(双指针):", result3 ? result3.val : null);
  console.log("  方法2(长度差):", result3b ? result3b.val : null);
  console.log("  期望: 1\n");
}

test();

export {};
