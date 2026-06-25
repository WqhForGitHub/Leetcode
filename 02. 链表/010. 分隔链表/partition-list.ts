// ============================================================
// 010. 分隔链表
// ============================================================
// LeetCode 86. Partition List
// 给你一个链表的头节点 head 和一个特定值 x，请你对链表进行分隔，
// 使得所有小于 x 的节点都出现在大于或等于 x 的节点之前。
// 你应当保留两个分区中每个节点的初始相对位置。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 节点定义
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

// 方法1：拆分合并（推荐）
// 用两个子链表分别存小于 x 和大于等于 x 的节点，最后拼接
function partition(head: ListNode | null, x: number): ListNode | null {
  // 小于 x 的子链表
  const smallDummy = new ListNode();
  let small = smallDummy;
  // 大于等于 x 的子链表
  const largeDummy = new ListNode();
  let large = largeDummy;

  let cur = head;
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
  large.next = null; // 断开 large 的尾部，防止成环

  return smallDummy.next;
}

// 方法2：头插法
// 将小于 x 的节点逐个插入到分区点之前
function partition2(head: ListNode | null, x: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy; // 指向已处理部分的最后一个节点（分区点）
  let cur = head;

  while (cur !== null && cur.val < x) {
    prev = cur;
    cur = cur.next;
  }

  // 此时 prev 之后都是 >= x 的节点
  let scan = prev;
  while (cur !== null) {
    if (cur.val < x) {
      // 将 cur 节点移到 prev 之后
      const nextNode = cur.next;
      cur.next = prev.next;
      prev.next = cur;
      prev = cur; // 分区点前移

      // scan 跳过已移走的节点
      scan.next = nextNode;
      cur = nextNode;
    } else {
      scan = cur;
      cur = cur.next;
    }
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 分隔链表 =====");
// [1,4,3,2,5,2], x=3 => [1,2,2,4,3,5]
console.log("结果:", listToArray(partition(arrayToList([1, 4, 3, 2, 5, 2]), 3)));
// [2,1], x=2 => [1,2]
console.log("结果:", listToArray(partition(arrayToList([2, 1]), 2)));
// [], x=1 => []
console.log("结果:", listToArray(partition(arrayToList([]), 1)));

export {};
