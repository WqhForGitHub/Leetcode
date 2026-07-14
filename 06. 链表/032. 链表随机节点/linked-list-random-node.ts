// ============================================================
// 032. 链表随机节点
// ============================================================
// LeetCode 382. Linked List Random Node
// 给定一个单链表，随机选择一个节点并返回其值。每个节点被选中的概率相等。
// 使用蓄水池抽样（Reservoir Sampling），可以在不知道链表长度的情况下等概率选取。
// 时间复杂度：初始化 O(1)，getRandom O(n)；空间复杂度：O(1)

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
  let curr = dummy;
  for (const v of arr) {
    curr.next = new ListNode(v);
    curr = curr.next;
  }
  return dummy.next;
}

// ============================================================
// 方法1：蓄水池抽样（Reservoir Sampling）—— 推荐，O(1) 空间
// ============================================================
// 遍历链表，对于第 i 个节点（i 从 1 开始），以 1/i 的概率替换当前选中的值。
// 数学上可以证明每个节点最终被选中的概率都是 1/n。
class Solution {
  private head: ListNode | null;

  constructor(head: ListNode | null) {
    this.head = head;
  }

  getRandom(): number {
    let count = 0;
    let result = 0;
    let curr = this.head;
    while (curr !== null) {
      count++;
      // 以 1/count 的概率选中当前节点替换结果
      // Math.random() 返回 [0, 1)，Math.random() < 1/count 的概率为 1/count
      if (Math.random() < 1 / count) {
        result = curr.val;
      }
      curr = curr.next;
    }
    return result;
  }
}

// ============================================================
// 方法2：先计算长度，再随机取（需要 O(n) 空间存值，或两次遍历）
// ============================================================
// 把所有节点的值存入数组，随机取一个。
// 时间复杂度：初始化 O(n)，getRandom O(1)；空间复杂度：O(n)
class Solution2 {
  private values: number[];

  constructor(head: ListNode | null) {
    this.values = [];
    let curr = head;
    while (curr !== null) {
      this.values.push(curr.val);
      curr = curr.next;
    }
  }

  getRandom(): number {
    const index = Math.floor(Math.random() * this.values.length);
    return this.values[index];
  }
}

// 测试
console.log("===== 032. 链表随机节点 =====");
{
  const head = arrayToList([1, 2, 3]);
  const solution = new Solution(head);
  // 多次调用观察分布（每个值出现频率应接近 1/3）
  const count: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  for (let i = 0; i < 3000; i++) {
    count[solution.getRandom()]++;
  }
  console.log("方法1 蓄水池抽样分布（应接近1000）：", count);
}
{
  const head = arrayToList([1, 2, 3]);
  const solution = new Solution2(head);
  const count: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  for (let i = 0; i < 3000; i++) {
    count[solution.getRandom()]++;
  }
  console.log("方法2 数组随机分布（应接近1000）：", count);
}
{
  const head = arrayToList([10]);
  const solution = new Solution(head);
  console.log("单节点 getRandom：", solution.getRandom()); // 10
}

export {};
