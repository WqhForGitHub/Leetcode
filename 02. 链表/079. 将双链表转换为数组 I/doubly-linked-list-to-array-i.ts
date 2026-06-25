// ============================================================
// 079. 将双链表转换为数组 I
// ============================================================
// 给定一个双向链表的头节点，从头到尾遍历，将每个节点的值存入数组返回。
// 需定义 DoublyListNode 类（含 val, prev, next）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 双向链表节点定义
class DoublyListNode {
  val: number;
  prev: DoublyListNode | null;
  next: DoublyListNode | null;
  constructor(val?: number, prev?: DoublyListNode | null, next?: DoublyListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.prev = prev === undefined ? null : prev;
    this.next = next === undefined ? null : next;
  }
}

// 辅助函数：数组转双向链表
function arrayToDoublyList(arr: number[]): DoublyListNode | null {
  if (arr.length === 0) return null;
  const dummy = new DoublyListNode();
  let cur = dummy;
  for (const v of arr) {
    const node = new DoublyListNode(v, cur, null);
    cur.next = node;
    cur = node;
  }
  // 头节点的 prev 置空
  const head = dummy.next;
  if (head !== null) head.prev = null;
  return head;
}

// ============================================================
// 方法1：从头到尾遍历，依次将值存入数组（推荐）
// ============================================================
// 思路：从 head 开始沿 next 指针向后遍历，把每个节点的 val push 到数组。
// 时间复杂度 O(n)，空间复杂度 O(n)
function doublyListToArray(head: DoublyListNode | null): number[] {
  const result: number[] = [];
  let cur = head;
  while (cur !== null) {
    result.push(cur.val);
    cur = cur.next;
  }
  return result;
}

// ============================================================
// 方法2：递归遍历
// ============================================================
// 思路：递归地把当前节点值加入数组，再处理 next 节点。
// 时间复杂度 O(n)，空间复杂度 O(n)（递归栈）
function doublyListToArrayRecursive(head: DoublyListNode | null): number[] {
  if (head === null) return [];
  return [head.val, ...doublyListToArrayRecursive(head.next)];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 将双链表转换为数组 I =====");

// [1,2,3,4] -> [1,2,3,4]
console.log("方法1:", doublyListToArray(arrayToDoublyList([1, 2, 3, 4])));
// [5] -> [5]
console.log("方法1:", doublyListToArray(arrayToDoublyList([5])));
// [] -> []
console.log("方法1:", doublyListToArray(arrayToDoublyList([])));

// 方法2 测试
console.log("方法2:", doublyListToArrayRecursive(arrayToDoublyList([1, 2, 3, 4]))); // [1,2,3,4]
console.log("方法2:", doublyListToArrayRecursive(arrayToDoublyList([5]))); // [5]
console.log("方法2:", doublyListToArrayRecursive(arrayToDoublyList([]))); // []

// 验证 prev 指针是否正确
const dl = arrayToDoublyList([1, 2, 3]);
let cur = dl;
while (cur !== null && cur.next !== null) cur = cur.next; // 走到尾
// 反向遍历校验 prev
const reverseCheck: number[] = [];
while (cur !== null) {
  reverseCheck.push(cur.val);
  cur = cur.prev;
}
console.log("prev 指针校验(逆序):", reverseCheck); // [3,2,1]

export {};
