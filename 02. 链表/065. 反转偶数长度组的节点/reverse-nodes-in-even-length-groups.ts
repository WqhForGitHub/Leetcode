// ============================================================
// 065. 反转偶数长度组的节点
// ============================================================
// LeetCode 2074. Reverse Nodes in Even Length Groups
// 将链表按长度为 1,2,3,... 的组划分（最后一组可能不完整），
// 仅反转长度为偶数的组。
// 思路：按组遍历，记录组长度并反转偶数长度组，维护前一组的尾指针进行连接。
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

// 反转 [head, tail] 段内的链表，返回新的头尾
function reverseSegment(head: ListNode, count: number): { newHead: ListNode; newTail: ListNode } {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  const tail = head;
  for (let i = 0; i < count; i++) {
    const nxt: ListNode | null = curr!.next;
    curr!.next = prev;
    prev = curr;
    curr = nxt;
  }
  return { newHead: prev!, newTail: tail };
}

function reverseEvenLengthGroups(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  const dummy = new ListNode(0, head);
  let prevGroupTail = dummy; // 上一组尾节点
  let groupSize = 1;

  while (prevGroupTail.next !== null) {
    // 1. 数当前组的实际节点数（可能不足 groupSize）
    let count = 0;
    let cursor: ListNode | null = prevGroupTail.next;
    const expectedSize = groupSize;
    for (let i = 0; i < expectedSize && cursor !== null; i++) {
      count++;
      cursor = cursor.next;
    }

    const groupHead = prevGroupTail.next!;

    if (count % 2 === 0) {
      // 偶数长度：反转该组
      const { newHead, newTail } = reverseSegment(groupHead, count);
      // 连接前一组
      prevGroupTail.next = newHead;
      // newTail 后面接 cursor（下一组的头）
      newTail.next = cursor;
      // 更新 prevGroupTail
      prevGroupTail = newTail;
    } else {
      // 奇数长度：不反转，prevGroupTail 移到该组最后一个节点
      let tail = groupHead;
      for (let i = 1; i < count; i++) {
        tail = tail.next!;
      }
      prevGroupTail = tail;
    }

    groupSize++;
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
function testReverseEvenLengthGroups(): void {
  // [5,2,6,3,9,1,7,3,8,4] -> [5,6,2,3,9,1,4,8,3,7]
  const list1 = arrayToList([5, 2, 6, 3, 9, 1, 7, 3, 8, 4]);
  console.log(listToArray(reverseEvenLengthGroups(list1)));
  // 预期 [5, 6, 2, 3, 9, 1, 4, 8, 3, 7]

  // [1,1,0,6] -> [1,1,0,6] (组: [1], [1,0]反转 -> [0,1], [6])
  const list2 = arrayToList([1, 1, 0, 6]);
  console.log(listToArray(reverseEvenLengthGroups(list2)));
  // 预期 [1, 0, 1, 6]

  // [1,1,0,6,5] -> [1,0,1,5,6]
  const list3 = arrayToList([1, 1, 0, 6, 5]);
  console.log(listToArray(reverseEvenLengthGroups(list3)));
  // 预期 [1, 0, 1, 5, 6]

  console.log("reverseEvenLengthGroups 测试完成");
}

testReverseEvenLengthGroups();

export {};
