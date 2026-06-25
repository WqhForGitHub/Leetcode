// ============================================================
// 021. 对链表进行插入排序
// ============================================================
// LeetCode 147. Insertion Sort List
// 对链表进行插入排序，返回排序后的链表头节点。
// 时间复杂度：O(n^2)，空间复杂度：O(1)

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
// 方法1：插入排序（dummy 节点 + 逐个插入）（推荐）
// ============================================================
function insertionSortList(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  const dummy = new ListNode(0); // 哑节点，简化插入操作
  let curr: ListNode | null = head; // 待插入的当前节点

  while (curr !== null) {
    const next: ListNode | null = curr.next; // 暂存下一个节点

    // 从 dummy 开始找插入位置（已排序部分是升序）
    let prev: ListNode = dummy;
    while (prev.next !== null && prev.next.val < curr.val) {
      prev = prev.next;
    }

    // 将 curr 插入到 prev 之后
    curr.next = prev.next;
    prev.next = curr;

    curr = next; // 处理下一个节点
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 对链表进行插入排序 =====");

// 测试1: [4,2,1,3] -> [1,2,3,4]
const list1 = arrayToList([4, 2, 1, 3]);
console.log("测试1:", listToArray(insertionSortList(list1)));
// 预期: [1,2,3,4]

// 测试2: [-1,5,3,4,0] -> [-1,0,3,4,5]
const list2 = arrayToList([-1, 5, 3, 4, 0]);
console.log("测试2:", listToArray(insertionSortList(list2)));
// 预期: [-1,0,3,4,5]

// 测试3: 已排序 [1,2,3]
const list3 = arrayToList([1, 2, 3]);
console.log("测试3:", listToArray(insertionSortList(list3)));
// 预期: [1,2,3]

// 测试4: 单节点 [1]
const list4 = arrayToList([1]);
console.log("测试4:", listToArray(insertionSortList(list4)));
// 预期: [1]

// 测试5: 逆序 [3,2,1]
const list5 = arrayToList([3, 2, 1]);
console.log("测试5:", listToArray(insertionSortList(list5)));
// 预期: [1,2,3]

// 测试6: 空链表
console.log("测试6:", listToArray(insertionSortList(null)));
// 预期: []

export {};
