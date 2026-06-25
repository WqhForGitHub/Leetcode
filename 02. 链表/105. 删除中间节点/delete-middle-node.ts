// ============================================================
// 105. 删除中间节点
// ============================================================
// 面试题 02.03. 删除中间节点
// 若链表中的某个节点，既不是链表头节点，也不是链表尾节点，则称其为该链表的「中间节点」。
// 假定你只能访问该中间节点，实现一种算法，将该节点从链表中删除。
// 时间复杂度：O(1)，空间复杂度：O(1)

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
// 方法：用下一节点值覆盖当前节点，再删除下一节点
// ============================================================
// 由于只能访问待删除节点 node，无法获取其前驱，
// 因此将后继节点的值复制到 node，然后跳过（删除）后继节点。
function deleteNode(node: ListNode | null): void {
  if (node === null || node.next === null) {
    // 题目保证 node 不是尾节点，此处仅做防御性判断
    return;
  }
  const next = node.next;
  node.val = next.val; // 用后继值覆盖
  node.next = next.next; // 跳过后继节点
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例 1: [1,2,3,4,5,6], 删除值为 3 的中间节点 -> [1,2,4,5,6]
  const list1 = arrayToList([1, 2, 3, 4, 5, 6])!;
  // 找到值为 3 的节点
  let node3 = list1;
  while (node3.val !== 3) node3 = node3.next!;
  deleteNode(node3);
  console.log("测试1:", listToArray(list1)); // [1,2,4,5,6]

  // 测试用例 2: [1,2,3], 删除值为 2 的节点 -> [1,3]
  const list2 = arrayToList([1, 2, 3])!;
  let node2 = list2;
  while (node2.val !== 2) node2 = node2.next!;
  deleteNode(node2);
  console.log("测试2:", listToArray(list2)); // [1,3]

  // 测试用例 3: [4,5,1,9], 删除值为 5 的节点 -> [4,1,9]
  const list3 = arrayToList([4, 5, 1, 9])!;
  let node5 = list3;
  while (node5.val !== 5) node5 = node5.next!;
  deleteNode(node5);
  console.log("测试3:", listToArray(list3)); // [4,1,9]
}

test();

export {};
