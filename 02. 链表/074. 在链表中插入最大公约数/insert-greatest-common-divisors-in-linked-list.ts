// ============================================================
// 074. 在链表中插入最大公约数
// ============================================================
// LeetCode 2807. Insert Greatest Common Divisors in Linked List
// 给定一个链表，相邻节点之间插入它们的最大公约数（GCD）节点。
// GCD 使用辗转相除法计算。
// 时间复杂度：O(n * log(min(a, b)))，空间复杂度：O(1)

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

// 辗转相除法求最大公约数
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// ============================================================
// 方法1：遍历链表，在每对相邻节点间插入 GCD 节点
// ============================================================
// 思路：遍历链表，对于每对相邻节点 (cur, nxt)，
//   计算它们的 GCD，构造新节点插入到 cur 和 nxt 之间。
// 时间复杂度 O(n * log(min(a, b)))，空间复杂度 O(1)
function insertGreatestCommonDivisors(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  let cur: ListNode | null = head;
  while (cur !== null && cur.next !== null) {
    const nxt: ListNode = cur.next;
    // 计算当前节点与下一个节点的 GCD
    const g = gcd(cur.val, nxt.val);
    // 构造新节点，插入到 cur 和 nxt 之间
    const newNode = new ListNode(g, nxt);
    cur.next = newNode;
    // 移动到原来的下一个节点
    cur = nxt;
  }

  return head;
}

// ============================================================
// 方法2：递归实现
// ============================================================
// 递归地为每一对相邻节点插入 GCD 节点。
// 时间复杂度 O(n * log(min(a, b)))，空间复杂度 O(n)（递归栈）
function insertGreatestCommonDivisorsRecursive(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  const nxt: ListNode = head.next;
  const g = gcd(head.val, nxt.val);
  // 在 head 和 nxt 之间插入 GCD 节点
  head.next = new ListNode(g, insertGreatestCommonDivisorsRecursive(nxt));
  return head;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. 在链表中插入最大公约数 =====");

// [18,6,10,3] -> [18,6,6,2,10,1,3]
console.log("方法1:", listToArray(insertGreatestCommonDivisors(arrayToList([18, 6, 10, 3]))));
// [7] -> [7]（单个节点不变）
console.log("方法1:", listToArray(insertGreatestCommonDivisors(arrayToList([7]))));

// 方法2 测试
console.log(
  "方法2:",
  listToArray(insertGreatestCommonDivisorsRecursive(arrayToList([18, 6, 10, 3])))
);
console.log("方法2:", listToArray(insertGreatestCommonDivisorsRecursive(arrayToList([7]))));

// 验证 gcd 函数
console.log("gcd(18,6):", gcd(18, 6)); // 6
console.log("gcd(6,10):", gcd(6, 10)); // 2
console.log("gcd(10,3):", gcd(10, 3)); // 1

export {};
