// ============================================================
// 002. 合并 K 个升序链表
// ============================================================
// LeetCode 23. Merge k Sorted Lists
// 给你一个链表数组，每个链表都已经按升序排列。
// 请你将所有链表合并到一个升序链表中，返回合并后的链表。
// 时间复杂度：O(N log K), 空间复杂度：O(log K)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：合并两个有序链表
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy: ListNode = new ListNode(0);
  let curr: ListNode | null = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 !== null ? l1 : l2;
  return dummy.next;
}

// 方法1：分治合并（推荐）
// 两两配对合并，每轮链表数量减半，共 log K 轮
// 时间复杂度 O(N log K)，空间复杂度 O(log K)（递归栈）
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;

  // 分治：将 lists[left..right] 合并为一个链表
  function divideMerge(left: number, right: number): ListNode | null {
    if (left === right) return lists[left];
    const mid: number = left + Math.floor((right - left) / 2);
    const l: ListNode | null = divideMerge(left, mid);
    const r: ListNode | null = divideMerge(mid + 1, right);
    return mergeTwoLists(l, r);
  }

  return divideMerge(0, lists.length - 1);
}

// 方法2：最小堆
// 使用最小堆每次取出最小节点
// 时间复杂度 O(N log K)，空间复杂度 O(K)
function mergeKListsHeap(lists: Array<ListNode | null>): ListNode | null {
  // 过滤空链表
  const validLists: Array<ListNode | null> = lists.filter((n) => n !== null);
  if (validLists.length === 0) return null;

  // 简易最小堆实现（基于数组）
  const heap: ListNode[] = [];
  // 下沉操作
  function siftDown(idx: number): void {
    const n: number = heap.length;
    while (true) {
      let smallest: number = idx;
      const left: number = 2 * idx + 1;
      const right: number = 2 * idx + 2;
      if (left < n && heap[left].val < heap[smallest].val) smallest = left;
      if (right < n && heap[right].val < heap[smallest].val) smallest = right;
      if (smallest === idx) break;
      [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
      idx = smallest;
    }
  }
  // 上浮操作
  function siftUp(idx: number): void {
    while (idx > 0) {
      const parent: number = Math.floor((idx - 1) / 2);
      if (heap[parent].val <= heap[idx].val) break;
      [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
      idx = parent;
    }
  }

  // 初始建堆
  for (const node of validLists) {
    if (node !== null) {
      heap.push(node);
      siftUp(heap.length - 1);
    }
  }

  const dummy: ListNode = new ListNode(0);
  let curr: ListNode = dummy;
  while (heap.length > 0) {
    const minNode: ListNode = heap[0];
    curr.next = minNode;
    curr = curr.next;
    if (minNode.next !== null) {
      heap[0] = minNode.next;
      siftDown(0);
    } else {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      if (heap.length > 0) siftDown(0);
    }
  }
  curr.next = null;
  return dummy.next;
}

// 方法3：顺序合并
// 依次将每个链表合并到结果中
// 时间复杂度 O(N*K)，空间复杂度 O(1)
function mergeKListsSequential(lists: Array<ListNode | null>): ListNode | null {
  let result: ListNode | null = null;
  for (const list of lists) {
    result = mergeTwoLists(result, list);
  }
  return result;
}

// 辅助函数：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy: ListNode = new ListNode(0);
  let curr: ListNode = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const arr: number[] = [];
  while (head !== null) {
    arr.push(head.val);
    head = head.next;
  }
  return arr;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 合并 K 个升序链表 =====");
console.log(
  listToArray(mergeKLists([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])])),
);
// 期望结果: [1, 1, 2, 3, 4, 4, 5, 6]
console.log(listToArray(mergeKLists([]))); // 期望结果: []
console.log(listToArray(mergeKLists([arrayToList([])]))); // 期望结果: []
console.log("--- 方法2测试 ---");
console.log(
  listToArray(
    mergeKListsHeap([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]),
  ),
);
// 期望结果: [1, 1, 2, 3, 4, 4, 5, 6]
console.log("--- 方法3测试 ---");
console.log(
  listToArray(
    mergeKListsSequential([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]),
  ),
);
// 期望结果: [1, 1, 2, 3, 4, 4, 5, 6]

export {};
