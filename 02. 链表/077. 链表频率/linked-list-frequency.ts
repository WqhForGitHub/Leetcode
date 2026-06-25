// ============================================================
// 077. 链表频率
// ============================================================
// 统计链表中各值出现的频率，返回频率链表（按值升序排序）。
// 例如链表 [1,1,2,2,2,3] -> 频率: 1->2, 2->3, 3->1
// 用 Map 统计频率，再按 key 排序构建结果链表。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 链表节点定义
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

// ============================================================
// 方法1：Map 统计频率 + 按 key 排序构建链表（推荐）
// ============================================================
// 思路：
//   1. 遍历链表，用 Map 记录每个值出现的频率
//   2. 取出所有 key 并升序排序
//   3. 按排序后的顺序构建结果链表，节点值为该值出现的频率
// 时间复杂度 O(n log n)（排序），空间复杂度 O(n)
function frequenciesOfElements(head: ListNode | null): ListNode | null {
  const countMap = new Map<number, number>();

  // 统计频率
  let cur = head;
  while (cur !== null) {
    countMap.set(cur.val, (countMap.get(cur.val) ?? 0) + 1);
    cur = cur.next;
  }

  // 按 key 升序排序
  const sortedKeys = Array.from(countMap.keys()).sort((a, b) => a - b);

  // 构建结果链表，节点值为频率
  const dummy = new ListNode();
  let tail = dummy;
  for (const key of sortedKeys) {
    tail.next = new ListNode(countMap.get(key)!);
    tail = tail.next;
  }

  return dummy.next;
}

// ============================================================
// 方法2：用普通对象 + 数组排序（兼容无 Map 环境）
// ============================================================
// 思路：使用普通对象统计频率，再遍历对象键排序后构建链表。
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function frequenciesOfElementsObject(head: ListNode | null): ListNode | null {
  const count: Record<number, number> = {};

  let cur = head;
  while (cur !== null) {
    count[cur.val] = (count[cur.val] ?? 0) + 1;
    cur = cur.next;
  }

  // 按 key 升序排序
  const sortedKeys = Object.keys(count)
    .map(Number)
    .sort((a, b) => a - b);

  const dummy = new ListNode();
  let tail = dummy;
  for (const key of sortedKeys) {
    tail.next = new ListNode(count[key]);
    tail = tail.next;
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 链表频率 =====");

// [1,1,2,2,2,3] -> 频率: 1->2, 2->3, 3->1 => [2,3,1]
console.log(
  "方法1 [1,1,2,2,2,3]:",
  listToArray(frequenciesOfElements(arrayToList([1, 1, 2, 2, 2, 3])))
);
// [3,1,2,3] -> 1->1, 2->1, 3->2 => [1,1,2]
console.log("方法1 [3,1,2,3]:", listToArray(frequenciesOfElements(arrayToList([3, 1, 2, 3]))));
// [5] -> 5->1 => [1]
console.log("方法1 [5]:", listToArray(frequenciesOfElements(arrayToList([5]))));
// [] => []
console.log("方法1 []:", listToArray(frequenciesOfElements(arrayToList([]))));

// 方法2 测试
console.log(
  "方法2 [1,1,2,2,2,3]:",
  listToArray(frequenciesOfElementsObject(arrayToList([1, 1, 2, 2, 2, 3])))
); // [2,3,1]
console.log(
  "方法2 [3,1,2,3]:",
  listToArray(frequenciesOfElementsObject(arrayToList([3, 1, 2, 3])))
); // [1,1,2]

export {};
