// ============================================================
// 089. 回文链表
// ============================================================
// LeetCode 234. Palindrome Linked List
// 给你单链表的头节点 head，请你判断该链表是否为回文链表。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n)（方法2）

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：由数组构建链表
function buildList(arr: number[]): ListNode | null {
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
  const arr: number[] = [];
  let cur = head;
  while (cur) {
    arr.push(cur.val);
    cur = cur.next;
  }
  return arr;
}

// ------------------------------------------------------------
// 方法1：快慢指针 + 反转后半部分 + 比较
// ------------------------------------------------------------
// 1. 快慢指针找到链表中点。
// 2. 反转后半部分链表。
// 3. 同时遍历前半部分和反转后的后半部分，逐节点比较。
// 4. （可选）恢复链表。
// 空间复杂度 O(1)。
function isPalindrome(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;

  // 第一步：快慢指针找中点
  let slow: ListNode = head;
  let fast: ListNode = head;
  // slow 最终停在前半部分最后一个节点（偶数）或正中节点（奇数）
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 第二步：反转后半部分（从 slow.next 开始）
  let secondHalf: ListNode | null = reverseList(slow.next);

  // 第三步：逐节点比较前半部分与反转后的后半部分
  let p1: ListNode | null = head;
  let p2: ListNode | null = secondHalf;
  let result = true;
  while (p2 !== null) {
    if (p1!.val !== p2.val) {
      result = false;
      break;
    }
    p1 = p1!.next;
    p2 = p2.next;
  }

  // 第四步（可选）：恢复链表，将后半部分再反转回去
  slow.next = reverseList(secondHalf);

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

// ------------------------------------------------------------
// 方法2：递归法（利用递归栈反向遍历）
// ------------------------------------------------------------
// 利用递归天然回溯的特性，递归到链表末尾后回溯时即从尾到头遍历。
// 配合一个指向头节点的前向指针，正向和反向同步比较。
// 注意：此方法空间复杂度为 O(n)（递归栈），可能栈溢出。
function isPalindromeRecursive(head: ListNode | null): boolean {
  // 用对象包装 front 指针，使其在递归中可变
  const state = { front: head };

  function recursivelyCheck(curr: ListNode | null): boolean {
    if (curr !== null) {
      // 先递归到链表末尾
      if (!recursivelyCheck(curr.next)) {
        return false;
      }
      // 回溯时比较：curr 从尾部前进，state.front 从头部前进
      if (state.front!.val !== curr.val) {
        return false;
      }
      state.front = state.front!.next;
    }
    return true;
  }

  return recursivelyCheck(head);
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：回文链表 [1,2,2,1]
  const list1 = buildList([1, 2, 2, 1]);
  console.log("测试1 - 快慢指针法:");
  console.log("  链表:", listToArray(list1));
  console.log("  是否回文:", isPalindrome(list1));
  console.log("  期望: true");

  // 测试2：非回文 [1,2]
  const list2 = buildList([1, 2]);
  console.log("测试2 - 递归法:");
  console.log("  链表:", listToArray(list2));
  console.log("  是否回文:", isPalindromeRecursive(list2));
  console.log("  期望: false");

  // 测试3：奇数长度回文 [1,2,1]
  const list3 = buildList([1, 2, 1]);
  console.log("测试3 - 奇数回文:");
  console.log("  链表:", listToArray(list3));
  console.log("  是否回文:", isPalindrome(list3));
  console.log("  期望: true");

  // 测试4：单节点
  const list4 = buildList([1]);
  console.log("测试4 - 单节点:");
  console.log("  是否回文:", isPalindrome(list4));
  console.log("  期望: true");

  // 测试5：空链表
  const list5 = buildList([]);
  console.log("测试5 - 空链表:");
  console.log("  是否回文:", isPalindrome(list5));
  console.log("  期望: true");

  // 测试6：恢复链表验证
  const list6 = buildList([1, 2, 3, 2, 1]);
  console.log("测试6 - 恢复链表验证:");
  console.log("  原链表:", listToArray(list6));
  const res6 = isPalindrome(list6);
  console.log("  是否回文:", res6, "(期望 true)");
  console.log("  恢复后:", listToArray(list6));
  console.log("  期望恢复: [1, 2, 3, 2, 1]");
}

test();

export {};
