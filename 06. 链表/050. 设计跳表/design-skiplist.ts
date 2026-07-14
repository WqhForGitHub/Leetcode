// ============================================================
// 050. 设计跳表
// ============================================================
// LeetCode 1206. Design Skiplist
// 设计一个跳表，支持 search、add、erase 操作。
// 跳表是多层链表，每层是下层的"快速通道"，通过随机层数实现概率平衡。
// 时间复杂度：search/add/erase 均为 O(log n) 期望，空间复杂度：O(n)

// 跳表节点定义
class SkiplistNode {
  val: number;
  next: SkiplistNode[]; // next[i] 表示第 i 层的下一个节点
  constructor(val: number, level: number) {
    this.val = val;
    this.next = new Array(level + 1).fill(null);
  }
}

class Skiplist {
  private maxLevel: number; // 当前最高层
  private head: SkiplistNode; // 头节点（哨兵）
  private readonly maxLevelLimit = 16; // 最大层数限制
  private p = 0.5; // 晋升概率

  constructor() {
    this.maxLevel = 0;
    this.head = new SkiplistNode(-1, this.maxLevelLimit);
  }

  // 随机生成层数
  private randomLevel(): number {
    let level = 0;
    while (Math.random() < this.p && level < this.maxLevelLimit) {
      level++;
    }
    return level;
  }

  // 查找目标值是否存在
  search(target: number): boolean {
    let cur: SkiplistNode = this.head;
    for (let i = this.maxLevel; i >= 0; i--) {
      while (cur.next[i] !== null && cur.next[i]!.val < target) {
        cur = cur.next[i]!;
      }
    }
    cur = cur.next[0];
    return cur !== null && cur.val === target;
  }

  // 添加一个值
  add(num: number): void {
    const update: SkiplistNode[] = new Array(this.maxLevelLimit + 1).fill(this.head);
    let cur: SkiplistNode = this.head;
    // 从最高层往下找到每层的插入前驱
    for (let i = this.maxLevel; i >= 0; i--) {
      while (cur.next[i] !== null && cur.next[i]!.val < num) {
        cur = cur.next[i]!;
      }
      update[i] = cur;
    }
    const level = this.randomLevel();
    if (level > this.maxLevel) {
      // 新增的层，前驱都是 head
      for (let i = this.maxLevel + 1; i <= level; i++) {
        update[i] = this.head;
      }
      this.maxLevel = level;
    }
    // 创建新节点并在每一层插入
    const newNode = new SkiplistNode(num, level);
    for (let i = 0; i <= level; i++) {
      newNode.next[i] = update[i].next[i];
      update[i].next[i] = newNode;
    }
  }

  // 删除一个值
  erase(num: number): boolean {
    const update: SkiplistNode[] = new Array(this.maxLevelLimit + 1).fill(this.head);
    let cur: SkiplistNode = this.head;
    // 从最高层往下找到每层的前驱
    for (let i = this.maxLevel; i >= 0; i--) {
      while (cur.next[i] !== null && cur.next[i]!.val < num) {
        cur = cur.next[i]!;
      }
      update[i] = cur;
    }
    cur = cur.next[0];
    if (cur === null || cur.val !== num) {
      return false; // 未找到
    }
    // 在每一层断开该节点
    for (let i = 0; i <= this.maxLevel; i++) {
      if (update[i].next[i] !== cur) break;
      update[i].next[i] = cur.next[i];
    }
    // 更新最高层（移除空的顶层）
    while (this.maxLevel > 0 && this.head.next[this.maxLevel] === null) {
      this.maxLevel--;
    }
    return true;
  }
}

// 测试
(function test() {
  const skiplist = new Skiplist();
  skiplist.add(1);
  skiplist.add(2);
  skiplist.add(3);
  console.log(skiplist.search(0)); // false
  skiplist.add(4);
  console.log(skiplist.search(1)); // true
  console.log(skiplist.erase(0)); // false
  console.log(skiplist.erase(1)); // true
  console.log(skiplist.search(1)); // false
})();

export {};
