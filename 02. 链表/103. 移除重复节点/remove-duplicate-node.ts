// ============================================================
// 103. 移除重复节点
// ============================================================
// 面试题 02.01. 移除重复节点
// 编写代码，移除未排序链表中的重复节点，保留最开始出现的节点。
// 时间复杂度：O(n)（哈希表）/ O(n²)（无缓冲）

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
// 方法一：哈希表（Set）
// ============================================================
// 使用 Set 记录已出现过的值，遍历链表删除重复节点。
// 时间复杂度 O(n)，空间复杂度 O(n)。
function removeDuplicateNodes(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  const seen = new Set<number>();
  seen.add(head.val);

  let cur: ListNode | null = head;
  while (cur !== null && cur.next !== null) {
    const next = cur.next;
    if (seen.has(next.val)) {
      // 跳过重复节点
      cur.next = next.next;
    } else {
      seen.add(next.val);
      cur = cur.next;
    }
  }

  return head;
}

// ============================================================
// 方法二：不使用临时缓冲区（双重循环）
// ============================================================
// 对每个节点，向后扫描删除所有与其值相同的节点。
// 时间复杂度 O(n²)，空间复杂度 O(1)。
function removeDuplicateNodesNoBuffer(head: ListNode | null): ListNode | null {
  let cur: ListNode | null = head;
  while (cur !== null) {
    // 内层指针 runner 从 cur.next 开始，删除所有与 cur.val 相同的节点
    let runner: ListNode | null = cur;
    while (runner.next !== null) {
      if (runner.next.val === cur.val) {
        runner.next = runner.next.next;
      } else {
        runner = runner.next;
      }
    }
    cur = cur.next;
  }
  return head;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,3,3,2,1] -> [1,2,3]
  console.log(
    "测试1（哈希表）:",
    listToArray(removeDuplicateNodes(arrayToList([1, 2, 3, 3, 2, 1])))
  ); // [1,2,3]
  console.log(
    "测试1（无缓冲）:",
    listToArray(removeDuplicateNodesNoBuffer(arrayToList([1, 2, 3, 3, 2, 1])))
  ); // [1,2,3]

  // 测试用例 2: [1,1,1,1,2] -> [1,2]
  console.log("测试2:", listToArray(removeDuplicateNodes(arrayToList([1, 1, 1, 1, 2])))); // [1,2]
  console.log(
    "测试2（无缓冲）:",
    listToArray(removeDuplicateNodesNoBuffer(arrayToList([1, 1, 1, 1, 2])))
  ); // [1,2]

  // 测试用例 3: 空链表
  console.log("测试3:", listToArray(removeDuplicateNodes(arrayToList([])))); // []

  // 测试用例 4: 无重复 [1,2,3]
  console.log("测试4:", listToArray(removeDuplicateNodes(arrayToList([1, 2, 3])))); // [1,2,3]
}

test();

export {};
