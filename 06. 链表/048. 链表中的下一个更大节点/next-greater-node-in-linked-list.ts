// ============================================================
// 048. 链表中的下一个更大节点
// ============================================================
// LeetCode 1019. Next Greater Node In Linked List
// 给定单链表头节点 head，返回整数数组 answer，其中 answer[i] 是第 i 个节点
// 后面第一个比它大的节点的值；若不存在则为 0。
// 方法：单调递减栈。遍历链表，栈中存索引；当前值大于栈顶索引对应值时弹出并记录结果。
// 时间复杂度：O(n)，空间复杂度：O(n)

class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function nextLargerNodes(head: ListNode | null): number[] {
  // 先把链表转成数组便于按下标访问
  const values: number[] = [];
  let cur: ListNode | null = head;
  while (cur) {
    values.push(cur.val);
    cur = cur.next;
  }

  const n = values.length;
  const answer: number[] = new Array(n).fill(0);
  // 单调递减栈，存索引
  const stack: number[] = [];

  for (let i = 0; i < n; i++) {
    // 当前值大于栈顶索引对应的值时，栈顶找到了"下一个更大节点"
    while (stack.length > 0 && values[i] > values[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      answer[idx] = values[i];
    }
    stack.push(i);
  }
  // 栈中剩余索引的 answer 默认为 0
  return answer;
}

// 方法2：直接对链表使用单调栈（无需转数组），栈中存 [index, value]
function nextLargerNodesDirect(head: ListNode | null): number[] {
  const answer: number[] = [];
  // 栈存 [index, value]
  const stack: Array<[number, number]> = [];
  let cur: ListNode | null = head;
  let idx = 0;
  while (cur) {
    answer.push(0); // 先占位
    while (stack.length > 0 && cur.val > stack[stack.length - 1][1]) {
      const [i] = stack.pop()!;
      answer[i] = cur.val;
    }
    stack.push([idx, cur.val]);
    cur = cur.next;
    idx++;
  }
  return answer;
}

// ----------------------- 辅助函数与测试 -----------------------
function arrayToList(arr: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of arr) {
    cur.next = new ListNode(v);
    cur = cur.next;
  }
  return dummy.next;
}

function testNextGreater(): void {
  // [2,1,5] => [5,5,0]
  console.log(nextLargerNodes(arrayToList([2, 1, 5]))); // [5,5,0]
  // [2,7,4,3,5] => [7,0,5,5,0]
  console.log(nextLargerNodes(arrayToList([2, 7, 4, 3, 5]))); // [7,0,5,5,0]
  // [1,7,5,1,9,2,5,1] => [7,9,9,9,0,5,0,0]
  console.log(nextLargerNodes(arrayToList([1, 7, 5, 1, 9, 2, 5, 1]))); // [7,9,9,9,0,5,0,0]

  // 方法2
  console.log(nextLargerNodesDirect(arrayToList([2, 1, 5]))); // [5,5,0]
  console.log(nextLargerNodesDirect(arrayToList([2, 7, 4, 3, 5]))); // [7,0,5,5,0]
}

testNextGreater();

export {};
