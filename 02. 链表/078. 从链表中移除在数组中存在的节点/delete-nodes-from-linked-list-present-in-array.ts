// ============================================================
// 078. 从链表中移除在数组中存在的节点
// ============================================================
// LeetCode 3219. Remove Nodes From Linked List Present in Array
// 给定一个链表和一个整数数组 nums，移除链表中所有值出现在 nums 中的节点。
// 将数组转为 Set，遍历链表删除所有值在 Set 中的节点。用 dummy 节点统一处理。
// 时间复杂度：O(n + m)，空间复杂度：O(m)

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

// ============================================================
// 方法1：哈希集合 + dummy 节点 + 单次遍历（推荐）
// ============================================================
// 思路：
//   1. 将 nums 转为 Set，实现 O(1) 查找
//   2. 使用 dummy 节点统一处理头节点被删除的情况
//   3. 遍历链表，若下一节点值在 Set 中则跳过，否则前进
// 时间复杂度 O(n + m)，空间复杂度 O(m)
function modifiedList(nums: number[], head: ListNode | null): ListNode | null {
  // 将数组转为集合，便于 O(1) 查找
  const numSet = new Set<number>(nums);

  // dummy 节点统一处理头节点删除
  const dummy = new ListNode(0, head);
  let cur: ListNode | null = dummy;

  while (cur !== null && cur.next !== null) {
    if (numSet.has(cur.next.val)) {
      // 当前节点的下一节点需要删除，跳过它
      cur.next = cur.next.next;
    } else {
      // 否则正常前进
      cur = cur.next;
    }
  }

  return dummy.next;
}

// ============================================================
// 方法2：过滤后重新构建链表
// ============================================================
// 思路：遍历原链表，将不在 Set 中的值收集起来，重新构建链表。
// 实现更简洁，但需要 O(n) 额外空间存结果。
// 时间复杂度 O(n + m)，空间复杂度 O(n + m)
function modifiedListRebuild(nums: number[], head: ListNode | null): ListNode | null {
  const numSet = new Set<number>(nums);
  const dummy = new ListNode();
  let tail = dummy;
  let cur = head;

  while (cur !== null) {
    if (!numSet.has(cur.val)) {
      tail.next = new ListNode(cur.val);
      tail = tail.next;
    }
    cur = cur.next;
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 从链表中移除在数组中存在的节点 =====");

// head = [1,2,3,4,5], nums = [1,2,3] -> [4,5]
console.log("方法1:", listToArray(modifiedList([1, 2, 3], arrayToList([1, 2, 3, 4, 5]))));
// head = [1,2,1,2,1,2], nums = [1] -> [2,2,2]
console.log("方法1:", listToArray(modifiedList([1], arrayToList([1, 2, 1, 2, 1, 2]))));
// head = [1,2,3,4], nums = [4] -> [1,2,3]
console.log("方法1:", listToArray(modifiedList([4], arrayToList([1, 2, 3, 4]))));
// head = [], nums = [1] -> []
console.log("方法1:", listToArray(modifiedList([1], arrayToList([]))));

// 方法2 测试
console.log("方法2:", listToArray(modifiedListRebuild([1, 2, 3], arrayToList([1, 2, 3, 4, 5])))); // [4,5]
console.log("方法2:", listToArray(modifiedListRebuild([1], arrayToList([1, 2, 1, 2, 1, 2])))); // [2,2,2]

export {};
