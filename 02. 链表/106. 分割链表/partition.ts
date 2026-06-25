// ============================================================
// 106. 分割链表
// ============================================================
// 面试题 02.04. 分割链表
// 给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，
// 使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。
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
// 方法一：拆分两个子链表后拼接
// ============================================================
// 用两个哑节点分别构建「小于 x」和「大于等于 x」的子链表，
// 最后将两个子链表拼接，小于链表的尾指向大于等于链表的头。
function partition(head: ListNode | null, x: number): ListNode | null {
  // 小于 x 的子链表
  const smallDummy = new ListNode(0);
  let small = smallDummy;
  // 大于等于 x 的子链表
  const largeDummy = new ListNode(0);
  let large = largeDummy;

  let cur: ListNode | null = head;
  while (cur !== null) {
    if (cur.val < x) {
      small.next = cur;
      small = small.next;
    } else {
      large.next = cur;
      large = large.next;
    }
    cur = cur.next;
  }

  // 拼接两个子链表
  small.next = largeDummy.next;
  large.next = null; // 断开尾部，防止环

  return smallDummy.next;
}

// ============================================================
// 方法二：头插法（将小于 x 的节点逐个插到头部）
// ============================================================
// 维护一个新链表头，遍历原链表，
// 遇到小于 x 的节点插入到分隔点之前，其余保持。
// 这里采用：分别收集小于和不小于的节点，与方法一思路相同但合并到一个循环中。
function partitionTwoPointers(head: ListNode | null, x: number): ListNode | null {
  const beforeDummy = new ListNode(0);
  const afterDummy = new ListNode(0);
  let before = beforeDummy;
  let after = afterDummy;

  let cur: ListNode | null = head;
  while (cur !== null) {
    const next: ListNode | null = cur.next;
    cur.next = null; // 先断开
    if (cur.val < x) {
      before.next = cur;
      before = cur;
    } else {
      after.next = cur;
      after = cur;
    }
    cur = next;
  }

  before.next = afterDummy.next;
  return beforeDummy.next;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,4,3,2,5,2], x=3 -> [1,2,2,4,3,5]（相对顺序：小在前）
  console.log("测试1（拼接）:", listToArray(partition(arrayToList([1, 4, 3, 2, 5, 2]), 3)));
  console.log(
    "测试1（双指针）:",
    listToArray(partitionTwoPointers(arrayToList([1, 4, 3, 2, 5, 2]), 3))
  );

  // 测试用例 2: [2,1], x=2 -> [1,2]
  console.log("测试2:", listToArray(partition(arrayToList([2, 1]), 2))); // [1,2]

  // 测试用例 3: 空链表
  console.log("测试3:", listToArray(partition(arrayToList([]), 3))); // []

  // 测试用例 4: 全部小于 x
  console.log("测试4:", listToArray(partition(arrayToList([1, 2, 3]), 5))); // [1,2,3]
}

test();

export {};
