// ============================================================
// 107. 链表求和
// ============================================================
// 面试题 02.05. 链表求和
// 给定两个用链表表示的数字，数位正向存放（最高位在链表首部），
// 返回这两个数之和的链表。
// 例如 (6 -> 1 -> 7) + (2 -> 9 -> 5) = 617 + 295 = 912 -> (9 -> 1 -> 2)
// 时间复杂度：O(max(m, n))，空间复杂度：O(max(m, n))

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
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
  const res: number[] = [];
  let cur = head;
  while (cur !== null) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

// 反转链表辅助函数
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur: ListNode | null = head;
  while (cur !== null) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// ============================================================
// 方法一：栈
// ============================================================
// 正向存放意味着低位在链表尾部，故用栈从尾部开始取数。
// 将两个链表的值分别压入栈，再依次弹栈相加（先得到的是低位），
// 通过头插法构建结果链表。
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const stack1: number[] = [];
  const stack2: number[] = [];

  while (l1 !== null) {
    stack1.push(l1.val);
    l1 = l1.next;
  }
  while (l2 !== null) {
    stack2.push(l2.val);
    l2 = l2.next;
  }

  let carry = 0;
  let head: ListNode | null = null;

  while (stack1.length > 0 || stack2.length > 0 || carry > 0) {
    const sum =
      carry + (stack1.length > 0 ? stack1.pop()! : 0) + (stack2.length > 0 ? stack2.pop()! : 0);
    // 头插法：新节点插到链表头部（先算出的是低位，应放尾部）
    const node = new ListNode(sum % 10);
    node.next = head;
    head = node;
    carry = Math.floor(sum / 10);
  }

  return head;
}

// ============================================================
// 方法二：反转后相加再反转
// ============================================================
// 先将两个链表反转为低位在前，按常规方式相加，
// 最后将结果链表再次反转，得到正向存放的结果。
function addTwoNumbersByReverse(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  // 反转两个输入链表（低位在前）
  let r1 = reverseList(l1);
  let r2 = reverseList(l2);

  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;

  while (r1 !== null || r2 !== null || carry > 0) {
    const sum = carry + (r1 !== null ? r1.val : 0) + (r2 !== null ? r2.val : 0);
    cur.next = new ListNode(sum % 10);
    cur = cur.next;
    carry = Math.floor(sum / 10);
    if (r1 !== null) r1 = r1.next;
    if (r2 !== null) r2 = r2.next;
  }

  // 反转结果，恢复正向存放
  return reverseList(dummy.next);
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: (6->1->7) + (2->9->5) = 617 + 295 = 912 -> (9->1->2)
  console.log(
    "测试1（栈）:",
    listToArray(addTwoNumbers(arrayToList([6, 1, 7]), arrayToList([2, 9, 5]))),
  ); // [9,1,2]
  console.log(
    "测试1（反转）:",
    listToArray(addTwoNumbersByReverse(arrayToList([6, 1, 7]), arrayToList([2, 9, 5]))),
  ); // [9,1,2]

  // 测试用例 2: (7->1->6) + (5->9->2) = 716 + 592 = 1308 -> (1->3->0->8)
  console.log("测试2:", listToArray(addTwoNumbers(arrayToList([7, 1, 6]), arrayToList([5, 9, 2])))); // [1,3,0,8]
  console.log(
    "测试2（反转）:",
    listToArray(addTwoNumbersByReverse(arrayToList([7, 1, 6]), arrayToList([5, 9, 2]))),
  ); // [1,3,0,8]

  // 测试用例 3: 长度不等 (9->9) + (1) = 99 + 1 = 100 -> (1->0->0)
  console.log("测试3:", listToArray(addTwoNumbers(arrayToList([9, 9]), arrayToList([1])))); // [1,0,0]

  // 测试用例 4: 一个为空
  console.log("测试4:", listToArray(addTwoNumbers(arrayToList([1, 2]), null))); // [1,2]
}

test();

export {};
