// ============================================================
// 063. 给按照绝对值排序的链表排序
// ============================================================
// LeetCode 2046. Sort Linked List Already Sorted Using Absolute Values
// 给定一个按绝对值非递减排序的链表，返回按实际值排序的链表。
// 思路：绝对值排序意味着负数按绝对值递增出现（即实际值递减），非负数按绝对值递增出现。
// 因此负数部分是逆序的，非负数部分是顺序的。分离两个子链表后，反转负数链表，拼接到非负数链表前。
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

function sortLinkedList(head: ListNode | null): ListNode | null {
  // 负数链表头尾、非负数链表头尾
  let negHead: ListNode | null = null;
  let negTail: ListNode | null = null;
  let posHead: ListNode | null = null;
  let posTail: ListNode | null = null;

  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = null; // 断开当前节点
    if (curr.val < 0) {
      // 负数：尾插到负数链表（保持出现顺序，需要后续反转）
      if (negTail === null) {
        negHead = curr;
        negTail = curr;
      } else {
        negTail.next = curr;
        negTail = curr;
      }
    } else {
      // 非负数：尾插到非负数链表
      if (posTail === null) {
        posHead = curr;
        posTail = curr;
      } else {
        posTail.next = curr;
        posTail = curr;
      }
    }
    curr = next;
  }

  // 反转负数链表（原为逆序，反转后变为升序）
  const reversedNegHead = reverseList(negHead);
  // 更新负数链表尾节点
  if (reversedNegHead !== null) {
    let tail = reversedNegHead;
    while (tail.next !== null) {
      tail = tail.next;
    }
    // 拼接：负数链表 + 非负数链表
    tail.next = posHead;
    return reversedNegHead;
  }

  // 无负数节点
  return posHead;
}

// ============================================================
// 测试
// ============================================================
function testSortLinkedList(): void {
  // [0,2,-5,5,-5] -> [-5,-5,0,2,5]
  const list1 = arrayToList([0, 2, -5, 5, -5]);
  console.log(listToArray(sortLinkedList(list1))); // [-5, -5, 0, 2, 5]

  // [0,1,2] -> [0,1,2]
  const list2 = arrayToList([0, 1, 2]);
  console.log(listToArray(sortLinkedList(list2))); // [0, 1, 2]

  // [1] -> [1]
  const list3 = arrayToList([1]);
  console.log(listToArray(sortLinkedList(list3))); // [1]

  console.log("sortLinkedList 测试完成");
}

testSortLinkedList();

export {};
