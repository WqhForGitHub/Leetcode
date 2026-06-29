// ============================================================
// 069. 四叉树交集
// ============================================================
// LeetCode 558. Quad Tree Intersection
// 给定两个四叉树，返回它们的逻辑或（并集）。
// 时间复杂度：O(n)（n 为两棵树节点数较小者），空间复杂度：O(h)

class QuadNode {
  val: boolean;
  isLeaf: boolean;
  topLeft: QuadNode | null;
  topRight: QuadNode | null;
  bottomLeft: QuadNode | null;
  bottomRight: QuadNode | null;
  constructor(val: boolean, isLeaf: boolean, topLeft?: QuadNode | null, topRight?: QuadNode | null, bottomLeft?: QuadNode | null, bottomRight?: QuadNode | null) {
    this.val = val;
    this.isLeaf = isLeaf;
    this.topLeft = topLeft ?? null;
    this.topRight = topRight ?? null;
    this.bottomLeft = bottomLeft ?? null;
    this.bottomRight = bottomRight ?? null;
  }
}

// 方法1：递归（推荐）
// 1. 若其中一个为叶子节点：叶子为 true 则或结果为全 true 叶子；为 false 则结果为另一棵树
// 2. 否则递归求四个子区域的或，若四个子区域都是同值叶子则合并为叶子节点
function intersect(quadTree1: QuadNode | null, quadTree2: QuadNode | null): QuadNode | null {
  // 情况1: q1 是叶子
  if (quadTree1!.isLeaf) {
    // 叶子为 true，或结果为全 true 叶子
    if (quadTree1!.val) {
      return new QuadNode(true, true);
    }
    // 叶子为 false，结果为 q2
    return new QuadNode(quadTree2!.val, quadTree2!.isLeaf,
      quadTree2!.topLeft, quadTree2!.topRight,
      quadTree2!.bottomLeft, quadTree2!.bottomRight);
  }
  // 情况2: q2 是叶子
  if (quadTree2!.isLeaf) {
    if (quadTree2!.val) {
      return new QuadNode(true, true);
    }
    return new QuadNode(quadTree1!.val, quadTree1!.isLeaf,
      quadTree1!.topLeft, quadTree1!.topRight,
      quadTree1!.bottomLeft, quadTree1!.bottomRight);
  }
  // 情况3: 两个都是非叶子，递归求四个子区域
  const topLeft = intersect(quadTree1!.topLeft, quadTree2!.topLeft)!;
  const topRight = intersect(quadTree1!.topRight, quadTree2!.topRight)!;
  const bottomLeft = intersect(quadTree1!.bottomLeft, quadTree2!.bottomLeft)!;
  const bottomRight = intersect(quadTree1!.bottomRight, quadTree2!.bottomRight)!;
  // 若四个子节点都是叶子且值相同，合并为一个叶子节点
  if (topLeft.isLeaf && topRight.isLeaf && bottomLeft.isLeaf && bottomRight.isLeaf
    && topLeft.val === topRight.val
    && topRight.val === bottomLeft.val
    && bottomLeft.val === bottomRight.val) {
    return new QuadNode(topLeft.val, true);
  }
  return new QuadNode(false, false, topLeft, topRight, bottomLeft, bottomRight);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 四叉树交集 =====");
// 测试1: 两棵全 false 的叶子节点
const q1 = new QuadNode(false, true);
const q2 = new QuadNode(false, true);
const r1 = intersect(q1, q2);
console.log("false OR false:", r1!.isLeaf, r1!.val); // true, false

// 测试2: false 叶子 OR true 叶子
const q3 = new QuadNode(false, true);
const q4 = new QuadNode(true, true);
const r2 = intersect(q3, q4);
console.log("false OR true:", r2!.isLeaf, r2!.val); // true, true

// 测试3: 两棵相同的非叶子四叉树（2x2 网格）
//   0 1
//   1 0
const sub00 = new QuadNode(false, true);
const sub01 = new QuadNode(true, true);
const sub10 = new QuadNode(true, true);
const sub11 = new QuadNode(false, true);
const t1 = new QuadNode(false, false, sub00, sub01, sub10, sub11);
const t2 = new QuadNode(false, false, sub00, sub01, sub10, sub11);
const r3 = intersect(t1, t2);
console.log("相同非叶子 OR:", r3!.isLeaf, r3!.val); // false, false (无法合并)
console.log("  topLeft:", r3!.topLeft!.val); // false

// 测试4: 全 true 叶子 OR 任意树
const allTrue = new QuadNode(true, true);
const r4 = intersect(allTrue, t1);
console.log("true OR 任意:", r4!.isLeaf, r4!.val); // true, true

export {};
