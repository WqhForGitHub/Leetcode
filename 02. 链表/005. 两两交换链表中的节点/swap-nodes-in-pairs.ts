// ============================================================
// 005. 两两交换链表中的节点
// ============================================================
// LeetCode 24. Swap Nodes in Pairs
// 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。
// 时间复杂度：O(n)，空间复杂度：方法1 O(1)，方法2 O(n)

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

// 方法1：迭代（推荐）
// 使用 dummy 节点，每两个节点为一组进行交换
function swapPairs(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  while (prev.next !== null && prev.next.next !== null) {
    const first = prev.next; // 第一个节点
    const second = prev.next.next; // 第二个节点

    // 交换两个节点
    first.next = second.next;
    second.next = first;
    prev.next = second;

    // 移动 prev 到下一组的前驱
    prev = first;
  }

  return dummy.next;
}

// 方法2：递归
// 递归交换前两个节点，其余部分递归处理
function swapPairs2(head: ListNode | null): ListNode | null {
  // 递归终止条件：不足两个节点
  if (head === null || head.next === null) {
    return head;
  }

  const newHead = head.next; // 新的头节点是原来的第二个
  head.next = swapPairs2(newHead.next); // 原头节点指向后续交换结果
  newHead.next = head; // 新头节点指向原头节点

  return newHead;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 两两交换链表中的节点 =====");
// [1,2,3,4] => [2,1,4,3]
console.log("结果:", listToArray(swapPairs(arrayToList([1, 2, 3, 4]))));
// [] => []
console.log("结果:", listToArray(swapPairs(arrayToList([]))));
// [1] => [1]
console.log("结果:", listToArray(swapPairs(arrayToList([1]))));
// [1,2,3] => [2,1,3]
console.log("结果:", listToArray(swapPairs(arrayToList([1, 2, 3]))));

export {};
