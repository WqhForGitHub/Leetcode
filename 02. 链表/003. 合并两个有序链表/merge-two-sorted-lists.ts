// ============================================================
// 003. 合并两个有序链表
// ============================================================
// LeetCode 21. Merge Two Sorted Lists
// 将两个升序链表合并为一个新的升序链表并返回。
// 时间复杂度：O(m + n)，空间复杂度：O(1)

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

// 方法1：迭代 + dummy 节点（推荐）
// 使用 dummy 节点简化头节点处理，逐个比较连接
function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let cur = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      cur.next = list1;
      list1 = list1.next;
    } else {
      cur.next = list2;
      list2 = list2.next;
    }
    cur = cur.next;
  }

  // 连接剩余部分
  cur.next = list1 !== null ? list1 : list2;

  return dummy.next;
}

// 方法2：递归
// 比较两个头节点，较小的头节点连接其余部分的合并结果
function mergeTwoLists2(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // 递归终止条件
  if (list1 === null) return list2;
  if (list2 === null) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoLists2(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoLists2(list1, list2.next);
    return list2;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 合并两个有序链表 =====");
// [1,2,4] + [1,3,4] => [1,1,2,3,4,4]
console.log("结果:", listToArray(mergeTwoLists(arrayToList([1, 2, 4]), arrayToList([1, 3, 4]))));
// [] + [] => []
console.log("结果:", listToArray(mergeTwoLists(arrayToList([]), arrayToList([]))));
// [] + [0] => [0]
console.log("结果:", listToArray(mergeTwoLists(arrayToList([]), arrayToList([0]))));

export {};
