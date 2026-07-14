// ============================================================
// 100. 复杂链表的复制
// ============================================================
// 剑指 Offer 35. 复杂链表的复制
// 请实现 copyRandomList 函数，复制一个带有 random 指针的链表。
// random 指针可以指向链表中的任意节点或 null。
// 时间复杂度：O(n)，空间复杂度：O(n)（哈希表）/ O(1)（原地复制）

// 复杂链表节点定义
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

// 辅助函数：由二维数组构建复杂链表
// 输入格式: [[val, randomIndex], ...]，randomIndex 为 null 表示 random 为空
function buildRandomList(data: [number, number | null][]): Node | null {
  if (data.length === 0) return null;
  const nodes: Node[] = data.map(([val]) => new Node(val));
  for (let i = 0; i < data.length; i++) {
    if (i < data.length - 1) nodes[i].next = nodes[i + 1];
    const randIdx = data[i][1];
    nodes[i].random = randIdx === null ? null : nodes[randIdx];
  }
  return nodes[0];
}

// 辅助函数：复杂链表转二维数组
function randomListToArray(head: Node | null): [number, number | null][] {
  if (head === null) return [];
  // 先收集节点与索引映射
  const map = new Map<Node, number>();
  const nodes: Node[] = [];
  let cur: Node | null = head;
  while (cur !== null) {
    map.set(cur, nodes.length);
    nodes.push(cur);
    cur = cur.next;
  }
  return nodes.map((node) => [node.val, node.random === null ? null : map.get(node.random)!]);
}

// ============================================================
// 方法一：哈希表
// ============================================================
// 第一次遍历建立「原节点 -> 新节点」的映射，
// 第二次遍历根据原节点的 next / random 设置新节点的对应指针。
function copyRandomList(head: Node | null): Node | null {
  if (head === null) return null;

  const map = new Map<Node, Node>();

  // 第一遍：创建所有新节点并建立映射
  let cur: Node | null = head;
  while (cur !== null) {
    map.set(cur, new Node(cur.val));
    cur = cur.next;
  }

  // 第二遍：连接 next 和 random
  cur = head;
  while (cur !== null) {
    const newNode = map.get(cur)!;
    newNode.next = cur.next !== null ? map.get(cur.next)! : null;
    newNode.random = cur.random !== null ? map.get(cur.random)! : null;
    cur = cur.next;
  }

  return map.get(head)!;
}

// ============================================================
// 方法二：原地复制（拼接 + 拆分）
// ============================================================
// 步骤1：在每个节点后插入复制节点 A->A'->B->B'->...
// 步骤2：设置复制节点的 random：A'.random = A.random.next
// 步骤3：拆分出复制链表
function copyRandomListInPlace(head: Node | null): Node | null {
  if (head === null) return null;

  // 步骤1：在每个原节点后插入复制节点
  let cur: Node | null = head;
  while (cur !== null) {
    const copy: Node = new Node(cur.val);
    copy.next = cur.next;
    cur.next = copy;
    cur = copy.next;
  }

  // 步骤2：设置复制节点的 random 指针
  cur = head;
  while (cur !== null) {
    const copy: Node = cur.next!;
    copy.random = cur.random !== null ? cur.random.next : null;
    cur = copy.next;
  }

  // 步骤3：拆分出复制链表
  cur = head;
  const newHead: Node | null = head.next;
  while (cur !== null) {
    const copy: Node = cur.next!;
    cur.next = copy.next; // 恢复原链表
    copy.next = copy.next !== null ? copy.next.next : null;
    cur = cur.next;
  }

  return newHead;
}

// ============================================================
// 测试
// ============================================================
function test(): void {
  // 测试用例: [[7,null],[13,0],[11,4],[10,2],[1,0]]
  const data: [number, number | null][] = [
    [7, null],
    [13, 0],
    [11, 4],
    [10, 2],
    [1, 0],
  ];
  const list = buildRandomList(data);

  const res1 = copyRandomList(buildRandomList(data));
  console.log("测试1（哈希表）:", randomListToArray(res1)); // 同上

  const res2 = copyRandomListInPlace(buildRandomList(data));
  console.log("测试1（原地复制）:", randomListToArray(res2)); // 同上

  // 验证是深拷贝（不同对象）
  console.log("深拷贝验证:", res1 !== list); // true

  // 测试用例: 空链表
  console.log("测试2:", copyRandomList(null)); // null

  // 测试用例: 单节点 random 指向自己 [[1,0]]
  const res3 = copyRandomList(buildRandomList([[1, 0]]));
  console.log("测试3:", randomListToArray(res3)); // [[1,0]]
}

test();

export {};
