// ============================================================
// 024. 移除链表元素
// ============================================================
// LeetCode 203. Remove Linked List Elements
// 删除链表中所有值为 val 的节点，返回新链表头节点。
// 时间复杂度：O(n)，空间复杂度：O(1)（方法1）/ O(n)（方法2 递归栈）

// 节点定义
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
  const head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
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
// 方法1：dummy 节点 + 迭代（推荐）
// ============================================================
function removeElements(head: ListNode | null, val: number): ListNode | null {
  // 使用哑节点统一处理头节点为待删除的情况
  const dummy = new ListNode(0, head);
  let curr: ListNode | null = dummy;

  while (curr.next !== null) {
    if (curr.next.val === val) {
      // 跳过（删除）值为 val 的节点
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }

  return dummy.next;
}

// ============================================================
// 方法2：递归
// ============================================================
function removeElementsRecursive(head: ListNode | null, val: number): ListNode | null {
  if (head === null) return null;

  // 递归处理下一个节点
  head.next = removeElementsRecursive(head.next, val);

  // 如果当前节点需要删除，返回下一个节点；否则返回当前节点
  return head.val === val ? head.next : head;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 024. 移除链表元素 =====");

// 测试1: [1,2,6,3,4,5,6], val=6 -> [1,2,3,4,5]
const list1 = arrayToList([1, 2, 6, 3, 4, 5, 6]);
console.log("测试1 (迭代):", listToArray(removeElements(list1, 6)));
// 预期: [1,2,3,4,5]

// 测试2: 递归方法
const list2 = arrayToList([1, 2, 6, 3, 4, 5, 6]);
console.log("测试2 (递归):", listToArray(removeElementsRecursive(list2, 6)));
// 预期: [1,2,3,4,5]

// 测试3: 删除头节点 [7,7,7,7], val=7 -> []
const list3 = arrayToList([7, 7, 7, 7]);
console.log("测试3 (全删):", listToArray(removeElements(list3, 7)));
// 预期: []

// 测试4: 无匹配节点 [1,2,3], val=4 -> [1,2,3]
const list4 = arrayToList([1, 2, 3]);
console.log("测试4 (无匹配):", listToArray(removeElements(list4, 4)));
// 预期: [1,2,3]

// 测试5: 空链表
console.log("测试5 (空链表):", listToArray(removeElements(null, 1)));
// 预期: []

// 测试6: 单节点等于 val [1], val=1 -> []
const list6 = arrayToList([1]);
console.log("测试6 (单节点删除):", listToArray(removeElements(list6, 1)));
// 预期: []

export {};
