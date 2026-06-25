// ============================================================
// 102. 训练计划 V
// ============================================================
// 剑指 Offer 52. 两个链表的第一个公共节点
// 输入两个链表，找出它们的第一个公共节点。
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

// 辅助函数：构建两个相交链表
// listA, listB 为各自独有部分，common 为公共部分
function buildIntersection(
  listA: number[],
  listB: number[],
  common: number[]
): { headA: ListNode | null; headB: ListNode | null } {
  if (common.length === 0) {
    return { headA: arrayToList(listA), headB: arrayToList(listB) };
  }
  // 公共部分
  const commonHead = arrayToList(common)!;
  // A 的独有部分指向公共部分
  const headA = arrayToList(listA);
  if (headA === null) {
    return { headA: commonHead, headB: attachTail(arrayToList(listB), commonHead) };
  }
  let tailA = headA;
  while (tailA.next !== null) tailA = tailA.next;
  tailA.next = commonHead;
  // B 的独有部分指向公共部分
  const headB = attachTail(arrayToList(listB), commonHead);
  return { headA, headB };
}

// 将 tail 节点连到 common 上
function attachTail(head: ListNode | null, common: ListNode): ListNode {
  if (head === null) return common;
  let cur = head;
  while (cur.next !== null) cur = cur.next;
  cur.next = common;
  return head;
}

// ============================================================
// 方法一：双指针（走完自己的再走对方的）
// ============================================================
// 指针 pA 走完 A 后走向 B，指针 pB 赋完 B 后走向 A。
// 若两链表相交，则两指针走过的总路程相同，必在交点相遇；
// 若不相交，两指针最终都会同时为 null。
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (headA === null || headB === null) return null;

  let pA: ListNode | null = headA;
  let pB: ListNode | null = headB;

  // 两指针相遇或同时为 null 时退出
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }

  return pA;
}

// ============================================================
// 方法二：计算长度差后对齐
// ============================================================
// 分别求出两链表长度，让较长的先走差值步，再同步前进比较。
function getIntersectionNodeByLength(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  // 求长度
  let lenA = 0;
  let lenB = 0;
  let curA = headA;
  let curB = headB;
  while (curA !== null) {
    lenA++;
    curA = curA.next;
  }
  while (curB !== null) {
    lenB++;
    curB = curB.next;
  }

  // 让长的先走差值步
  curA = headA;
  curB = headB;
  const diff = Math.abs(lenA - lenB);
  if (lenA > lenB) {
    for (let i = 0; i < diff; i++) curA = curA!.next;
  } else {
    for (let i = 0; i < diff; i++) curB = curB!.next;
  }

  // 同步前进
  while (curA !== null && curB !== null) {
    if (curA === curB) return curA;
    curA = curA.next;
    curB = curB.next;
  }

  return null;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: A=[4,1], B=[5,0,1], common=[8,4,5]
  const { headA, headB } = buildIntersection([4, 1], [5, 0, 1], [8, 4, 5]);
  const res1 = getIntersectionNode(headA, headB);
  console.log("测试1（双指针）:", res1 ? res1.val : null); // 8
  const { headA: a2, headB: b2 } = buildIntersection([4, 1], [5, 0, 1], [8, 4, 5]);
  const res1b = getIntersectionNodeByLength(a2, b2);
  console.log("测试1（长度差）:", res1b ? res1b.val : null); // 8

  // 测试用例 2: 不相交 A=[2,6,4], B=[1,5]
  const { headA: a3, headB: b3 } = buildIntersection([2, 6, 4], [1, 5], []);
  console.log("测试2:", getIntersectionNode(a3, b3)); // null

  // 测试用例 3: A=[1,9,1], B=[3], common=[2,4]
  const { headA: a4, headB: b4 } = buildIntersection([1, 9, 1], [3], [2, 4]);
  const res3 = getIntersectionNode(a4, b4);
  console.log("测试3:", res3 ? res3.val : null); // 2

  // 测试用例 4: 一个为空
  console.log("测试4:", getIntersectionNode(null, arrayToList([1, 2]))); // null
}

test();

export {};
