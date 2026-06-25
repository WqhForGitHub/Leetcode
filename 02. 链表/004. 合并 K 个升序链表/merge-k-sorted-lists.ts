// ============================================================
// 004. 合并 K 个升序链表
// ============================================================
// LeetCode 23. Merge K Sorted Lists
// 给你一个链表数组，每个链表都已经按升序排列。请将所有链表合并到一个升序链表中。
// 时间复杂度：方法1 O(N log K)，方法2 O(N log N)，方法3 O(NK)

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
  const result: number[] = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

// 方法1：分治合并（推荐）
// 将 K 个链表两两配对合并，不断折半，最终合并为一个
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) return null;

  // 合并两个有序链表
  function mergeTwo(a: ListNode | null, b: ListNode | null): ListNode | null {
    const dummy = new ListNode();
    let cur = dummy;
    while (a !== null && b !== null) {
      if (a.val <= b.val) {
        cur.next = a;
        a = a.next;
      } else {
        cur.next = b;
        b = b.next;
      }
      cur = cur.next;
    }
    cur.next = a !== null ? a : b;
    return dummy.next;
  }

  // 分治：每轮将相邻的两个链表合并
  let arr = lists.slice();
  while (arr.length > 1) {
    const merged: Array<ListNode | null> = [];
    for (let i = 0; i < arr.length; i += 2) {
      const l1 = arr[i];
      const l2 = i + 1 < arr.length ? arr[i + 1] : null;
      merged.push(mergeTwo(l1, l2));
    }
    arr = merged;
  }

  return arr[0];
}

// 方法2：最小堆（用数组排序模拟）
// 收集所有节点值，排序后重建链表
function mergeKLists2(lists: Array<ListNode | null>): ListNode | null {
  const values: number[] = [];

  // 收集所有节点的值
  for (const head of lists) {
    let cur = head;
    while (cur !== null) {
      values.push(cur.val);
      cur = cur.next;
    }
  }

  // 排序
  values.sort((a, b) => a - b);

  // 重建链表
  const dummy = new ListNode();
  let cur = dummy;
  for (const v of values) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }

  return dummy.next;
}

// 方法3：顺序合并
// 依次将每个链表合并到结果中
function mergeKLists3(lists: Array<ListNode | null>): ListNode | null {
  function mergeTwo(a: ListNode | null, b: ListNode | null): ListNode | null {
    const dummy = new ListNode();
    let cur = dummy;
    while (a !== null && b !== null) {
      if (a.val <= b.val) {
        cur.next = a;
        a = a.next;
      } else {
        cur.next = b;
        b = b.next;
      }
      cur = cur.next;
    }
    cur.next = a !== null ? a : b;
    return dummy.next;
  }

  let result: ListNode | null = null;
  for (const head of lists) {
    result = mergeTwo(result, head);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 合并 K 个升序链表 =====");
// [[1,4,5],[1,3,4],[2,6]] => [1,1,2,3,4,4,5,6]
console.log(
  "结果:",
  listToArray(mergeKLists([arrayToList([1, 4, 5]), arrayToList([1, 3, 4]), arrayToList([2, 6])]))
);
// [] => []
console.log("结果:", listToArray(mergeKLists([])));
// [[]] => []
console.log("结果:", listToArray(mergeKLists([arrayToList([])])));

export {};
