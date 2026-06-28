// ============================================================
// 019. 随机链表的复制
// ============================================================
// LeetCode 138. Copy List with Random Pointer
// 给定一个长度为 n 的链表，每个节点除了 next 指针外，还有一个 random 指针，
// 可以指向链表中任意节点或 null。返回该链表的深拷贝。
// 使用哈希表存储原节点到克隆节点的映射。
// 时间复杂度：O(n)，空间复杂度：O(n)

class _Node {
  val: number;
  next: _Node | null;
  random: _Node | null;
  constructor(val?: number, next?: _Node | null, random?: _Node | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

function copyRandomList(head: _Node | null): _Node | null {
  if (head === null) return null;

  // 哈希表：原节点 -> 克隆节点
  const visited = new Map<_Node, _Node>();

  // 第一次遍历：创建所有节点并建立映射
  let cur: _Node | null = head;
  while (cur !== null) {
    visited.set(cur, new _Node(cur.val));
    cur = cur.next;
  }

  // 第二次遍历：连接 next 和 random 指针
  cur = head;
  while (cur !== null) {
    const clone = visited.get(cur)!;
    clone.next = cur.next ? visited.get(cur.next)! : null;
    clone.random = cur.random ? visited.get(cur.random)! : null;
    cur = cur.next;
  }

  return visited.get(head)!;
}

// 辅助函数：根据二维数组构造随机链表
// 每个元素 [val, randomIndex]，randomIndex 为 null 或 0 起始索引
function buildList(data: Array<[number, number | null]>): _Node | null {
  if (data.length === 0) return null;
  const nodes: _Node[] = data.map(([v]) => new _Node(v));
  for (let i = 0; i < data.length; i++) {
    if (i < data.length - 1) {
      nodes[i].next = nodes[i + 1];
    }
    const idx = data[i][1];
    if (idx !== null) {
      nodes[i].random = nodes[idx];
    }
  }
  return nodes[0];
}

// 辅助函数：将随机链表序列化为二维数组（用于测试）
function listToArray(head: _Node | null): Array<[number, number | null]> {
  const result: Array<[number, number | null]> = [];
  const indexMap = new Map<_Node, number>();
  let cur: _Node | null = head;
  let i = 0;
  while (cur !== null) {
    indexMap.set(cur, i);
    cur = cur.next;
    i++;
  }
  cur = head;
  while (cur !== null) {
    const randomIdx = cur.random ? indexMap.get(cur.random)! : null;
    result.push([cur.val, randomIdx]);
    cur = cur.next;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 随机链表的复制 =====");
const l1 = buildList([
  [7, null],
  [13, 0],
  [11, 4],
  [10, 2],
  [1, 0],
]);
console.log(listToArray(copyRandomList(l1)));
// [[7,null],[13,0],[11,4],[10,2],[1,0]]

const l2 = buildList([
  [1, 1],
  [2, 1],
]);
console.log(listToArray(copyRandomList(l2))); // [[1,1],[2,1]]

const l3 = buildList([[3, null]]);
console.log(listToArray(copyRandomList(l3))); // [[3,null]]

export {};
