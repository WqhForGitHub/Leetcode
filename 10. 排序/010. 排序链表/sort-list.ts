// ============================================================
// 010. 排序链表
// ============================================================
// LeetCode 148. Sort List
// 在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序。

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 方法1：归并排序（自顶向下，O(n log n) 时间，O(log n) 递归空间）
function sortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  // 快慢指针找中点
  let slow: ListNode = head;
  let fast: ListNode | null = head.next;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  const mid: ListNode | null = slow.next;
  slow.next = null; // 断开

  const left: ListNode | null = sortList(head);
  const right: ListNode | null = sortList(mid);
  return mergeTwoLists(left, right);
}

function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail: ListNode = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 !== null ? l1 : l2;
  return dummy.next;
}

// 方法2：归并排序（自底向上，O(n log n) 时间，O(1) 空间）
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  // 统计长度
  let length = 0;
  let node: ListNode | null = head;
  while (node !== null) {
    length++;
    node = node.next;
  }

  const dummy = new ListNode(0, head);

  // 每次归并的子链表长度
  for (let size = 1; size < length; size <<= 1) {
    let tail: ListNode = dummy;
    let cur: ListNode | null = dummy.next;
    while (cur !== null) {
      const left: ListNode | null = cur;
      const right: ListNode | null = split(left, size);
      cur = right !== null ? split(right, size) : null;
      // 合并 left 和 right
      const merged = mergeTwoLists(left, right);
      // tail 走到合并后链表末尾
      let m: ListNode | null = merged;
      while (m !== null) {
        tail.next = m;
        tail = m;
        m = m.next;
      }
    }
  }

  return dummy.next;
}

// 从 head 开始切出 size 个节点，返回剩余部分的头节点
function split(head: ListNode | null, size: number): ListNode | null {
  let cur: ListNode | null = head;
  for (let i = 1; i < size && cur !== null; i++) {
    cur = cur.next;
  }
  if (cur === null) return null;
  const next: ListNode | null = cur.next;
  cur.next = null;
  return next;
}

// ============================================================
// 测试
// ============================================================
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail: ListNode = dummy;
  for (const v of arr) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const res: number[] = [];
  let cur = head;
  while (cur !== null) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

console.log("===== 010. 排序链表 =====");
console.log("自顶向下 [4,2,1,3]:", listToArray(sortList(arrayToList([4, 2, 1, 3])))); // [1,2,3,4]
console.log("自顶向下 [-1,5,3,4,0]:", listToArray(sortList(arrayToList([-1, 5, 3, 4, 0])))); // [-1,0,3,4,5]
console.log("自底向上 [4,2,1,3]:", listToArray(sortListBottomUp(arrayToList([4, 2, 1, 3])))); // [1,2,3,4]
console.log("自底向上 [-1,5,3,4,0]:", listToArray(sortListBottomUp(arrayToList([-1, 5, 3, 4, 0])))); // [-1,0,3,4,5]

export {};
