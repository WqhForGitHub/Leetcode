// ============================================================
// 157. 链表组件
// ============================================================
// LeetCode 817. Linked List Components
// 给定链表头 head 和数组 nums（链表中值的子集），链表中连续若干节点的值若都在 nums 中，
// 视为一个组件。返回组件数。
// 时间复杂度：O(n)；空间复杂度：O(m)，m 为 nums 长度

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function numComponents(head: ListNode | null, nums: number[]): number {
  // 哈希集合存 nums
  const numSet = new Set(nums);

  let count = 0;
  let inComponent = false;
  let cur = head;
  while (cur !== null) {
    if (numSet.has(cur.val)) {
      if (!inComponent) {
        count++;
        inComponent = true;
      }
    } else {
      inComponent = false;
    }
    cur = cur.next;
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 157. 链表组件 =====");
// 链表 [0,1,2,3], nums=[0,1,3] -> 组件 [0,1] 和 [3] = 2
const head1 = new ListNode(0, new ListNode(1, new ListNode(2, new ListNode(3))));
console.log(numComponents(head1, [0, 1, 3])); // 期望: 2
// 链表 [0,1,2,3,4], nums=[0,3,1,4] -> 组件 [0,1] [3] [4] = 3? 或按连续定义
const head2 = new ListNode(0, new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4)))));
console.log(numComponents(head2, [0, 3, 1, 4])); // 期望: 2

export {};
