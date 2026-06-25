// ============================================================
// 027. 删除链表中的节点
// ============================================================
// LeetCode 237. Delete Node in a Linked List
// 给定要删除的节点（无法访问头节点），将该节点从链表中删除。
// 由于无法访问前驱节点，只能用后继节点的值覆盖当前节点，再删除后继节点。
// 时间复杂度：O(1)，空间复杂度：O(1)

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

// 辅助函数：链表转数组
function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

// ============================================================
// 方法：用下一个节点的值覆盖当前节点，再删除下一个节点
// ============================================================
// 注意：题目保证 node 不是链表的尾节点。
// 1. 把 node.next.val 复制到 node.val
// 2. 让 node.next 跳过下一个节点
function deleteNode(node: ListNode): void {
  // 用后继节点的值覆盖当前节点
  node.val = node.next!.val;
  // 删除后继节点
  node.next = node.next!.next;
}

// 测试
console.log("===== 027. 删除链表中的节点 =====");
{
  // 构造链表 4 -> 5 -> 1 -> 9，删除节点 5
  const head = arrayToList([4, 5, 1, 9]);
  // 找到值为 5 的节点
  let node = head;
  while (node !== null && node.val !== 5) {
    node = node.next;
  }
  if (node !== null) {
    deleteNode(node);
  }
  console.log("删除节点5后：", listToArray(head)); // [4,1,9]
}
{
  // 构造链表 4 -> 5 -> 1 -> 9，删除节点 1
  const head = arrayToList([4, 5, 1, 9]);
  let node = head;
  while (node !== null && node.val !== 1) {
    node = node.next;
  }
  if (node !== null) {
    deleteNode(node);
  }
  console.log("删除节点1后：", listToArray(head)); // [4,5,9]
}

export {};
