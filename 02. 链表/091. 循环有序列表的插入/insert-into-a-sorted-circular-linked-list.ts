// ============================================================
// 091. 循环有序列表的插入
// ============================================================
// LeetCode 708. Insert into a Sorted Circular Linked List
// 给定循环升序链表的头节点 head（可能为指向最小值的节点），插入一个值为 insertVal 的新节点。
// 若有多个合法插入位置，任选其一。返回头节点。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 循环链表节点定义
class Node {
  val: number;
  next: Node | null;
  constructor(val: number = 0, next: Node | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 辅助函数：由数组构建循环升序链表，返回头节点（指向最小值）
function buildCircularList(arr: number[]): Node | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const head = new Node(sorted[0]);
  let cur = head;
  for (let i = 1; i < sorted.length; i++) {
    const node = new Node(sorted[i]);
    cur.next = node;
    cur = node;
  }
  cur.next = head; // 形成环
  return head;
}

// 辅助函数：从给定头节点开始，遍历一圈输出数组
function circularListToArray(head: Node | null): number[] {
  if (head === null) return [];
  const arr: number[] = [];
  let cur: Node = head;
  do {
    arr.push(cur.val);
    cur = cur.next!;
  } while (cur !== head);
  return arr;
}

// ------------------------------------------------------------
// 方法1：遍历寻找插入位置
// ------------------------------------------------------------
// 遍历循环链表一圈，寻找满足 prev.val <= insertVal <= curr.val 的位置插入。
// 边界情况：
//   1. 链表为空：创建单节点自环。
//   2. insertVal 超出当前范围（比最大值大或比最小值小）：
//      在"最大值节点"与"最小值节点"之间插入（即 prev.val > curr.val 的断点处）。
//   3. 所有节点值相同：在任意位置插入即可。
function insert(head: Node | null, insertVal: number): Node {
  const newNode = new Node(insertVal);

  // 情况1：链表为空，创建自环
  if (head === null) {
    newNode.next = newNode;
    return newNode;
  }

  let prev: Node = head;
  let curr: Node = head.next!;
  let shouldInsert = false;

  // 遍历一圈
  do {
    // 情况A：insertVal 在 [prev.val, curr.val] 区间内，升序位置插入
    if (prev.val <= insertVal && insertVal <= curr.val) {
      shouldInsert = true;
    }
    // 情况B：到达最大值与最小值的交界处（prev.val > curr.val 表示降序点）
    // insertVal 比最大值大 或 比最小值小，都应插在此交界处
    else if (prev.val > curr.val) {
      if (insertVal >= prev.val || insertVal <= curr.val) {
        shouldInsert = true;
      }
    }

    if (shouldInsert) {
      // 在 prev 与 curr 之间插入 newNode
      prev.next = newNode;
      newNode.next = curr;
      return head;
    }

    prev = curr;
    curr = curr.next!;
  } while (prev !== head);

  // 情况C：所有节点值相同（或未找到合适位置），在 head 前插入
  prev.next = newNode;
  newNode.next = curr;
  return head;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  // 测试1：正常插入到中间
  // 链表 [3,4,1]，插入 2，应为 [3,4,1,2]（从3开始，2插入在1和3之间）
  const list1 = buildCircularList([3, 4, 1]);
  console.log("测试1 - 插入中间值:");
  console.log("  原链表:", circularListToArray(list1));
  const res1 = insert(list1, 2);
  console.log("  插入2后:", circularListToArray(res1));
  console.log("  期望: 包含 [3,4,1,2]");

  // 测试2：插入比最大值大的值
  const list2 = buildCircularList([3, 4, 1]);
  console.log("测试2 - 插入大于最大值:");
  const res2 = insert(list2, 5);
  console.log("  插入5后:", circularListToArray(res2));
  console.log("  期望: 包含 [3,4,1,5] 或 [3,4,5,1]");

  // 测试3：插入比最小值小的值
  const list3 = buildCircularList([3, 4, 1]);
  console.log("测试3 - 插入小于最小值:");
  const res3 = insert(list3, 0);
  console.log("  插入0后:", circularListToArray(res3));
  console.log("  期望: 包含 [3,4,1,0] 或 [3,4,0,1]");

  // 测试4：空链表
  console.log("测试4 - 空链表:");
  const res4 = insert(null, 1);
  console.log("  插入1后:", circularListToArray(res4));
  console.log("  期望: [1]");

  // 测试5：所有节点值相同
  const list5 = buildCircularList([3, 3, 3]);
  console.log("测试5 - 所有节点相同:");
  console.log("  原链表:", circularListToArray(list5));
  const res5 = insert(list5, 5);
  console.log("  插入5后:", circularListToArray(res5));
  console.log("  期望: 包含 [3,3,3,5]");

  // 测试6：单节点链表
  const list6 = buildCircularList([1]);
  console.log("测试6 - 单节点:");
  const res6 = insert(list6, 0);
  console.log("  插入0后:", circularListToArray(res6));
  console.log("  期望: [1,0] 或 [0,1]");
}

test();

export {};
