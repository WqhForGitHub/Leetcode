// ============================================================
// 009. 删除排序链表中的重复元素
// ============================================================
// LeetCode 83. Remove Duplicates from Sorted List
// 给定一个已排序的链表的头节点 head，删除所有重复的元素，
// 使每个元素只出现一次。返回已排序的链表。
// 时间复杂度：O(n)，空间复杂度：O(1)

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

// 方法1：一次遍历（推荐）
// 遍历链表，遇到相同值的节点则跳过
function deleteDuplicates(head: ListNode | null): ListNode | null {
  let cur = head;

  while (cur !== null && cur.next !== null) {
    if (cur.val === cur.next.val) {
      // 当前节点与下一节点值相同，跳过下一节点
      cur.next = cur.next.next;
    } else {
      // 值不同，继续前进
      cur = cur.next;
    }
  }

  return head;
}

// 方法2：递归
// 比较当前节点与下一个节点，递归处理
function deleteDuplicates2(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }

  // 递归处理后续链表
  head.next = deleteDuplicates2(head.next);

  // 如果当前节点与下一个节点相同，跳过当前节点
  if (head.next !== null && head.val === head.next.val) {
    return head.next;
  }

  return head;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 删除排序链表中的重复元素 =====");
// [1,1,2] => [1,2]
console.log("结果:", listToArray(deleteDuplicates(arrayToList([1, 1, 2]))));
// [1,1,2,3,3] => [1,2,3]
console.log("结果:", listToArray(deleteDuplicates(arrayToList([1, 1, 2, 3, 3]))));
// [] => []
console.log("结果:", listToArray(deleteDuplicates(arrayToList([]))));
// [1,1,1] => [1]
console.log("结果:", listToArray(deleteDuplicates(arrayToList([1, 1, 1]))));

export {};
