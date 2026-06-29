// ============================================================
// 181. 树上的操作
// ============================================================
// LeetCode 2471. Operations on Tree
// 给定一棵树，实现一个锁定系统：支持 lock、unlock、upgrade 操作。
// 时间复杂度：lock/unlock O(1)，upgrade O(n)；空间复杂度：O(n)

// 方法1：父指针+锁状态数组（推荐）
// - lock(num, user): 若 num 未被锁定，则由 user 锁定
// - unlock(num, user): 若 num 被 user 锁定，则解锁
// - upgrade(num, user):
//   1. num 未被锁定
//   2. num 的所有祖先都未被锁定
//   3. num 的子树中至少有一个被锁定的节点（由任意 user 锁定）
//   4. 解锁所有子树中被锁定的节点，然后由 user 锁定 num
class LockingTree {
  private parent: number[];
  private children: number[][];
  private locked: (number | null)[]; // locked[i] = user who locked i, null 表示未锁

  constructor(parent: number[]) {
    const n = parent.length;
    this.parent = parent;
    this.locked = new Array(n).fill(null);
    this.children = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
      this.children[parent[i]].push(i);
    }
  }

  // 锁定节点 num，由 user 锁定
  lock(num: number, user: number): boolean {
    if (this.locked[num] !== null) return false;
    this.locked[num] = user;
    return true;
  }

  // 解锁节点 num（仅当由 user 锁定时）
  unlock(num: number, user: number): boolean {
    if (this.locked[num] !== user) return false;
    this.locked[num] = null;
    return true;
  }

  // 升级操作
  upgrade(num: number, user: number): boolean {
    // 1. num 未被锁定
    if (this.locked[num] !== null) return false;
    // 2. 所有祖先都未被锁定
    if (this.hasLockedAncestor(num)) return false;
    // 3. 子树中至少有一个被锁定的节点
    if (!this.hasLockedDescendant(num)) return false;
    // 4. 解锁所有子树中被锁定的节点，然后锁定 num
    this.unlockAllDescendants(num);
    this.locked[num] = user;
    return true;
  }

  // 检查祖先是否有被锁定的
  private hasLockedAncestor(num: number): boolean {
    let p = this.parent[num];
    while (p !== -1) {
      if (this.locked[p] !== null) return true;
      p = this.parent[p];
    }
    return false;
  }

  // 检查子树中是否有被锁定的节点
  private hasLockedDescendant(num: number): boolean {
    for (const child of this.children[num]) {
      if (this.locked[child] !== null) return true;
      if (this.hasLockedDescendant(child)) return true;
    }
    return false;
  }

  // 解锁子树中所有被锁定的节点
  private unlockAllDescendants(num: number): void {
    for (const child of this.children[num]) {
      this.locked[child] = null;
      this.unlockAllDescendants(child);
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 181. 树上的操作 =====");

// 测试1:
// parent = [-1,0,0,1,1,2,2]
// 树:
//       0
//      / \
//     1   2
//    / \ / \
//   3  4 5  6
const tree1 = new LockingTree([-1, 0, 0, 1, 1, 2, 2]);
console.log("测试1 lock(2,2):", tree1.lock(2, 2)); // true
console.log("测试1 unlock(2,3):", tree1.unlock(2, 3)); // false (user 不对)
console.log("测试1 unlock(2,2):", tree1.unlock(2, 2)); // true
console.log("测试1 lock(2,2):", tree1.lock(2, 2)); // true
console.log("测试1 upgrade(2,1):", tree1.upgrade(2, 1)); // false (子树无锁定节点)
console.log("测试1 lock(4,5):", tree1.lock(4, 5)); // true
console.log("测试1 upgrade(0,1):", tree1.upgrade(0, 1)); // false (0的子树2被锁定，但2是0的子孙)
// 注意：upgrade(0,1) 要求 0 未锁定（满足），祖先无锁定（0是根，满足），
// 子树有锁定（2和4被锁定，满足），所以应该解锁 2 和 4，锁定 0
// 但等等，2 是 0 的子孙，4 也是 0 的子孙
console.log("测试1 upgrade(0,1)再试:", tree1.upgrade(0, 1)); // true (解锁2,4，锁定0)

// 测试2: 基本锁定解锁
const tree2 = new LockingTree([-1, 0, 0, 1, 1, 2, 2]);
console.log("测试2 lock(4,1):", tree2.lock(4, 1)); // true
console.log("测试2 lock(4,2):", tree2.lock(4, 2)); // false (已被1锁定)
console.log("测试2 lock(4,1)重复:", tree2.lock(4, 1)); // false (已锁定)
console.log("测试2 unlock(4,1):", tree2.unlock(4, 1)); // true
console.log("测试2 lock(4,2):", tree2.lock(4, 2)); // true (现在可以)

// 测试3: upgrade 条件检查
const tree3 = new LockingTree([-1, 0, 0, 1, 1, 2, 2]);
console.log("测试3 lock(3,1):", tree3.lock(3, 1)); // true
console.log("测试3 lock(5,2):", tree3.lock(5, 2)); // true
// upgrade(1,3): 1未锁定✓, 祖先(0)未锁定✓, 子树(3)有锁定✓
console.log("测试3 upgrade(1,3):", tree3.upgrade(1, 3)); // true (解锁3, 锁定1)
// 现在 upgrade(0,4): 0未锁定✓, 0是根无祖先✓, 子树(1,5被锁定)有锁定✓
console.log("测试3 upgrade(0,4):", tree3.upgrade(0, 4)); // true

export {};
