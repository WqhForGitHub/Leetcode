// ============================================================
// 075. 翻倍以链表形式表示的数字
// ============================================================
// LeetCode 2816. Double a Number Represented as a Linked List
// 给定一个表示非负整数的链表（每个节点存一位数字，最高位在前），
// 将该数字翻倍并返回结果链表。
// 方法1：反转链表 -> 翻倍处理进位 -> 反转回来
// 方法2：递归处理进位
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n)（方法2递归栈）

// 链表节点定义
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
// 方法1：反转链表 -> 翻倍处理进位 -> 反转回来（推荐）
// ============================================================
// 思路：
//   1. 先反转链表，使最低位在前，便于从低位向高位处理进位
//   2. 从低位开始翻倍，维护进位 carry
//   3. 处理完毕后若仍有进位，追加新节点
//   4. 反转回来得到最终结果
// 时间复杂度 O(n)，空间复杂度 O(1)
function doubleIt(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  // 1. 反转链表
  let reversedHead = reverseList(head);

  // 2. 从低位开始翻倍，处理进位
  let cur: ListNode | null = reversedHead;
  let prev: ListNode | null = null;
  let carry = 0;
  while (cur !== null) {
    const doubled = cur.val * 2 + carry;
    cur.val = doubled % 10;
    carry = Math.floor(doubled / 10);
    prev = cur;
    cur = cur.next;
  }

  // 3. 若仍有进位，追加新节点
  if (carry > 0 && prev !== null) {
    prev.next = new ListNode(carry);
  }

  // 4. 反转回来
  return reverseList(reversedHead);
}

// ============================================================
// 方法2：递归处理进位
// ============================================================
// 思路：递归到链表末尾，回溯时处理翻倍与进位。
// 返回值表示向高位的进位（0 或 1）。
// 时间复杂度 O(n)，空间复杂度 O(n)（递归栈）
function doubleItRecursive(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  // 递归处理，返回进位
  const carry = doubleHelper(head);
  // 若最高位仍有进位，需要在头部插入新节点
  if (carry > 0) {
    return new ListNode(carry, head);
  }
  return head;
}

// 递归辅助函数：返回进位
function doubleHelper(node: ListNode | null): number {
  if (node === null) return 0;

  // 递归处理下一位
  const carryFromNext = doubleHelper(node.next);
  const doubled = node.val * 2 + carryFromNext;
  node.val = doubled % 10;
  return Math.floor(doubled / 10);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 翻倍以链表形式表示的数字 =====");

// [1,8,9] -> 189 * 2 = 378 -> [3,7,8]
console.log("方法1:", listToArray(doubleIt(arrayToList([1, 8, 9]))));
// [9,9,9] -> 999 * 2 = 1998 -> [1,9,9,8]
console.log("方法1:", listToArray(doubleIt(arrayToList([9, 9, 9]))));
// [0] -> 0 * 2 = 0 -> [0]
console.log("方法1:", listToArray(doubleIt(arrayToList([0]))));

// 方法2 测试
console.log("方法2:", listToArray(doubleItRecursive(arrayToList([1, 8, 9])))); // [3,7,8]
console.log("方法2:", listToArray(doubleItRecursive(arrayToList([9, 9, 9])))); // [1,9,9,8]
console.log("方法2:", listToArray(doubleItRecursive(arrayToList([0])))); // [0]

export {};
