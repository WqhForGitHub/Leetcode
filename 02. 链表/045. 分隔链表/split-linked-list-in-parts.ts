// ============================================================
// 045. 分隔链表
// ============================================================
// LeetCode 725. Split Linked List in Parts
// 给定头节点 head 和整数 k，把链表分隔成 k 个连续部分，各部分长度差距不超过 1，
// 且前面的部分长度 >= 后面的部分长度。
// 方法：先计算总长度 n，每部分宽度 = n / k，前 n % k 部分多 1 个节点。遍历切分。
// 时间复杂度：O(n)，空间复杂度：O(k)（结果数组）

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function splitListToParts(head: ListNode | null, k: number): Array<ListNode | null> {
  // 1. 计算链表总长度
  let n = 0;
  let cur: ListNode | null = head;
  while (cur) {
    n++;
    cur = cur.next;
  }

  // 2. 每部分基础长度，以及前 remainder 部分多 1 个
  const base = Math.floor(n / k);
  let remainder = n % k;

  const result: Array<ListNode | null> = [];
  cur = head;

  // 3. 逐段切分
  for (let i = 0; i < k; i++) {
    // 当前段长度
    const partSize = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    if (partSize === 0 || !cur) {
      result.push(null);
      continue;
    }

    // 当前段头节点
    const partHead = cur;
    // 走到当前段最后一个节点
    for (let j = 0; j < partSize - 1; j++) {
      cur = cur!.next;
    }
    // 断开
    const nextSeg = cur!.next;
    cur!.next = null;
    cur = nextSeg;

    result.push(partHead);
  }

  return result;
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

function testSplit(): void {
  const head = arrayToList([1, 2, 3]);
  const parts = splitListToParts(head, 5);
  console.log(parts.map((p) => listToArray(p))); // [[1],[2],[3],[],[]]

  const head2 = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const parts2 = splitListToParts(head2, 3);
  console.log(parts2.map((p) => listToArray(p))); // [[1,2,3,4],[5,6,7],[8,9,10]]
}

testSplit();

export {};
