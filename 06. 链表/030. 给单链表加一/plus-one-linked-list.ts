// ============================================================
// 030. 给单链表加一
// ============================================================
// LeetCode 369. Plus One Linked List
// 给定一个用单链表表示的非负整数（头节点是最高位），对该整数加一并返回结果链表。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1/3）/ O(n)（方法2）

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

// ============================================================
// 方法1：反转链表 -> 加1处理进位 -> 反转回来（推荐）
// ============================================================
// 反转后低位在前，方便从低位开始处理进位。
// 时间复杂度 O(n)，空间复杂度 O(1)
function plusOne(head: ListNode | null): ListNode | null {
  if (head === null) return new ListNode(1);

  // 1. 反转链表（低位在前）
  const curr = reverseList(head);

  // 2. 加一并处理进位
  let carry = 1;
  let node: ListNode | null = curr;
  while (node !== null && carry > 0) {
    const sum = node.val + carry;
    node.val = sum % 10;
    carry = Math.floor(sum / 10);
    if (node.next === null && carry > 0) {
      // 需要新增节点
      node.next = new ListNode(carry);
      carry = 0;
    }
    node = node.next;
  }

  // 3. 反转回来
  return reverseList(curr);
}

// ============================================================
// 方法2：递归处理
// ============================================================
// 递归到链表末尾，从末尾开始加一，返回进位。
// 时间复杂度 O(n)，空间复杂度 O(n)（递归栈）
function plusOneRecursive(head: ListNode | null): ListNode | null {
  // 返回进位
  const helper = (node: ListNode | null): number => {
    if (node === null) return 1; // 空节点返回进位1（相当于加一）
    const carry = helper(node.next);
    const sum = node.val + carry;
    node.val = sum % 10;
    return Math.floor(sum / 10);
  };

  const carry = helper(head);
  if (carry > 0) {
    // 最高位有进位，需要新增头节点
    const newHead = new ListNode(carry);
    newHead.next = head;
    return newHead;
  }
  return head;
}

// ============================================================
// 方法3：找最后一个非9节点（最优，不修改链表结构）
// ============================================================
// 找到最后一个值不为9的节点，该节点值+1，后面所有节点（都是9）变为0。
// 如果所有节点都是9，则新建头节点1，原链表所有节点变0。
// 时间复杂度 O(n)，空间复杂度 O(1)
function plusOneFindLastNon9(head: ListNode | null): ListNode | null {
  if (head === null) return new ListNode(1);

  // 使用哨兵节点处理所有节点都是9的情况
  const dummy = new ListNode(0);
  dummy.next = head;

  // 找到最后一个值不为9的节点
  let lastNon9: ListNode = dummy;
  let curr: ListNode | null = head;
  while (curr !== null) {
    if (curr.val !== 9) {
      lastNon9 = curr;
    }
    curr = curr.next;
  }

  // 该节点值加1
  lastNon9.val++;
  // 后面所有节点（都是9）变为0
  let node: ListNode | null = lastNon9.next;
  while (node !== null) {
    node.val = 0;
    node = node.next;
  }

  // 如果哨兵节点值变成1，说明所有节点原本都是9，需要返回哨兵
  return dummy.val === 1 ? dummy : dummy.next;
}

// 测试
console.log("===== 030. 给单链表加一 =====");
console.log("方法1：[1,2,3] ->", listToArray(plusOne(arrayToList([1, 2, 3])))); // [1,2,4]
console.log("方法1：[9,9,9] ->", listToArray(plusOne(arrayToList([9, 9, 9])))); // [1,0,0,0]
console.log("方法1：[0] ->", listToArray(plusOne(arrayToList([0])))); // [1]
console.log("方法2：[1,2,3] ->", listToArray(plusOneRecursive(arrayToList([1, 2, 3])))); // [1,2,4]
console.log("方法2：[9,9,9] ->", listToArray(plusOneRecursive(arrayToList([9, 9, 9])))); // [1,0,0,0]
console.log("方法3：[1,2,3] ->", listToArray(plusOneFindLastNon9(arrayToList([1, 2, 3])))); // [1,2,4]
console.log("方法3：[9,9,9] ->", listToArray(plusOneFindLastNon9(arrayToList([9, 9, 9])))); // [1,0,0,0]
console.log("方法3：[8,9,9] ->", listToArray(plusOneFindLastNon9(arrayToList([8, 9, 9])))); // [9,0,0]

export {};
