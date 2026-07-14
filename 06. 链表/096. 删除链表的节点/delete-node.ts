// ============================================================
// 096. 删除链表的节点
// ============================================================
// 剑指 Offer 18. 删除链表的节点
// 给定单向链表的头节点 head 和一个要删除的节点的值 val，
// 删除链表中所有值为 val 的节点，返回删除后的链表头节点。
// 时间复杂度：O(n)，空间复杂度：O(1)

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
// 方法1：dummy 哨兵节点 + 遍历删除
// ------------------------------------------------------------
// 使用 dummy 哨兵节点指向 head，统一处理头节点可能被删除的情况。
// 用 prev 和 curr 双指针遍历，当 curr.val === val 时将 prev.next 指向 curr.next。
// 注意：可能有多个值为 val 的节点，需要连续删除。
function deleteNode(head: ListNode | null, val: number): ListNode | null {
  // 哨兵节点，简化头节点删除
  const dummy = new ListNode(0, head);
  let prev = dummy;
  let curr: ListNode | null = head;

  while (curr !== null) {
    if (curr.val === val) {
      // 删除 curr 节点
      prev.next = curr.next;
      curr = curr.next;
      // 连续删除后续相同值的节点（不移动 prev，因为新 curr 可能也需删除）
    } else {
      prev = curr;
      curr = curr.next;
    }
  }

  return dummy.next;
}

// ------------------------------------------------------------
// 方法2：仅删除第一个匹配节点（原题意：保证值各不相同，删除第一个）
// ------------------------------------------------------------
// 原剑指Offer题目保证链表中节点值各不相同，只需删除第一个匹配的节点。
function deleteNodeFirst(head: ListNode | null, val: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  let curr: ListNode | null = head;

  while (curr !== null) {
    if (curr.val === val) {
      // 删除第一个匹配节点后立即返回
      prev.next = curr.next;
      break;
    }
    prev = curr;
    curr = curr.next;
  }

  return dummy.next;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：删除中间节点
  const list1 = buildList([4, 5, 1, 9]);
  console.log("测试1 - 删除中间节点:");
  console.log("  原链表:", listToArray(list1));
  const res1 = deleteNode(list1, 5);
  console.log("  删除5后:", listToArray(res1));
  console.log("  期望:  [4, 1, 9]");

  // 测试2：删除头节点
  const list2 = buildList([4, 5, 1, 9]);
  console.log("测试2 - 删除头节点:");
  const res2 = deleteNode(list2, 4);
  console.log("  删除4后:", listToArray(res2));
  console.log("  期望:  [5, 1, 9]");

  // 测试3：删除尾节点
  const list3 = buildList([4, 5, 1, 9]);
  console.log("测试3 - 删除尾节点:");
  const res3 = deleteNode(list3, 9);
  console.log("  删除9后:", listToArray(res3));
  console.log("  期望:  [4, 5, 1]");

  // 测试4：删除不存在的值
  const list4 = buildList([4, 5, 1, 9]);
  console.log("测试4 - 删除不存在的值:");
  const res4 = deleteNode(list4, 100);
  console.log("  删除100后:", listToArray(res4));
  console.log("  期望:  [4, 5, 1, 9]");

  // 测试5：多个相同值的节点
  const list5 = buildList([1, 2, 3, 2, 4, 2]);
  console.log("测试5 - 删除多个相同值:");
  console.log("  原链表:", listToArray(list5));
  const res5 = deleteNode(list5, 2);
  console.log("  删除2后:", listToArray(res5));
  console.log("  期望:  [1, 3, 4]");

  // 测试6：单节点删除
  const list6 = buildList([1]);
  console.log("测试6 - 单节点删除:");
  const res6 = deleteNode(list6, 1);
  console.log("  删除1后:", listToArray(res6));
  console.log("  期望:  []");

  // 测试7：仅删第一个匹配
  const list7 = buildList([1, 2, 3, 2, 4]);
  console.log("测试7 - 仅删第一个匹配:");
  const res7 = deleteNodeFirst(list7, 2);
  console.log("  删除首个2后:", listToArray(res7));
  console.log("  期望:    [1, 3, 2, 4]");
}

test();

export {};
