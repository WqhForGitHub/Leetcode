// ============================================================
// 023. 相交链表
// ============================================================
// LeetCode 160. Intersection of Two Linked Lists
// 找到两个单链表相交的起始节点。若无相交返回 null。
// 时间复杂度：O(m+n)，空间复杂度：O(1)（方法1）/ O(m)（方法2）

// 节点定义
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
  const head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
}

// 辅助函数：构建两个相交链表
// listA 和 listB 为各自独有部分，common 为公共部分
function buildIntersectLists(
  listA: number[],
  listB: number[],
  common: number[],
): { headA: ListNode | null; headB: ListNode | null } {
  const commonHead = arrayToList(common);
  const headA = arrayToList(listA);
  const headB = arrayToList(listB);

  // 将 A 的尾部接到公共部分；若 A 为空则直接用公共部分
  if (headA !== null) {
    let curr = headA;
    while (curr.next !== null) curr = curr.next;
    curr.next = commonHead;
  }
  // 将 B 的尾部接到公共部分；若 B 为空则直接用公共部分
  if (headB !== null) {
    let curr = headB;
    while (curr.next !== null) curr = curr.next;
    curr.next = commonHead;
  }
  return {
    headA: headA !== null ? headA : commonHead,
    headB: headB !== null ? headB : commonHead,
  };
}

// ============================================================
// 方法1：双指针（走完 A 走 B，走完 B 走 A，相遇即交点）（推荐）
// ============================================================
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (headA === null || headB === null) return null;

  let pA: ListNode | null = headA;
  let pB: ListNode | null = headB;

  // 两个指针分别遍历 A+B 和 B+A，若有交点则会在交点相遇
  // 若无交点，最终都会同时到达 null
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }

  return pA;
}

// ============================================================
// 方法2：哈希集合
// ============================================================
function getIntersectionNodeSet(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  const visited = new Set<ListNode>();
  let curr: ListNode | null = headA;
  // 将链表 A 的所有节点加入集合
  while (curr !== null) {
    visited.add(curr);
    curr = curr.next;
  }
  // 遍历链表 B，第一个在集合中的节点即交点
  curr = headB;
  while (curr !== null) {
    if (visited.has(curr)) {
      return curr;
    }
    curr = curr.next;
  }
  return null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 相交链表 =====");

// 测试1: listA = [4,1], listB = [5,6,1], common = [8,4,5]
const { headA: a1, headB: b1 } = buildIntersectLists([4, 1], [5, 6, 1], [8, 4, 5]);
const inter1 = getIntersectionNode(a1, b1);
console.log("测试1 (相交, 双指针):", inter1 ? inter1.val : null);
// 预期: 8

// 测试2: 哈希集合方法
const { headA: a2, headB: b2 } = buildIntersectLists([4, 1], [5, 6, 1], [8, 4, 5]);
const inter2 = getIntersectionNodeSet(a2, b2);
console.log("测试2 (相交, 哈希集合):", inter2 ? inter2.val : null);
// 预期: 8

// 测试3: 不相交 listA = [2,6,4], listB = [1,5], common = []
const { headA: a3, headB: b3 } = buildIntersectLists([2, 6, 4], [1, 5], []);
const inter3 = getIntersectionNode(a3, b3);
console.log("测试3 (不相交):", inter3 ? inter3.val : null);
// 预期: null

// 测试4: 交点就是头节点 common = [1,2,3]
const { headA: a4, headB: b4 } = buildIntersectLists([], [], [1, 2, 3]);
const inter4 = getIntersectionNode(a4, b4);
console.log("测试4 (头节点相交):", inter4 ? inter4.val : null);
// 预期: 1

export {};
