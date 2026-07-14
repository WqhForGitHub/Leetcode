// ============================================================
// 068. 合并零之间的节点
// ============================================================
// LeetCode 2181. Merge Nodes in Between Zeros
// 给定一个首尾均为 0 的链表，将相邻两个 0 之间的所有节点值累加合并为一个新节点。
// 思路：遍历链表，在两个 0 之间累加节点值，遇到 0 时若累加值非零则创建新节点连接。
// 时间复杂度：O(n)，空间复杂度：O(n)（结果链表）

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

function mergeNodes(head: ListNode | null): ListNode | null {
  // head 起始为 0
  const dummy = new ListNode(0);
  let tail = dummy;
  let sum = 0;
  // 跳过首部 0
  let curr = head!.next;

  while (curr !== null) {
    if (curr.val === 0) {
      // 遇到 0，将累加值创建为新节点
      tail.next = new ListNode(sum);
      tail = tail.next;
      sum = 0;
    } else {
      sum += curr.val;
    }
    curr = curr.next;
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
function testMergeNodes(): void {
  // [0,3,1,0,4,5,2,0] -> [4,11]
  console.log(listToArray(mergeNodes(arrayToList([0, 3, 1, 0, 4, 5, 2, 0]))));
  // 预期 [4, 11]

  // [0,1,0,3,0,2,2,0] -> [1,3,4]
  console.log(listToArray(mergeNodes(arrayToList([0, 1, 0, 3, 0, 2, 2, 0]))));
  // 预期 [1, 3, 4]

  console.log("mergeNodes 测试完成");
}

testMergeNodes();

export {};
