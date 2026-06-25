// ============================================================
// 080. 将双链表转换为数组 II
// ============================================================
// 给定一个双向链表的头节点，从尾到头遍历（逆序），将每个节点的值存入数组返回。
// 先找到尾节点，再沿 prev 指针向前遍历。需定义 DoublyListNode 类。
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
  const head = dummy.next;
  if (head !== null) head.prev = null;
  return head;
}

// 辅助函数：找到双向链表的尾节点
function findTail(head: DoublyListNode | null): DoublyListNode | null {
  if (head === null) return null;
  let cur = head;
  while (cur.next !== null) {
    cur = cur.next;
  }
  return cur;
}

// ============================================================
// 方法1：先找尾节点，再沿 prev 指针向前遍历（推荐）
// ============================================================
// 思路：
//   1. 从 head 出发沿 next 走到尾节点
//   2. 从尾节点沿 prev 指针向前遍历，把每个节点的 val 加入数组
//   3. 结果即为链表的逆序
// 时间复杂度 O(n)，空间复杂度 O(n)
function doublyListToArrayReverse(head: DoublyListNode | null): number[] {
  const result: number[] = [];
  // 先找到尾节点
  let cur = findTail(head);
  // 从尾到头遍历
  while (cur !== null) {
    result.push(cur.val);
    cur = cur.prev;
  }
  return result;
}

// ============================================================
// 方法2：正向遍历后反转数组
// ============================================================
// 思路：先正向遍历收集所有值，再反转数组得到逆序结果。
// 不依赖 prev 指针，即使 prev 指针不正确也能工作。
// 时间复杂度 O(n)，空间复杂度 O(n)
function doublyListToArrayReverseViaReverse(head: DoublyListNode | null): number[] {
  const forward: number[] = [];
  let cur = head;
  while (cur !== null) {
    forward.push(cur.val);
    cur = cur.next;
  }
  // 反转数组
  let left = 0;
  let right = forward.length - 1;
  while (left < right) {
    const tmp = forward[left];
    forward[left] = forward[right];
    forward[right] = tmp;
    left++;
    right--;
  }
  return forward;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 将双链表转换为数组 II =====");

// [1,2,3,4] 逆序 -> [4,3,2,1]
console.log("方法1:", doublyListToArrayReverse(arrayToDoublyList([1, 2, 3, 4])));
// [5] -> [5]
console.log("方法1:", doublyListToArrayReverse(arrayToDoublyList([5])));
// [] -> []
console.log("方法1:", doublyListToArrayReverse(arrayToDoublyList([])));

// 方法2 测试
console.log("方法2:", doublyListToArrayReverseViaReverse(arrayToDoublyList([1, 2, 3, 4]))); // [4,3,2,1]
console.log("方法2:", doublyListToArrayReverseViaReverse(arrayToDoublyList([5]))); // [5]
console.log("方法2:", doublyListToArrayReverseViaReverse(arrayToDoublyList([]))); // []

export {};
