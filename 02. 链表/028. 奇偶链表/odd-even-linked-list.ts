// ============================================================
// 028. 奇偶链表
// ============================================================
// LeetCode 328. Odd Even Linked List
// 将单链表中的奇数位节点放在一起，偶数位节点放在一起，最后将偶数链表接到奇数链表末尾。
// 时间复杂度：O(n)，空间复杂度：O(1)

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
  let curr = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

// ============================================================
// 方法1：双指针分离奇偶链表（推荐）
// ============================================================
// odd 指针串联奇数位节点，even 指针串联偶数位节点。
// 维护 evenHead 保存偶数链表的头，最后接在 odd 链表末尾。
// 时间复杂度 O(n)，空间复杂度 O(1)
function oddEvenList(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  // odd 从第 1 个节点开始（奇数位），even 从第 2 个节点开始（偶数位）
  let odd: ListNode = head;
  let even: ListNode | null = head.next;
  const evenHead: ListNode = head.next; // 保存偶数链表头，便于最后拼接

  // even 在 odd 后面，所以以 even 和 even.next 是否为空作为循环条件
  while (even !== null && even.next !== null) {
    // odd 的 next 跳过 even，指向下一个奇数位节点
    odd.next = even.next;
    odd = odd.next;
    // even 的 next 跳过 odd，指向下一个偶数位节点
    even.next = odd.next;
    even = even.next;
  }

  // 将偶数链表接到奇数链表末尾
  odd.next = evenHead;
  return head;
}

// ============================================================
// 方法2：分离节点后合并（思路相同，写法略不同）
// ============================================================
// 将奇数节点和偶数节点分别串成两条链表，最后拼接。
function oddEvenList2(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  const oddDummy = new ListNode();
  const evenDummy = new ListNode();
  let oddTail = oddDummy;
  let evenTail = evenDummy;
  let curr: ListNode | null = head;
  let index = 1;

  while (curr !== null) {
    if (index % 2 === 1) {
      // 奇数位
      oddTail.next = curr;
      oddTail = curr;
    } else {
      // 偶数位
      evenTail.next = curr;
      evenTail = curr;
    }
    curr = curr.next;
    index++;
  }

  // 拼接：奇数链表尾接偶数链表头
  oddTail.next = evenDummy.next;
  evenTail.next = null; // 断开尾部，防止成环
  return oddDummy.next;
}

// 测试
console.log("===== 028. 奇偶链表 =====");
console.log("方法1：[1,2,3,4,5] ->", listToArray(oddEvenList(arrayToList([1, 2, 3, 4, 5])))); // [1,3,5,2,4]
console.log(
  "方法1：[2,1,3,5,6,4,7] ->",
  listToArray(oddEvenList(arrayToList([2, 1, 3, 5, 6, 4, 7]))),
); // [2,3,6,7,1,5,4]
console.log("方法1：[1] ->", listToArray(oddEvenList(arrayToList([1])))); // [1]
console.log("方法2：[1,2,3,4,5] ->", listToArray(oddEvenList2(arrayToList([1, 2, 3, 4, 5])))); // [1,3,5,2,4]
console.log(
  "方法2：[2,1,3,5,6,4,7] ->",
  listToArray(oddEvenList2(arrayToList([2, 1, 3, 5, 6, 4, 7]))),
); // [2,3,6,7,1,5,4]

export {};
