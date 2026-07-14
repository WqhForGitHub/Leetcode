// ============================================================
// 006. K 个一组翻转链表
// ============================================================
// LeetCode 25. Reverse Nodes in k-Group
// 给你链表的头节点 head，每 k 个节点一组进行翻转，请你返回修改后的链表。
// 如果节点总数不是 k 的整数倍，请将最后剩余的节点保持原有顺序。
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

// 方法1：迭代法（推荐）
// 先判断是否有 k 个节点，有则翻转这 k 个，连接到已处理部分
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prevGroupEnd = dummy; // 上一组翻转后的尾节点

  while (true) {
    // 检查是否还有 k 个节点
    let kth = prevGroupEnd;
    for (let i = 0; i < k; i++) {
      kth = kth.next!;
      if (kth === null) {
        // 不足 k 个，直接返回
        return dummy.next;
      }
    }

    const groupStart = prevGroupEnd.next!; // 当前组的头节点
    const nextGroupStart = kth.next; // 下一组的头节点

    // 翻转从 groupStart 到 kth 的 k 个节点
    let prev: ListNode | null = nextGroupStart;
    let cur: ListNode | null = groupStart;
    while (cur !== nextGroupStart) {
      const tmp: ListNode | null = cur!.next;
      cur!.next = prev;
      prev = cur;
      cur = tmp;
    }

    // 连接：上一组尾 -> 当前组翻转后的头(kth)
    prevGroupEnd.next = kth;
    // 更新 prevGroupEnd 为当前组翻转后的尾(groupStart)
    prevGroupEnd = groupStart;
  }
}

// 方法2：递归法
// 递归翻转每组 k 个节点
function reverseKGroup2(head: ListNode | null, k: number): ListNode | null {
  // 检查是否还有 k 个节点
  let cur = head;
  for (let i = 0; i < k; i++) {
    if (cur === null) return head; // 不足 k 个，不翻转
    cur = cur.next;
  }

  // 翻转前 k 个节点
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  for (let i = 0; i < k; i++) {
    const tmp = curr!.next;
    curr!.next = prev;
    prev = curr;
    curr = tmp;
  }

  // head 翻转后变为尾，连接递归翻转后的剩余部分
  head!.next = reverseKGroup2(curr, k);

  // prev 是翻转后的新头
  return prev;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. K 个一组翻转链表 =====");
// [1,2,3,4,5], k=2 => [2,1,4,3,5]
console.log("结果:", listToArray(reverseKGroup(arrayToList([1, 2, 3, 4, 5]), 2)));
// [1,2,3,4,5], k=3 => [3,2,1,4,5]
console.log("结果:", listToArray(reverseKGroup(arrayToList([1, 2, 3, 4, 5]), 3)));
// [1,2,3,4,5], k=1 => [1,2,3,4,5]
console.log("结果:", listToArray(reverseKGroup(arrayToList([1, 2, 3, 4, 5]), 1)));

export {};
