// ============================================================
// 064. 找出临界点之间的最小和最大距离
// ============================================================
// LeetCode 2058. Find the Minimum and Maximum Number of Nodes Between Critical Points
// 临界点 = 局部极大值或局部极小值的节点（首尾节点不算）。
// 求任意两个相邻临界点之间的最小距离，以及首尾两个临界点之间的最大距离。
// 思路：遍历链表记录所有临界点的下标，相邻距离取 min，首尾距离取 max。
// 时间复杂度：O(n)，空间复杂度：O(k)，k 为临界点个数

// 链表节点定义
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
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

function nodesBetweenCriticalPoints(head: ListNode | null): number[] {
  // 临界点少于 2 个，无法形成距离
  if (head === null || head.next === null || head.next.next === null) {
    return [-1, -1];
  }

  // 收集所有临界点下标
  const indices: number[] = [];
  let prev = head;
  let curr = head.next;
  let index = 1;

  while (curr.next !== null) {
    const next = curr.next;
    // 局部极大值
    if (curr.val > prev.val && curr.val > next.val) {
      indices.push(index);
    }
    // 局部极小值
    else if (curr.val < prev.val && curr.val < next.val) {
      indices.push(index);
    }
    prev = curr;
    curr = next;
    index++;
  }

  if (indices.length < 2) {
    return [-1, -1];
  }

  // 最小距离：相邻临界点之间
  let minDist = Infinity;
  for (let i = 1; i < indices.length; i++) {
    minDist = Math.min(minDist, indices[i] - indices[i - 1]);
  }

  // 最大距离：首尾临界点之间
  const maxDist = indices[indices.length - 1] - indices[0];

  return [minDist, maxDist];
}

// ============================================================
// 测试
// ============================================================
function testNodesBetweenCriticalPoints(): void {
  // [3,1] -> [-1,-1]
  console.log(nodesBetweenCriticalPoints(arrayToList([3, 1]))); // [-1, -1]

  // [5,3,1,2,5,1,2] -> [1,3]
  console.log(nodesBetweenCriticalPoints(arrayToList([5, 3, 1, 2, 5, 1, 2]))); // [1, 3]

  // [1,3,2,2,3,2,2,2,7] -> [3,3]
  console.log(nodesBetweenCriticalPoints(arrayToList([1, 3, 2, 2, 3, 2, 2, 2, 7]))); // [3, 3]

  console.log("nodesBetweenCriticalPoints 测试完成");
}

testNodesBetweenCriticalPoints();

export {};
