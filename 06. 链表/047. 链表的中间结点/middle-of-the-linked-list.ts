// ============================================================
// 047. 链表的中间结点
// ============================================================
// LeetCode 876. Middle of the Linked List
// 给定单链表头节点 head，返回链表的中间节点。如果有两个中间节点，则返回第二个中间节点。
// 方法1：快慢指针（快指针走 2 步，慢指针走 1 步），快指针到尾时慢指针在中点。
// 方法2：先遍历计算长度，再走一半。
// 时间复杂度：O(n)，空间复杂度：O(1)

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 方法1：快慢指针
function middleNode(head: ListNode | null): ListNode | null {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  // 快指针走两步，慢指针走一步；快指针到尾时慢指针正好在中点
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

// 方法2：两次遍历
function middleNodeByCount(head: ListNode | null): ListNode | null {
  let n = 0;
  let cur: ListNode | null = head;
  while (cur) {
    n++;
    cur = cur.next;
  }
  // 第二个中点 = 第 floor(n/2) 个节点（0 起索引）
  let k = Math.floor(n / 2);
  cur = head;
  while (k > 0) {
    cur = cur!.next;
    k--;
  }
  return cur;
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

function listToArray(head: ListNode | null): number[] {
  const res: number[] = [];
  let cur = head;
  while (cur) {
    res.push(cur.val);
    cur = cur.next;
  }
  return res;
}

function testMiddle(): void {
  // [1,2,3,4,5] => 中点 3
  console.log(listToArray(middleNode(arrayToList([1, 2, 3, 4, 5])))); // [3,4,5]
  // [1,2,3,4,5,6] => 两个中点取第二个 => 4
  console.log(listToArray(middleNode(arrayToList([1, 2, 3, 4, 5, 6])))); // [4,5,6]

  // 方法2
  console.log(listToArray(middleNodeByCount(arrayToList([1, 2, 3, 4, 5])))); // [3,4,5]
  console.log(listToArray(middleNodeByCount(arrayToList([1, 2, 3, 4, 5, 6])))); // [4,5,6]
}

testMiddle();

export {};
