// ============================================================
// 062. 从未排序的链表中移除重复元素
// ============================================================
// LeetCode 1836. Remove Duplicates From an Unsorted Linked List
// 给定一个未排序链表，删除所有出现超过一次的节点，仅保留最后一次出现的节点。
// 方法：先反转链表，正向遍历时用 Set 记录已见值，删除重复节点，最后再反转回来。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 反转链表辅助函数
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// 数组转链表辅助函数
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of arr) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

// 链表转数组辅助函数
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

function deleteDuplicatesUnsorted(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  // 1. 反转链表，使最后一次出现变为第一次出现
  const reversedHead = reverseList(head);

  // 2. 正向遍历，用 Set 记录已见值，删除重复节点
  const seen = new Set<number>();
  const dummy = new ListNode(0, reversedHead);
  let prev = dummy;
  let curr: ListNode | null = reversedHead;

  while (curr !== null) {
    if (seen.has(curr.val)) {
      // 重复出现，删除该节点
      prev.next = curr.next;
    } else {
      seen.add(curr.val);
      prev = curr;
    }
    curr = curr.next;
  }

  // 3. 再次反转回来
  return reverseList(dummy.next);
}

// ============================================================
// 测试
// ============================================================
function testDeleteDuplicatesUnsorted(): void {
  // 测试1: [1,2,3,2] -> 保留每个值的最后一次出现 -> [1,3,2]
  const list1 = arrayToList([1, 2, 3, 2]);
  console.log(listToArray(deleteDuplicatesUnsorted(list1))); // [1, 3, 2]

  // 测试2: [2,1,1,2] -> 保留最后出现 -> [1,2]
  const list2 = arrayToList([2, 1, 1, 2]);
  console.log(listToArray(deleteDuplicatesUnsorted(list2))); // [1, 2]

  // 测试3: [3,2,2,1,3,2,4] -> 保留最后出现 -> [1,3,2,4]
  const list3 = arrayToList([3, 2, 2, 1, 3, 2, 4]);
  console.log(listToArray(deleteDuplicatesUnsorted(list3))); // [1, 3, 2, 4]

  console.log("deleteDuplicatesUnsorted 测试完成");
}

testDeleteDuplicatesUnsorted();

export {};
