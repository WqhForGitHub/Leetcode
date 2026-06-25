// ============================================================
// 094. 合并 K 个升序链表
// ============================================================
// LeetCode 23. Merge k Sorted Lists
// 给你一个链表数组，每个链表都已经按升序排列。
// 请将所有链表合并到一个升序链表中，返回合并后的链表。
// 时间复杂度：O(N log k)（N 为所有节点总数，k 为链表个数）

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
// 方法1：分治法
// ------------------------------------------------------------
// 将 k 个链表两两合并，类似归并排序的合并过程。
// 每轮将相邻的两个链表合并，链表数量减半，直到只剩一个。
// 时间 O(N log k)，空间 O(log k)（递归栈）。
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;
  return divideMerge(lists, 0, lists.length - 1);
}

// 分治：将 [left, right] 范围内的链表合并
function divideMerge(lists: Array<ListNode | null>, left: number, right: number): ListNode | null {
  if (left === right) {
    return lists[left];
  }
  const mid = Math.floor((left + right) / 2);
  const l1 = divideMerge(lists, left, mid);
  const l2 = divideMerge(lists, mid + 1, right);
  return mergeTwoLists(l1, l2);
}

// 合并两个有序链表
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 !== null ? l1 : l2;
  return dummy.next;
}

// ------------------------------------------------------------
// 方法2：最小堆法
// ------------------------------------------------------------
// 将每个链表的头节点放入最小堆，每次取出堆顶（最小）节点接到结果末尾，
// 并将其后继节点入堆，直到堆为空。
// 时间 O(N log k)，空间 O(k)（堆大小）。
// 这里使用数组模拟最小堆，并自定义比较。
function mergeKListsHeap(lists: Array<ListNode | null>): ListNode | null {
  // 过滤空链表
  const validLists = lists.filter((node) => node !== null);
  if (validLists.length === 0) return null;

  // 最小堆：存储 ListNode，按 val 比较
  const heap: ListNode[] = [];
  const less = (a: ListNode, b: ListNode): boolean => a.val < b.val;

  // 入堆
  function push(node: ListNode): void {
    heap.push(node);
    siftUp(heap.length - 1);
  }

  // 出堆
  function pop(): ListNode | undefined {
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0);
    }
    return top;
  }

  // 上浮
  function siftUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (less(heap[index], heap[parent])) {
        [heap[index], heap[parent]] = [heap[parent], heap[index]];
        index = parent;
      } else {
        break;
      }
    }
  }

  // 下沉
  function siftDown(index: number): void {
    const n = heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < n && less(heap[left], heap[smallest])) {
        smallest = left;
      }
      if (right < n && less(heap[right], heap[smallest])) {
        smallest = right;
      }
      if (smallest !== index) {
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }

  // 将所有链表头节点入堆
  for (const node of validLists) {
    push(node!);
  }

  const dummy = new ListNode();
  let cur = dummy;

  while (heap.length > 0) {
    const minNode = pop()!;
    cur.next = minNode;
    cur = cur.next;
    // 后继节点入堆
    if (minNode.next !== null) {
      push(minNode.next);
    }
  }

  return dummy.next;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：分治法
  const lists1 = [buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])];
  console.log("测试1 - 分治法:");
  console.log("  各链表:", [
    [1, 4, 5],
    [1, 3, 4],
    [2, 6],
  ]);
  const res1 = mergeKLists(lists1);
  console.log("  合并后:", listToArray(res1));
  console.log("  期望:  [1, 1, 2, 3, 4, 4, 5, 6]");

  // 测试2：最小堆法
  const lists2 = [buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])];
  console.log("测试2 - 最小堆法:");
  const res2 = mergeKListsHeap(lists2);
  console.log("  合并后:", listToArray(res2));
  console.log("  期望:  [1, 1, 2, 3, 4, 4, 5, 6]");

  // 测试3：空数组
  console.log("测试3 - 空数组:");
  const res3 = mergeKLists([]);
  console.log("  合并后:", res3);
  console.log("  期望:  null");

  // 测试4：含空链表
  const lists4 = [buildList([]), buildList([1]), buildList([])];
  console.log("测试4 - 含空链表:");
  const res4 = mergeKListsHeap(lists4);
  console.log("  合并后:", listToArray(res4));
  console.log("  期望:  [1]");

  // 测试5：单个链表
  const lists5 = [buildList([1, 2, 3])];
  console.log("测试5 - 单个链表:");
  const res5 = mergeKLists(lists5);
  console.log("  合并后:", listToArray(res5));
  console.log("  期望:  [1, 2, 3]");
}

test();

export {};
