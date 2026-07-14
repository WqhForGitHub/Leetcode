// ============================================================
// 001. 合并 K 个升序链表
// ============================================================
// LeetCode 23. Merge k Sorted Lists
// 给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。
// 时间复杂度：O(N log K)，空间复杂度：O(K)，其中 N 为节点总数，K 为链表数

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val ?? 0;
    this.next = next ?? null;
  }
}

class MinHeap<T> {
  private heap: T[] = [];
  private cmp: (a: T, b: T) => number;
  constructor(cmp: (a: T, b: T) => number) {
    this.cmp = cmp;
  }
  get size(): number {
    return this.heap.length;
  }
  peek(): T | undefined {
    return this.heap[0];
  }
  push(v: T): void {
    this.heap.push(v);
    this.siftUp(this.heap.length - 1);
  }
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(this.heap[i], this.heap[p]) < 0) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.cmp(this.heap[l], this.heap[s]) < 0) s = l;
      if (r < n && this.cmp(this.heap[r], this.heap[s]) < 0) s = r;
      if (s !== i) {
        [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法1：最小堆（推荐）
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap = new MinHeap<ListNode>((a, b) => a.val - b.val);
  for (const head of lists) {
    if (head !== null) heap.push(head);
  }
  const dummy = new ListNode(0);
  let curr = dummy;
  while (heap.size > 0) {
    const node = heap.pop()!;
    curr.next = node;
    curr = curr.next;
    if (node.next !== null) heap.push(node.next);
  }
  return dummy.next;
}

// 方法2：分治合并
function mergeKListsDivideAndConquer(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  const mergeTwo = (a: ListNode | null, b: ListNode | null): ListNode | null => {
    const dummy = new ListNode(0);
    let curr = dummy;
    while (a !== null && b !== null) {
      if (a.val <= b.val) {
        curr.next = a;
        a = a.next;
      } else {
        curr.next = b;
        b = b.next;
      }
      curr = curr.next;
    }
    curr.next = a ?? b;
    return dummy.next;
  };
  let arr = lists.slice();
  while (arr.length > 1) {
    const next: Array<ListNode | null> = [];
    for (let i = 0; i < arr.length; i += 2) {
      next.push(mergeTwo(arr[i], i + 1 < arr.length ? arr[i + 1] : null));
    }
    arr = next;
  }
  return arr[0];
}

// ============================================================
// 测试
// ============================================================
function buildList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}
function listToArray(head: ListNode | null): number[] {
  const res: number[] = [];
  while (head !== null) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}
console.log("===== 001. 合并 K 个升序链表 =====");
console.log(
  "最小堆:",
  listToArray(mergeKLists([buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])])),
);
// 期望 [1,1,2,3,4,4,5,6]
console.log(
  "分治:",
  listToArray(
    mergeKListsDivideAndConquer([buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])]),
  ),
);
// 期望 [1,1,2,3,4,4,5,6]

export {};
