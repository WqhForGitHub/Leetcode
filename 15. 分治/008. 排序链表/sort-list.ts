// ============================================================
// 008. 排序链表
// ============================================================
// LeetCode 148. Sort List
// 给你链表的头结点 head，请将其按升序排列并返回排序后的链表。
// 要求 O(n log n) 时间复杂度。
// 时间复杂度：O(n log n), 空间复杂度：O(log n)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 方法1：归并排序（分治）（推荐）
// 1. 快慢指针找中点 2. 断开成两半 3. 分别排序 4. 合并两个有序链表
// 时间复杂度 O(n log n)，空间复杂度 O(log n)（递归栈）
function sortList(head: ListNode | null): ListNode | null {
  // 基线条件：空或只有一个节点
  if (head === null || head.next === null) return head;

  // 快慢指针找中点（slow 停在前半部分最后一个节点）
  let slow: ListNode = head;
  let fast: ListNode | null = head.next;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 断开成两半
  const mid: ListNode | null = slow.next;
  slow.next = null;

  // 分治：分别排序左右两半
  const left: ListNode | null = sortList(head);
  const right: ListNode | null = sortList(mid);

  // 合并两个有序链表
  return merge(left, right);
}

// 合并两个有序链表
function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy: ListNode = new ListNode(0);
  let curr: ListNode = dummy;
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

// 方法2：自底向上的归并排序
// 每次合并长度为 1, 2, 4, 8... 的子链表，迭代实现，O(1) 额外空间
// 时间复杂度 O(n log n)，空间复杂度 O(1)
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  // 计算链表长度
  let length: number = 0;
  let node: ListNode | null = head;
  while (node !== null) {
    length++;
    node = node.next;
  }

  const dummy: ListNode = new ListNode(0, head);

  // 子链表长度从 1 开始倍增
  for (let size: number = 1; size < length; size *= 2) {
    let prev: ListNode = dummy;
    let curr: ListNode | null = dummy.next;
    while (curr !== null) {
      // 切出第一段长度为 size 的子链表
      const left: ListNode | null = curr;
      let right: ListNode | null = curr;
      let count: number = 1;
      while (right !== null && count < size) {
        right = right.next;
        count++;
      }
      // 记录下一段起点
      let nextStart: ListNode | null = null;
      if (right !== null) {
        nextStart = right.next;
        right.next = null;
      }
      // 切出第二段长度为 size 的子链表
      const rightList: ListNode | null = nextStart;
      let rightEnd: ListNode | null = nextStart;
      count = 1;
      while (rightEnd !== null && count < size) {
        rightEnd = rightEnd.next;
        count++;
      }
      let tail: ListNode | null = null;
      if (rightEnd !== null) {
        tail = rightEnd.next;
        rightEnd.next = null;
      }
      // 合并两段
      const merged: ListNode | null = merge(left, rightList);
      // 连接合并后的链表
      prev.next = merged;
      // 移动 prev 到合并后链表末尾
      while (prev.next !== null) {
        prev = prev.next;
      }
      prev.next = tail;
      curr = tail;
    }
  }

  return dummy.next;
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
console.log("===== 008. 排序链表 =====");
console.log(listToArray(sortList(arrayToList([4, 2, 1, 3])))); // 期望结果: [1, 2, 3, 4]
console.log(listToArray(sortList(arrayToList([-1, 5, 3, 4, 0])))); // 期望结果: [-1, 0, 3, 4, 5]
console.log(listToArray(sortList(arrayToList([])))); // 期望结果: []
console.log(listToArray(sortList(arrayToList([1])))); // 期望结果: [1]
console.log("--- 方法2测试 ---");
console.log(listToArray(sortListBottomUp(arrayToList([4, 2, 1, 3])))); // 期望结果: [1, 2, 3, 4]
console.log(listToArray(sortListBottomUp(arrayToList([-1, 5, 3, 4, 0])))); // 期望结果: [-1, 0, 3, 4, 5]
console.log(listToArray(sortListBottomUp(arrayToList([])))); // 期望结果: []
console.log(listToArray(sortListBottomUp(arrayToList([1])))); // 期望结果: [1]

export {};
