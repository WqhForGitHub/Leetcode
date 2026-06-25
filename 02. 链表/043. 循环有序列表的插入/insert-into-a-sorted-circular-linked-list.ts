// ============================================================
// 043. 循环有序列表的插入
// ============================================================
// LeetCode 708. Insert into a Sorted Circular Linked List
// 给定一个升序排列的循环链表头节点 head 和一个值 insertVal，将 insertVal 插入到链表中
// 使其仍保持升序排列。返回头节点。
// 方法：遍历找插入位置：prev.val <= insertVal <= curr.val。
//   特殊情况：所有节点值相同，或只有一个节点，则在任意位置插入（默认在起点后插入）。
// 时间复杂度：O(n)，空间复杂度：O(1)

class CNode {
  val: number;
  next: CNode | null = null;
  constructor(val: number, next: CNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function insert(head: CNode | null, insertVal: number): CNode | null {
  const newNode = new CNode(insertVal);
  // 空链表：自环
  if (!head) {
    newNode.next = newNode;
    return newNode;
  }
  // 只有一个节点：在它后面插入并自环
  if (head.next === head) {
    newNode.next = head;
    head.next = newNode;
    return head;
  }

  let prev = head;
  let curr: CNode | null = head.next!;
  let needInsert = false;

  while (true) {
    // 情况1：处于正常升序区间，insertVal 在 [prev.val, curr.val] 之间
    if (prev.val <= insertVal && insertVal <= curr!.val) {
      needInsert = true;
    } else if (prev.val > curr!.val) {
      // 情况2：处于最大值到最小值的"断点"处（prev 是最大，curr 是最小）
      // 若 insertVal >= prev.val（最大值），或 insertVal <= curr.val（最小值），都应插在这
      if (insertVal >= prev.val || insertVal <= curr!.val) {
        needInsert = true;
      }
    }

    if (needInsert) {
      prev.next = new CNode(insertVal, curr);
      return head;
    }

    prev = curr!;
    curr = curr!.next;

    // 转了一圈没找到合适位置（所有节点值相同），在 head 后插入
    if (prev === head) break;
  }

  // 所有节点值都相同，插在 head 后
  prev.next = new CNode(insertVal, curr);
  return head;
}

// ----------------------- 辅助函数与测试 -----------------------
// 用数组构造循环有序链表（已排好序），返回头节点
function arrayToCircularList(arr: number[]): CNode | null {
  if (arr.length === 0) return null;
  const head = new CNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    const node = new CNode(arr[i]);
    cur.next = node;
    cur = node;
  }
  cur.next = head; // 成环
  return head;
}

// 从给定头节点开始遍历 n 个节点输出数组
function circularListToArray(head: CNode | null, n: number): number[] {
  const res: number[] = [];
  if (!head) return res;
  let cur: CNode | null = head;
  for (let i = 0; i < n; i++) {
    res.push(cur!.val);
    cur = cur!.next;
  }
  return res;
}

function testInsert(): void {
  // 3 -> 4 -> 1 (循环)
  let head = arrayToCircularList([3, 4, 1]);
  head = insert(head, 2);
  console.log(circularListToArray(head, 4)); // [3,4,1,2]

  // 空链表
  let h2 = insert(null, 1);
  console.log(circularListToArray(h2, 2)); // [1,1]

  // 所有节点相同
  let h3 = arrayToCircularList([3, 3, 3]);
  h3 = insert(h3, 5);
  console.log(circularListToArray(h3, 4)); // [3,3,3,5]
}

testInsert();

export {};
