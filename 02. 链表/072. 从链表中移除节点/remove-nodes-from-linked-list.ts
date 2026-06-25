// ============================================================
// 072. 从链表中移除节点
// ============================================================
// LeetCode 2487. Remove Nodes From Linked List
// 移除链表中所有右侧存在更大值的节点，返回剩余链表头。
// 方法1：反转链表 -> 遍历保留递减序列 -> 再反转回来。
// 方法2：递归（后序遍历），递归返回时判断当前节点是否应保留。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n) 递归栈（方法2）

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

// 反转链表辅助函数
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

// 数组转链表辅助函数
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of arr) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

// 链表转数组辅助函数
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
// 方法1：反转 + 保留递减 + 再反转
// ============================================================
function removeNodes_iterative(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  // 1. 反转链表
  let reversed = reverseList(head);

  // 2. 遍历反转后的链表，仅保留 >= 已见最大值的节点（即原链表中右侧无更大值）
  const dummy = new ListNode(0, reversed);
  let prev = dummy;
  let curr: ListNode | null = reversed;
  let maxSoFar = -Infinity;

  while (curr !== null) {
    if (curr.val >= maxSoFar) {
      maxSoFar = curr.val;
      prev.next = curr;
      prev = curr;
      curr = curr.next;
    } else {
      // 删除 curr
      prev.next = curr.next;
      curr = curr.next;
    }
  }
  prev.next = null;

  // 3. 再反转回来
  return reverseList(dummy.next);
}

// ============================================================
// 方法2：递归（后序遍历）
// ============================================================
function removeNodes_recursive(head: ListNode | null): ListNode | null {
  // 递归终止
  if (head === null || head.next === null) {
    return head;
  }

  // 递归处理右侧链表，返回右侧处理后的头节点
  const nextNode = removeNodes_recursive(head.next);

  // 判断当前节点是否应保留：若右侧头节点值更大，则当前节点应被删除
  if (nextNode !== null && nextNode.val > head.val) {
    return nextNode;
  }
  head.next = nextNode;
  return head;
}

// 主方法（默认使用方法1）
function removeNodes(head: ListNode | null): ListNode | null {
  return removeNodes_iterative(head);
}

// ============================================================
// 测试
// ============================================================
function testRemoveNodes(): void {
  // [5,2,13,3,8] -> [13,8]
  console.log(listToArray(removeNodes(arrayToList([5, 2, 13, 3, 8]))));
  // 预期 [13, 8]

  // [1,1,1,1] -> [1,1,1,1]
  console.log(listToArray(removeNodes(arrayToList([1, 1, 1, 1]))));
  // 预期 [1, 1, 1, 1]

  // 递归方法测试
  console.log(listToArray(removeNodes_recursive(arrayToList([5, 2, 13, 3, 8]))));
  // 预期 [13, 8]

  console.log("removeNodes 测试完成");
}

testRemoveNodes();

export {};
