// ============================================================
// 071. LCR 078. 合并 K 个升序链表
// ============================================================
// LeetCode 23. Merge K Sorted Lists
// 给定一个链表数组，每个链表都已经按升序排列。请将所有链表合并到一个升序链表中。
// 时间复杂度：O(N log K), 空间复杂度：O(log K) 递归栈

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 合并两个有序链表
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy: ListNode = new ListNode(0);
  let cur: ListNode = dummy;
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

// 方法1：分治 - 两两合并（推荐）
// 将 k 个链表两两配对合并，每轮链表数量减半，共 log k 轮
// 时间复杂度 O(N log K)，空间复杂度 O(log K) 递归栈
function mergeKListsDivide(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) {
    return null;
  }
  return mergeRange(lists, 0, lists.length - 1);
}

function mergeRange(lists: Array<ListNode | null>, left: number, right: number): ListNode | null {
  if (left === right) {
    return lists[left];
  }
  const mid: number = left + Math.floor((right - left) / 2);
  const l: ListNode | null = mergeRange(lists, left, mid);
  const r: ListNode | null = mergeRange(lists, mid + 1, right);
  return mergeTwoLists(l, r);
}

// 方法2：最小堆
// 用最小堆维护每个链表当前头节点，每次取出最小的，将其后继放回堆
// 时间复杂度 O(N log K)，空间复杂度 O(K)
function mergeKListsHeap(lists: Array<ListNode | null>): ListNode | null {
  class MinHeap {
    private data: ListNode[] = [];

    private siftUp(i: number): void {
      while (i > 0) {
        const parent: number = Math.floor((i - 1) / 2);
        if (this.data[i].val < this.data[parent].val) {
          [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
          i = parent;
        } else {
          break;
        }
      }
    }

    private siftDown(i: number): void {
      const n: number = this.data.length;
      while (true) {
        let smallest: number = i;
        const left: number = 2 * i + 1;
        const right: number = 2 * i + 2;
        if (left < n && this.data[left].val < this.data[smallest].val) {
          smallest = left;
        }
        if (right < n && this.data[right].val < this.data[smallest].val) {
          smallest = right;
        }
        if (smallest !== i) {
          [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
          i = smallest;
        } else {
          break;
        }
      }
    }

    push(val: ListNode): void {
      this.data.push(val);
      this.siftUp(this.data.length - 1);
    }

    pop(): ListNode {
      const top: ListNode = this.data[0];
      const last: ListNode = this.data.pop()!;
      if (this.data.length > 0) {
        this.data[0] = last;
        this.siftDown(0);
      }
      return top;
    }

    size(): number {
      return this.data.length;
    }
  }

  const heap: MinHeap = new MinHeap();
  for (const head of lists) {
    if (head !== null) {
      heap.push(head);
    }
  }

  const dummy: ListNode = new ListNode(0);
  let cur: ListNode = dummy;
  while (heap.size() > 0) {
    const minNode: ListNode = heap.pop();
    cur.next = minNode;
    cur = cur.next;
    if (minNode.next !== null) {
      heap.push(minNode.next);
    }
  }
  return dummy.next;
}

// 辅助：数组转链表
function arrayToList(arr: number[]): ListNode | null {
  const dummy: ListNode = new ListNode(0);
  let cur: ListNode = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

// 辅助：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let cur: ListNode | null = head;
  while (cur !== null) {
    result.push(cur.val);
    cur = cur.next;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 071. LCR 078. 合并 K 个升序链表 =====");
console.log(
  listToArray(
    mergeKListsDivide([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]),
  ),
); // 期望结果: [1, 1, 2, 3, 4, 4, 5, 6]
console.log(listToArray(mergeKListsDivide([]))); // 期望结果: []
console.log(listToArray(mergeKListsDivide([arrayToList([])]))); // 期望结果: []
console.log("--- 方法2测试 ---");
console.log(
  listToArray(
    mergeKListsHeap([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]),
  ),
); // 期望结果: [1, 1, 2, 3, 4, 4, 5, 6]
console.log(listToArray(mergeKListsHeap([]))); // 期望结果: []

export {};
