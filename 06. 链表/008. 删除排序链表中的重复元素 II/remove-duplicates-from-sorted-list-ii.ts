// ============================================================
// 008. 删除排序链表中的重复元素 II
// ============================================================
// LeetCode 82. Remove Duplicates from Sorted List II
// 给定一个已排序的链表的头节点 head，删除原始链表中所有重复数字的节点，
// 只留下不同的数字。返回已排序的链表。
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

// 方法1：dummy 节点 + 一次遍历（推荐）
// 用 prev 指向最后一个不重复的节点，遇到重复段则跳过
function deleteDuplicates(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy; // prev 指向已确认无重复的最后一个节点

  while (prev.next !== null && prev.next.next !== null) {
    const cur = prev.next;
    const next = cur.next!;

    if (cur.val === next.val) {
      // 发现重复，跳过所有相同值的节点
      const dupVal = cur.val;
      let skip: ListNode | null = cur;
      while (skip !== null && skip.val === dupVal) {
        skip = skip.next;
      }
      // prev.next 直接跳过整个重复段
      prev.next = skip;
    } else {
      // 不重复，prev 前进一步
      prev = cur;
    }
  }

  return dummy.next;
}

// 方法2：递归
// 如果当前节点与下一个节点重复，跳过所有重复节点后递归
function deleteDuplicates2(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }

  if (head.val === head.next.val) {
    // 当前节点重复，跳过所有相同值的节点
    let skip: ListNode | null = head;
    while (skip !== null && skip.val === head.val) {
      skip = skip.next;
    }
    // 递归处理剩余部分
    return deleteDuplicates2(skip);
  } else {
    // 当前节点不重复，保留并递归处理后续
    head.next = deleteDuplicates2(head.next);
    return head;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 008. 删除排序链表中的重复元素 II =====");
// [1,2,3,3,4,4,5] => [1,2,5]
console.log("结果:", listToArray(deleteDuplicates(arrayToList([1, 2, 3, 3, 4, 4, 5]))));
// [1,1,1,2,3] => [2,3]
console.log("结果:", listToArray(deleteDuplicates(arrayToList([1, 1, 1, 2, 3]))));
// [1,2,3] => [1,2,3]
console.log("结果:", listToArray(deleteDuplicates(arrayToList([1, 2, 3]))));
// [] => []
console.log("结果:", listToArray(deleteDuplicates(arrayToList([]))));

export {};
