// ============================================================
// 046. 链表组件
// ============================================================
// LeetCode 817. Linked List Components
// 给定链表头节点 head 和数组 nums（nums 中元素各不相同，且都是链表中的值）。
// 组件定义为链表中一段极长的、所有值都在 nums 中的连续子链表。
// 返回链表中组件的数量。
// 方法：用 Set 存 nums，遍历链表统计连续组件数：
//   当当前节点在 Set 中，且（下一个节点不在 Set 中 或 下一节点为 null）时，组件数 +1。
// 时间复杂度：O(n + m)，空间复杂度：O(m)

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function numComponents(head: ListNode | null, nums: number[]): number {
  const set = new Set<number>(nums);
  let count = 0;
  let cur: ListNode | null = head;
  while (cur) {
    // 当前节点在集合中，且是组件的末尾（下一个不在集合或为 null），组件数 +1
    if (set.has(cur.val) && (!cur.next || !set.has(cur.next.val))) {
      count++;
    }
    cur = cur.next;
  }
  return count;
}

// ----------------------- 辅助函数与测试 -----------------------
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

function testComponents(): void {
  // 0 -> 1 -> 2 -> 3, nums = [0,1,3] => 2 个组件 [0,1] 和 [3]
  console.log(numComponents(arrayToList([0, 1, 2, 3]), [0, 1, 3])); // 2

  // 0 -> 1 -> 2 -> 3 -> 4, nums = [0,3,1,4] => 2 个组件 [0,1] 和 [3,4]
  console.log(numComponents(arrayToList([0, 1, 2, 3, 4]), [0, 3, 1, 4])); // 2

  // 单节点
  console.log(numComponents(arrayToList([0]), [0])); // 1
}

testComponents();

export {};
