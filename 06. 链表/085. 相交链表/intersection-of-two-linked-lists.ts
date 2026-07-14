// ============================================================
// 085. 相交链表
// ============================================================
// LeetCode 160. Intersection of Two Linked Lists
// 给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表相交的起始节点。
// 如果两个链表不存在相交节点，返回 null。
// 时间复杂度：O(m + n)，空间复杂度：O(1)（方法1）/ O(m)（方法2）

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

// 辅助函数：构造相交链表
// 传入两条链表和相交位置（在 listA 中的索引与 listB 中的索引），让其从该节点开始共享尾部
function buildIntersection(
  arrA: number[],
  arrB: number[],
  skipA: number,
  skipB: number,
): { headA: ListNode | null; headB: ListNode | null } {
  if (skipA >= arrA.length || skipB >= arrB.length) {
    // 不相交
    return { headA: buildList(arrA), headB: buildList(arrB) };
  }
  // 先构建相交部分（共享尾部）
  const tailPart: ListNode[] = [];
  for (let i = arrA.length - 1; i >= skipA; i--) {
    tailPart.unshift(new ListNode(arrA[i]));
  }
  for (let i = 0; i < tailPart.length - 1; i++) {
    tailPart[i].next = tailPart[i + 1];
  }
  const intersection = tailPart[0];

  // 构建 A 的前段
  let headA: ListNode | null = null;
  let curA: ListNode | null = null;
  for (let i = 0; i < skipA; i++) {
    const node = new ListNode(arrA[i]);
    if (headA === null) {
      headA = node;
      curA = node;
    } else {
      curA!.next = node;
      curA = node;
    }
  }
  if (curA) {
    curA.next = intersection;
  } else {
    headA = intersection;
  }

  // 构建 B 的前段
  let headB: ListNode | null = null;
  let curB: ListNode | null = null;
  for (let i = 0; i < skipB; i++) {
    const node = new ListNode(arrB[i]);
    if (headB === null) {
      headB = node;
      curB = node;
    } else {
      curB!.next = node;
      curB = node;
    }
  }
  if (curB) {
    curB.next = intersection;
  } else {
    headB = intersection;
  }

  return { headA, headB };
}

// 辅助函数：打印链表
function printList(head: ListNode | null): string {
  const arr: number[] = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  return arr.join(" -> ") + " -> null";
}

// ------------------------------------------------------------
// 方法1：双指针法
// ------------------------------------------------------------
// 指针 pA 走完 headA 后走向 headB，指针 pB 走完 headB 后走向 headA。
// 若两链表相交，则两指针会在交点相遇；若不相交，最终都会同时到达 null。
// 原理：两指针走过的总长度相同（a + b = b + a），会在交点对齐。
function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (headA === null || headB === null) return null;

  let pA: ListNode | null = headA;
  let pB: ListNode | null = headB;

  // 当两指针不相等时继续走，相遇或同时为 null 时退出
  while (pA !== pB) {
    // pA 走到 headA 末尾后切换到 headB
    pA = pA === null ? headB : pA.next;
    // pB 走到 headB 末尾后切换到 headA
    pB = pB === null ? headA : pB.next;
  }

  // 返回相遇节点（相交则返回交点，不相交则返回 null）
  return pA;
}

// ------------------------------------------------------------
// 方法2：哈希集合法
// ------------------------------------------------------------
// 先遍历 headA，将所有节点存入集合；再遍历 headB，第一个存在于集合中的节点即为交点。
// 时间复杂度：O(m + n)，空间复杂度：O(m)
function getIntersectionNodeHash(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  const visited = new Set<ListNode>();

  // 遍历链表 A，记录所有节点
  let cur: ListNode | null = headA;
  while (cur !== null) {
    visited.add(cur);
    cur = cur.next;
  }

  // 遍历链表 B，查找第一个已在集合中的节点
  cur = headB;
  while (cur !== null) {
    if (visited.has(cur)) {
      return cur;
    }
    cur = cur.next;
  }

  return null;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：相交链表
  // listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
  const { headA, headB } = buildIntersection([4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3);
  const result1 = getIntersectionNode(headA, headB);
  console.log("测试1 - 双指针法:");
  console.log("  交点值:", result1 ? result1.val : null);
  console.log("  期望值: 8");

  const result1h = getIntersectionNodeHash(headA, headB);
  console.log("测试1 - 哈希集合法:");
  console.log("  交点值:", result1h ? result1h.val : null);
  console.log("  期望值: 8");

  // 测试2：不相交
  const listA = buildList([2, 6, 4]);
  const listB = buildList([1, 5]);
  const result2 = getIntersectionNode(listA, listB);
  console.log("测试2 - 不相交:");
  console.log("  结果:", result2 ? result2.val : null);
  console.log("  期望: null");

  // 测试3：两链表本身相同（从头部相交）
  const { headA: hA3, headB: hB3 } = buildIntersection([1, 2, 3], [1, 2, 3], 0, 0);
  const result3 = getIntersectionNode(hA3, hB3);
  console.log("测试3 - 从头部相交:");
  console.log("  交点值:", result3 ? result3.val : null);
  console.log("  期望值: 1");
}

test();

export {};
