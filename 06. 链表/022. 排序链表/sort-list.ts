// ============================================================
// 022. 排序链表
// ============================================================
// LeetCode 148. Sort List
// 对链表进行排序（升序），要求 O(n log n) 时间，O(1) 空间。
// 方法1: 归并排序（自顶向下，快慢指针找中点 + 合并）
// 方法2: 归并排序（自底向上）
// 时间复杂度：O(n log n)，空间复杂度：O(log n)（递归栈，方法1）/ O(1)（方法2）

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

// 合并两个有序链表
function merge(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 !== null ? l1 : l2;
  return dummy.next;
}

// ============================================================
// 方法1：归并排序（自顶向下，推荐）
// ============================================================
function sortList(head: ListNode | null): ListNode | null {
  // 基本情况：空链表或单节点
  if (head === null || head.next === null) return head;

  // 快慢指针找中点（slow 在前半部分最后一个节点）
  let slow: ListNode = head;
  let fast: ListNode | null = head.next;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 断开链表
  const mid: ListNode | null = slow.next;
  slow.next = null;

  // 递归排序两半
  const left = sortList(head);
  const right = sortList(mid);

  // 合并
  return merge(left, right);
}

// ============================================================
// 方法2：归并排序（自底向上，O(1) 空间）
// ============================================================
function sortListBottomUp(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;

  // 计算链表长度
  let length = 0;
  let node: ListNode | null = head;
  while (node !== null) {
    length++;
    node = node.next;
  }

  const dummy = new ListNode(0, head);

  // 每次合并的子链表长度从 1 开始倍增
  for (let subLength = 1; subLength < length; subLength *= 2) {
    let prev: ListNode = dummy;
    let curr: ListNode | null = dummy.next;

    while (curr !== null) {
      // 找到第一个子链表（长度 subLength）
      const head1 = curr;
      let count = 1;
      while (curr !== null && count < subLength) {
        curr = curr.next;
        count++;
      }
      if (curr === null) {
        prev.next = head1;
        break;
      }
      const head2: ListNode | null = curr.next;
      curr.next = null; // 断开第一个子链表
      curr = head2;

      // 找到第二个子链表（长度 subLength）
      count = 1;
      while (curr !== null && count < subLength) {
        curr = curr.next;
        count++;
      }
      let next: ListNode | null = null;
      if (curr !== null) {
        next = curr.next;
        curr.next = null; // 断开第二个子链表
      }

      // 合并两个子链表
      const merged = merge(head1, head2);
      prev.next = merged;

      // prev 移到合并后链表末尾
      while (prev.next !== null) {
        prev = prev.next;
      }
      curr = next;
    }
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 排序链表 =====");

// 测试1: [4,2,1,3] -> [1,2,3,4]
const list1 = arrayToList([4, 2, 1, 3]);
console.log("测试1 (自顶向下):", listToArray(sortList(list1)));
// 预期: [1,2,3,4]

// 测试2: [-1,5,3,4,0] -> [-1,0,3,4,5]
const list2 = arrayToList([-1, 5, 3, 4, 0]);
console.log("测试2 (自顶向下):", listToArray(sortList(list2)));
// 预期: [-1,0,3,4,5]

// 测试3: 自底向上方法
const list3 = arrayToList([4, 2, 1, 3]);
console.log("测试3 (自底向上):", listToArray(sortListBottomUp(list3)));
// 预期: [1,2,3,4]

// 测试4: 自底向上 - 多个元素
const list4 = arrayToList([-1, 5, 3, 4, 0]);
console.log("测试4 (自底向上):", listToArray(sortListBottomUp(list4)));
// 预期: [-1,0,3,4,5]

// 测试5: 已排序
const list5 = arrayToList([1, 2, 3, 4, 5]);
console.log("测试5 (已排序):", listToArray(sortList(list5)));
// 预期: [1,2,3,4,5]

// 测试6: 单节点
const list6 = arrayToList([1]);
console.log("测试6 (单节点):", listToArray(sortList(list6)));
// 预期: [1]

// 测试7: 空链表
console.log("测试7 (空链表):", listToArray(sortList(null)));
// 预期: []

export {};
