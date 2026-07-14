// ============================================================
// 066. 删除链表的中间节点
// ============================================================
// LeetCode 2095. Delete the Middle Node of a Linked List
// 删除链表的中间节点。链表长度为 n 时，删除下标 n/2（向下取整）的节点。
// 思路：快慢指针，慢指针走一步，快指针走两步。用 prev 记录慢指针前一节点，快指针到尾时删除慢指针。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
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

function deleteMiddle(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    // 链表为空或只有一个节点，删除后为空
    return null;
  }

  let slow: ListNode = head;
  let fast: ListNode | null = head;
  let prev: ListNode | null = null;

  // 快指针走两步，慢指针走一步
  while (fast !== null && fast.next !== null) {
    prev = slow;
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 此时 slow 即为中间节点，prev 为其前一节点
  prev!.next = slow.next;

  return head;
}

// ============================================================
// 测试
// ============================================================
function testDeleteMiddle(): void {
  // [1,3,4,7,1,2,6] -> [1,3,4,1,2,6]
  console.log(listToArray(deleteMiddle(arrayToList([1, 3, 4, 7, 1, 2, 6]))));
  // 预期 [1, 3, 4, 1, 2, 6]

  // [1,2,3,4] -> [1,2,4]
  console.log(listToArray(deleteMiddle(arrayToList([1, 2, 3, 4]))));
  // 预期 [1, 2, 4]

  // [2,1] -> [2]
  console.log(listToArray(deleteMiddle(arrayToList([2, 1]))));
  // 预期 [2]

  // [1] -> []
  console.log(listToArray(deleteMiddle(arrayToList([1]))));
  // 预期 []

  console.log("deleteMiddle 测试完成");
}

testDeleteMiddle();

export {};
