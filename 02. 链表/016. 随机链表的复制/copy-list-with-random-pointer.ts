// ============================================================
// 016. 随机链表的复制
// ============================================================
// LeetCode 138. Copy List with Random Pointer
// 复制一个带 random 指针的链表，返回深拷贝的头节点。
// 时间复杂度：O(n)，空间复杂度：O(n)（方法1）/ O(1)（方法2）

// 节点定义
class Node {
  val: number;
  next: Node | null;
  random: Node | null;
  constructor(val?: number, next?: Node | null, random?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

// 辅助函数：从 [[val, randomIndex], ...] 构建带 random 指针的链表
function arrayToRandomList(data: [number, number | null][]): Node | null {
  if (data.length === 0) return null;
  const nodes: Node[] = data.map(([val]) => new Node(val));
  for (let i = 0; i < data.length; i++) {
    if (i < data.length - 1) {
      nodes[i].next = nodes[i + 1];
    }
    const randomIdx = data[i][1];
    if (randomIdx !== null) {
      nodes[i].random = nodes[randomIdx];
    }
  }
  return nodes[0];
}

// 辅助函数：带 random 指针的链表转数组
function randomListToArray(head: Node | null): [number, number | null][] {
  const result: [number, number | null][] = [];
  if (head === null) return result;
  // 建立节点到索引的映射
  const map = new Map<Node, number>();
  let curr: Node | null = head;
  let index = 0;
  while (curr !== null) {
    map.set(curr, index);
    curr = curr.next;
    index++;
  }
  curr = head;
  while (curr !== null) {
    const randomIdx = curr.random !== null ? map.get(curr.random)! : null;
    result.push([curr.val, randomIdx]);
    curr = curr.next;
  }
  return result;
}

// ============================================================
// 方法1：哈希表两次遍历（推荐）
// ============================================================
function copyRandomList1(head: Node | null): Node | null {
  if (head === null) return null;
  const map = new Map<Node | null, Node | null>();

  // 第一遍：创建所有节点副本
  let curr: Node | null = head;
  while (curr !== null) {
    map.set(curr, new Node(curr.val));
    curr = curr.next;
  }
  map.set(null, null);

  // 第二遍：设置 next 和 random 指针
  curr = head;
  while (curr !== null) {
    const copy = map.get(curr)!;
    copy.next = map.get(curr.next)!;
    copy.random = map.get(curr.random)!;
    curr = curr.next;
  }

  return map.get(head)!;
}

// ============================================================
// 方法2：原地复制（插入复制节点 -> 设置 random -> 分离）
// ============================================================
function copyRandomList2(head: Node | null): Node | null {
  if (head === null) return null;

  // 第一步：在每个节点后插入复制节点 A -> A' -> B -> B' -> ...
  let curr: Node | null = head;
  while (curr !== null) {
    const copy: Node = new Node(curr.val);
    copy.next = curr.next;
    curr.next = copy;
    curr = copy.next;
  }

  // 第二步：设置复制节点的 random 指针
  curr = head;
  while (curr !== null) {
    if (curr.random !== null) {
      curr.next!.random = curr.random.next;
    }
    curr = curr.next!.next;
  }

  // 第三步：分离两个链表
  const dummy = new Node(0);
  let copyCurr: Node | null = dummy;
  curr = head;
  while (curr !== null) {
    copyCurr.next = curr.next;
    copyCurr = copyCurr.next!;
    curr.next = curr.next!.next;
    curr = curr.next;
  }

  return dummy.next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 随机链表的复制 =====");

// 测试1: [[7,null],[13,0],[11,4],[10,2],[1,0]]
const list1 = arrayToRandomList([
  [7, null],
  [13, 0],
  [11, 4],
  [10, 2],
  [1, 0],
]);
const copy1 = copyRandomList1(list1);
console.log("测试1 (哈希表):", randomListToArray(copy1));
// 预期: [[7,null],[13,0],[11,4],[10,2],[1,0]]

// 测试2: 原地复制方法
const list2 = arrayToRandomList([
  [7, null],
  [13, 0],
  [11, 4],
  [10, 2],
  [1, 0],
]);
const copy2 = copyRandomList2(list2);
console.log("测试2 (原地复制):", randomListToArray(copy2));
// 预期: [[7,null],[13,0],[11,4],[10,2],[1,0]]

// 测试3: 单节点 random 指向自己 [[1,0]]
const list3 = arrayToRandomList([[1, 0]]);
const copy3 = copyRandomList1(list3);
console.log("测试3 (单节点):", randomListToArray(copy3));
// 预期: [[1,0]]

// 测试4: 空链表
console.log("测试4 (空链表):", randomListToArray(copyRandomList1(null)));
// 预期: []

export {};
