// ============================================================
// 095. 图书整理 I
// ============================================================
// 剑指 Offer 06. 从尾到头打印链表
// 输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。
// 时间复杂度：O(n)，空间复杂度：O(n)（结果数组 + 递归栈/辅助栈）

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

// ------------------------------------------------------------
// 方法1：递归法
// ------------------------------------------------------------
// 递归到链表末尾，回溯时将节点值依次加入结果数组，天然实现逆序。
// 时间 O(n)，空间 O(n)（递归栈）。
function reversePrint(head: ListNode | null): number[] {
  const result: number[] = [];

  function dfs(node: ListNode | null): void {
    if (node === null) return;
    // 先递归到末尾
    dfs(node.next);
    // 回溯时加入结果（从尾到头）
    result.push(node.val);
  }

  dfs(head);
  return result;
}

// ------------------------------------------------------------
// 方法2：栈法（迭代）
// ------------------------------------------------------------
// 先顺序遍历链表将值压入栈，再依次弹出栈顶（即逆序）。
// 时间 O(n)，空间 O(n)（栈）。
function reversePrintStack(head: ListNode | null): number[] {
  const stack: number[] = [];
  let cur = head;
  while (cur !== null) {
    stack.push(cur.val);
    cur = cur.next;
  }
  // 从栈顶弹出即为逆序
  const result: number[] = [];
  while (stack.length > 0) {
    result.push(stack.pop()!);
  }
  return result;
}

// ------------------------------------------------------------
// 方法3：反转链表后遍历
// ------------------------------------------------------------
// 先反转链表，再顺序遍历得到逆序数组，最后可选恢复原链表。
// 时间 O(n)，空间 O(n)（结果数组），不依赖额外递归栈。
function reversePrintReverse(head: ListNode | null): number[] {
  if (head === null) return [];

  // 反转链表
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // 顺序遍历反转后的链表
  const result: number[] = [];
  let cur: ListNode | null = prev;
  while (cur !== null) {
    result.push(cur.val);
    cur = cur.next;
  }

  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：递归法
  const list1 = buildList([1, 3, 2]);
  console.log("测试1 - 递归法:");
  console.log("  原链表: 1 -> 3 -> 2");
  console.log("  逆序输出:", reversePrint(list1));
  console.log("  期望:    [2, 3, 1]");

  // 测试2：栈法
  const list2 = buildList([1, 3, 2]);
  console.log("测试2 - 栈法:");
  console.log("  逆序输出:", reversePrintStack(list2));
  console.log("  期望:    [2, 3, 1]");

  // 测试3：反转链表法
  const list3 = buildList([1, 3, 2]);
  console.log("测试3 - 反转链表法:");
  console.log("  逆序输出:", reversePrintReverse(list3));
  console.log("  期望:    [2, 3, 1]");

  // 测试4：空链表
  console.log("测试4 - 空链表:");
  console.log("  递归法:", reversePrint(null), "(期望 [])");
  console.log("  栈法:", reversePrintStack(null), "(期望 [])");
  console.log("  反转法:", reversePrintReverse(null), "(期望 [])");

  // 测试5：单节点
  const list5 = buildList([5]);
  console.log("测试5 - 单节点:");
  console.log("  逆序输出:", reversePrint(list5));
  console.log("  期望:    [5]");

  // 测试6：较长链表
  const list6 = buildList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  console.log("测试6 - 较长链表:");
  console.log("  逆序输出:", reversePrintStack(list6));
  console.log("  期望:    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]");
}

test();

export {};
