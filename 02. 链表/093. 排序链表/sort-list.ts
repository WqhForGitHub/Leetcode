// ============================================================
// 093. 排序链表
// ============================================================
// LeetCode 148. Sort List
// 给定链表的头结点 head，请将其按升序排列并返回排序后的链表。
// 要求 O(n log n) 时间复杂度。
// 时间复杂度：O(n log n)，空间复杂度：O(log n) 递归栈（方法1）/ O(1)（方法2）

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
// 方法1：自顶向下归并排序（递归）
// ------------------------------------------------------------
// 1. 快慢指针找中点，将链表一分为二。
// 2. 递归排序左右两半。
// 3. 合并两个有序链表。
// 时间 O(n log n)，空间 O(log n)（递归栈）。
function sortList(head: ListNode | null): ListNode | null {
  // 边界：空或单节点已有序
  if (head === null || head.next === null) {
    return head;
  }

  // 第一步：快慢指针找中点，断开成两段
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  let prev: ListNode | null = null; // 记录 slow 前一个节点用于断开
  while (fast !== null && fast.next !== null) {
    prev = slow;
    slow = slow.next!;
    fast = fast.next.next;
  }
  // 断开
  prev!.next = null;

  // 第二步：递归排序两半
  const left = sortList(head);
  const right = sortList(slow);

  // 第三步：合并两个有序链表
  return merge(left, right);
}

// 合并两个有序链表
function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
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
  cur.next = l1 !== null ? l1 : l2;
  return dummy.next;
}

// ------------------------------------------------------------
// 方法2：自底向上归并排序（迭代，O(1) 额外空间）
// ------------------------------------------------------------
// 从长度为1的子链表开始，两两归并成长度为2的，再归并成长度为4的……直到全部有序。
// 每轮处理：从头开始，每次取两段长度为 subLength 的子链表合并。
// 时间 O(n log n)，空间 O(1)。
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }

  // 计算链表总长度
  let length = 0;
  let node: ListNode | null = head;
  while (node !== null) {
    length++;
    node = node.next;
  }

  // 哨兵节点，简化头节点处理
  const dummy = new ListNode(0, head);

  // 子链表长度从1开始倍增
  let subLength = 1;
  while (subLength < length) {
    let prev: ListNode = dummy;
    let curr: ListNode | null = dummy.next;

    while (curr !== null) {
      // 取第一段长度为 subLength 的子链表
      const head1: ListNode | null = curr;
      let count1 = 1;
      while (curr !== null && count1 < subLength) {
        curr = curr.next;
        count1++;
      }

      // 断开第一段
      let next1: ListNode | null = null;
      if (curr !== null) {
        next1 = curr.next;
        curr.next = null;
      }

      // 取第二段长度为 subLength 的子链表
      const head2: ListNode | null = next1;
      curr = next1;
      let count2 = 1;
      while (curr !== null && count2 < subLength) {
        curr = curr.next;
        count2++;
      }

      // 断开第二段，记录下一轮的起点
      let nextRound: ListNode | null = null;
      if (curr !== null) {
        nextRound = curr.next;
        curr.next = null;
      }

      // 合并两段
      const merged = merge(head1, head2);

      // 将合并结果接回主链表
      prev.next = merged;
      // 移动 prev 到合并后链表的末尾
      while (prev.next !== null) {
        prev = prev.next;
      }

      curr = nextRound;
    }

    subLength *= 2;
  }

  return dummy.next;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：自顶向下归并
  const list1 = buildList([4, 2, 1, 3]);
  console.log("测试1 - 自顶向下归并:");
  console.log("  原链表:", listToArray(list1));
  const res1 = sortList(list1);
  console.log("  排序后:", listToArray(res1));
  console.log("  期望:  [1, 2, 3, 4]");

  // 测试2：自底向上归并
  const list2 = buildList([-1, 5, 3, 4, 0]);
  console.log("测试2 - 自底向上归并:");
  console.log("  原链表:", listToArray(list2));
  const res2 = sortListBottomUp(list2);
  console.log("  排序后:", listToArray(res2));
  console.log("  期望:  [-1, 0, 3, 4, 5]");

  // 测试3：空链表
  const list3 = buildList([]);
  console.log("测试3 - 空链表:");
  console.log("  排序后:", listToArray(sortList(list3)));
  console.log("  期望:  []");

  // 测试4：单节点
  const list4 = buildList([1]);
  console.log("测试4 - 单节点:");
  console.log("  排序后:", listToArray(sortListBottomUp(list4)));
  console.log("  期望:  [1]");

  // 测试5：已排序链表
  const list5 = buildList([1, 2, 3, 4, 5]);
  console.log("测试5 - 已排序:");
  console.log("  排序后:", listToArray(sortList(list5)));
  console.log("  期望:  [1, 2, 3, 4, 5]");

  // 测试6：逆序链表
  const list6 = buildList([5, 4, 3, 2, 1]);
  console.log("测试6 - 逆序:");
  console.log("  排序后:", listToArray(sortListBottomUp(list6)));
  console.log("  期望:  [1, 2, 3, 4, 5]");
}

test();

export {};
