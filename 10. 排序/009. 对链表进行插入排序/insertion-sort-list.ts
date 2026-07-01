// ============================================================
// 009. 对链表进行插入排序
// ============================================================
// LeetCode 147. Insertion Sort List
// 对单链表进行插入排序，返回排序后的链表头节点。

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 方法1：插入排序 + 哑节点（推荐，O(n^2) 时间，O(1) 空间）
function insertionSortList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const dummy = new ListNode(-Infinity, head);
  let lastSorted: ListNode | null = head; // 已排序部分最后一个节点
  let cur: ListNode | null = head.next; // 待插入节点

  while (cur !== null) {
    if (lastSorted !== null && cur.val >= lastSorted.val) {
      // 已在末尾，无需移动
      lastSorted = cur;
      cur = cur.next;
    } else {
      // 从头寻找插入位置
      let prev: ListNode | null = dummy;
      while (prev !== null && prev.next !== null && prev.next.val < cur.val) {
        prev = prev.next;
      }
      // 将 cur 插入 prev 之后
      if (lastSorted !== null) {
        lastSorted.next = cur.next;
      }
      cur.next = prev!.next;
      prev!.next = cur;
      cur = lastSorted !== null ? lastSorted.next : null;
    }
  }

  return dummy.next;
}

// 方法2：每次从前往后找插入位置（更直观，O(n^2)）
function insertionSortListNaive(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(-Infinity, null);
  let cur: ListNode | null = head;

  while (cur !== null) {
    const next: ListNode | null = cur.next;
    // 在 dummy 链中找插入位置
    let prev: ListNode | null = dummy;
    while (prev !== null && prev.next !== null && prev.next.val < cur.val) {
      prev = prev.next;
    }
    cur.next = prev!.next;
    prev!.next = cur;
    cur = next;
  }

  return dummy.next;
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

console.log("===== 009. 对链表进行插入排序 =====");
console.log("插入排序 [4,2,1,3]:", listToArray(insertionSortList(arrayToList([4, 2, 1, 3])))); // [1,2,3,4]
console.log("插入排序 [-1,5,3,4,0]:", listToArray(insertionSortList(arrayToList([-1, 5, 3, 4, 0])))); // [-1,0,3,4,5]
console.log("朴素 [4,2,1,3]:", listToArray(insertionSortListNaive(arrayToList([4, 2, 1, 3])))); // [1,2,3,4]

export {};
