// ============================================================
// 099. 训练计划 IV
// ============================================================
// 剑指 Offer 25. 合并两个排序的链表
// 输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。
// 时间复杂度：O(n + m)，空间复杂度：O(1)（迭代）/ O(n + m)（递归栈）

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

// ============================================================
// 方法一：迭代 + dummy 哑节点
// ============================================================
// 使用哑节点简化头节点处理，每次取较小节点接到结果链表后。
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(-1);
  let cur = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }

  // 将剩余部分直接接入
  cur.next = l1 !== null ? l1 : l2;

  return dummy.next;
}

// ============================================================
// 方法二：递归
// ============================================================
// 比较两个头节点，较小者的 next 指向其余部分的合并结果。
function mergeTwoListsRecursive(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  if (l1 === null) return l2;
  if (l2 === null) return l1;

  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoListsRecursive(l1, l2.next);
    return l2;
  }
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,4] + [1,3,4] -> [1,1,2,3,4,4]
  console.log(
    "测试1（迭代）:",
    listToArray(mergeTwoLists(arrayToList([1, 2, 4]), arrayToList([1, 3, 4])))
  ); // [1,1,2,3,4,4]
  console.log(
    "测试1（递归）:",
    listToArray(mergeTwoListsRecursive(arrayToList([1, 2, 4]), arrayToList([1, 3, 4])))
  ); // [1,1,2,3,4,4]

  // 测试用例 2: 空链表
  console.log("测试2:", listToArray(mergeTwoLists(arrayToList([]), arrayToList([])))); // []

  // 测试用例 3: 一个空一个非空
  console.log("测试3:", listToArray(mergeTwoLists(arrayToList([]), arrayToList([0])))); // [0]

  // 测试用例 4
  console.log("测试4:", listToArray(mergeTwoLists(arrayToList([1, 3, 5]), arrayToList([2, 4, 6])))); // [1,2,3,4,5,6]
}

test();

export {};
