// ============================================================
// 034. 扁平化多级双向链表
// ============================================================
// LeetCode 430. Flatten a Multilevel Doubly Linked List
// 多级双向链表中节点有 child 指针指向另一条双向链表的子链。
// 扁平化：使所有节点出现在同一层的双链表中，子链插入到当前节点和 next 之间。
// 时间复杂度：O(n)，空间复杂度：O(n)（方法1递归栈）/ O(1)（方法2）

// 节点定义
class Node {
  val: number;
  prev: Node | null;
  next: Node | null;
  child: Node | null;
  constructor(val?: number, prev?: Node | null, next?: Node | null, child?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.prev = prev === undefined ? null : prev;
    this.next = next === undefined ? null : next;
    this.child = child === undefined ? null : child;
  }
}

// 辅助函数：从数组构建多级双向链表（用于测试，简化版）
// 用 null 分隔不同层，[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
// 1-2-3-4-5-6, 其中3的child是7-8-9-10, 其中8的child是11-12
function buildMultilevelList(arr: (number | null)[]): Node | null {
  if (arr.length === 0 || arr[0] === null) return null;

  const createNodes = (values: number[]): Node[] => {
    return values.map((v) => new Node(v));
  };

  // 解析输入：第一层 + 各层的子链
  const head = new Node(arr[0]);
  const firstLevel: number[] = [];
  let i = 0;
  // 先收集第一层
  while (i < arr.length && arr[i] !== null) {
    firstLevel.push(arr[i]!);
    i++;
  }
  const firstNodes = createNodes(firstLevel);
  // 连接第一层
  for (let j = 0; j < firstNodes.length; j++) {
    if (j > 0) firstNodes[j].prev = firstNodes[j - 1];
    if (j < firstNodes.length - 1) firstNodes[j].next = firstNodes[j + 1];
  }

  // 处理子链：跳过 null，继续收集下一层
  // 这里简化处理：手动构建测试用的链表
  // 注意：实际测试中直接手动构造更清晰
  return firstNodes[0] ?? null;
}

// 手动构建测试用例的辅助函数
function buildTestList(): Node | null {
  // 构造：
  // 1 --- 2 --- 3 --- 4 --- 5 --- 6
  //             |
  //             7 --- 8 --- 9 --- 10
  //                   |
  //                   11-- 12
  const n1 = new Node(1);
  const n2 = new Node(2);
  const n3 = new Node(3);
  const n4 = new Node(4);
  const n5 = new Node(5);
  const n6 = new Node(6);
  const n7 = new Node(7);
  const n8 = new Node(8);
  const n9 = new Node(9);
  const n10 = new Node(10);
  const n11 = new Node(11);
  const n12 = new Node(12);

  // 第一层
  n1.next = n2;
  n2.prev = n1;
  n2.next = n3;
  n3.prev = n2;
  n3.next = n4;
  n4.prev = n3;
  n4.next = n5;
  n5.prev = n4;
  n5.next = n6;
  n6.prev = n5;

  // 3 的 child
  n3.child = n7;

  // 第二层
  n7.next = n8;
  n8.prev = n7;
  n8.next = n9;
  n9.prev = n8;
  n9.next = n10;
  n10.prev = n9;

  // 8 的 child
  n8.child = n11;

  // 第三层
  n11.next = n12;
  n12.prev = n11;

  return n1;
}

// 辅助函数：扁平化链表转数组
function flatListToArray(head: Node | null): number[] {
  const result: number[] = [];
  let curr = head;
  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }
  return result;
}

// ============================================================
// 方法1：DFS 递归（推荐）
// ============================================================
// 遍历链表，遇到有 child 的节点，递归展平子链，
// 然后将展平后的子链插入当前节点和 next 之间。
// 时间复杂度 O(n)，空间复杂度 O(n)（递归栈）
function flatten(head: Node | null): Node | null {
  if (head === null) return head;

  // 递归展平以 node 为头的链表，返回展平后的尾节点
  const flattenDFS = (node: Node): Node => {
    let curr: Node | null = node;
    let tail: Node = node;

    while (curr !== null) {
      const next: Node | null = curr.next;
      if (curr.child !== null) {
        // 递归展平子链，得到子链的头和尾
        const childHead: Node = curr.child;
        const childTail: Node = flattenDFS(childHead);

        // 将子链插入 curr 和 next 之间
        curr.next = childHead;
        childHead.prev = curr;
        curr.child = null; // 清空 child 指针

        // 子链尾部连接 next
        if (next !== null) {
          childTail.next = next;
          next.prev = childTail;
        }
        // 更新 tail
        tail = next !== null ? next : childTail;
        curr = next;
      } else {
        tail = curr;
        curr = next;
      }
    }
    return tail;
  };

  flattenDFS(head);
  return head;
}

// ============================================================
// 方法2：迭代（用栈模拟）
// ============================================================
// 使用栈，遇到 child 压入待处理。
// 时间复杂度 O(n)，空间复杂度 O(n)（最坏栈深度）
function flattenIterative(head: Node | null): Node | null {
  if (head === null) return head;

  const dummy = new Node(0);
  dummy.next = head;
  head.prev = dummy;

  const stack: Node[] = [head];
  let prev: Node = dummy;

  while (stack.length > 0) {
    const curr = stack.pop()!;
    // 连接 prev 和 curr
    prev.next = curr;
    curr.prev = prev;

    if (curr.next !== null) {
      stack.push(curr.next);
    }
    if (curr.child !== null) {
      // child 先入栈（后出），这样 child 会先被处理
      stack.push(curr.child);
      curr.child = null;
    }
    prev = curr;
  }

  // 恢复头节点的 prev
  dummy.next!.prev = null;
  return dummy.next;
}

// 测试
console.log("===== 034. 扁平化多级双向链表 =====");
{
  const head = buildTestList();
  const flattened = flatten(head);
  console.log("方法1 递归：", flatListToArray(flattened)); // [1,2,3,7,8,11,12,9,10,4,5,6]
  // 验证 prev 指针正确性
  let curr = flattened;
  let prevOk = true;
  let prevNode: Node | null = null;
  while (curr !== null) {
    if (curr.prev !== prevNode) prevOk = false;
    prevNode = curr;
    curr = curr.next;
  }
  console.log("prev 指针验证：", prevOk ? "正确" : "错误");
  // 验证 child 全部清空
  let childOk = true;
  curr = flattened;
  while (curr !== null) {
    if (curr.child !== null) childOk = false;
    curr = curr.next;
  }
  console.log("child 清空验证：", childOk ? "正确" : "错误");
}
{
  const head = buildTestList();
  const flattened = flattenIterative(head);
  console.log("方法2 迭代：", flatListToArray(flattened)); // [1,2,3,7,8,11,12,9,10,4,5,6]
}
{
  // 单节点测试
  const single = new Node(1);
  console.log("单节点：", flatListToArray(flatten(single))); // [1]
}

export {};
