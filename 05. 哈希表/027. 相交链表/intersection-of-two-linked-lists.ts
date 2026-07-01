// ============================================================
// 027. 相交链表
// ============================================================
// LeetCode 160. Intersection of Two Linked Lists
// 找到两个单链表相交的起始节点。使用哈希集合方法。
// 时间复杂度：O(m + n)，空间复杂度：O(m)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  // 哈希集合记录链表 A 的所有节点引用
  const visited: Set<ListNode> = new Set();
  let cur: ListNode | null = headA;
  while (cur !== null) {
    visited.add(cur);
    cur = cur.next;
  }
  // 遍历链表 B，第一个在集合中出现的节点即为交点
  cur = headB;
  while (cur !== null) {
    if (visited.has(cur)) {
      return cur;
    }
    cur = cur.next;
  }
  // 无交点
  return null;
}

// 辅助函数：构造两个相交链表
// listA: 共享部分之前的节点；listB: 共享部分之前的节点；common: 共享部分
function buildIntersectLists(
  arrA: number[],
  arrB: number[],
  common: number[],
): { headA: ListNode | null; headB: ListNode | null } {
  // 构造共享部分
  let commonHead: ListNode | null = null;
  if (common.length > 0) {
    commonHead = new ListNode(common[0]);
    let cur: ListNode | null = commonHead;
    for (let i = 1; i < common.length; i++) {
      cur!.next = new ListNode(common[i]);
      cur = cur!.next;
    }
  }
  // 构造 A 链表
  let headA: ListNode | null;
  if (arrA.length > 0) {
    headA = new ListNode(arrA[0]);
    let cur: ListNode | null = headA;
    for (let i = 1; i < arrA.length; i++) {
      cur!.next = new ListNode(arrA[i]);
      cur = cur!.next;
    }
    cur!.next = commonHead;
  } else {
    headA = commonHead;
  }
  // 构造 B 链表
  let headB: ListNode | null;
  if (arrB.length > 0) {
    headB = new ListNode(arrB[0]);
    let cur: ListNode | null = headB;
    for (let i = 1; i < arrB.length; i++) {
      cur!.next = new ListNode(arrB[i]);
      cur = cur!.next;
    }
    cur!.next = commonHead;
  } else {
    headB = commonHead;
  }
  return { headA, headB };
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 相交链表 =====");
// A: 4 -> 1 -> 8 -> 4 -> 5
// B: 5 -> 6 -> 1 -> 8 -> 4 -> 5   (交点为 8)
const t1 = buildIntersectLists([4, 1], [5, 6, 1], [8, 4, 5]);
const r1 = getIntersectionNode(t1.headA, t1.headB);
console.log(r1 ? r1.val : null); // 8
// A: 1 -> 9 -> 1 -> 2 -> 4
// B: 3 -> 2 -> 4   (交点为 2)
const t2 = buildIntersectLists([1, 9, 1], [3], [2, 4]);
const r2 = getIntersectionNode(t2.headA, t2.headB);
console.log(r2 ? r2.val : null); // 2
// A: 2 -> 6 -> 4
// B: 1 -> 5   (无交点)
const t3 = buildIntersectLists([2, 6, 4], [1, 5], []);
const r3 = getIntersectionNode(t3.headA, t3.headB);
console.log(r3 ? r3.val : null); // null

export {};
