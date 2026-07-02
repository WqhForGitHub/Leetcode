// ============================================================
// 024. 四叉树交集
// ============================================================
// LeetCode 558. Logical OR of Two Binary Grids Represented as Quad-Trees
// 给定两棵表示 0/1 网格的四叉树，返回它们按位或（并集）后的四叉树。
// 时间复杂度：O(min(n1, n2))，空间复杂度：O(log n)（递归栈）

// 四叉树节点定义
class Node {
  val: boolean;
  isLeaf: boolean;
  topLeft: Node | null;
  topRight: Node | null;
  bottomLeft: Node | null;
  bottomRight: Node | null;

  constructor(
    val: boolean,
    isLeaf: boolean,
    topLeft: Node | null = null,
    topRight: Node | null = null,
    bottomLeft: Node | null = null,
    bottomRight: Node | null = null,
  ) {
    this.val = val;
    this.isLeaf = isLeaf;
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
  }
}

// 方法1：递归分治（推荐）
// 思路：
//  1) 若 A 或 B 是叶子节点且值为 true，OR 结果为 true 叶子（true | 任意 = true）。
//  2) 若 A、B 都是叶子，结果为叶子，值为 A.val || B.val。
//  3) 否则把非叶子的一侧视为"四个相同叶子"递归处理对应子节点。
//     递归得到四个子结果后，若四个子节点都是叶子且值相同，则可合并为一个叶子。
function intersect(quadTree1: Node | null, quadTree2: Node | null): Node | null {
  if (quadTree1 === null) return quadTree2;
  if (quadTree2 === null) return quadTree1;

  // 情况1：A 是叶子
  if (quadTree1.isLeaf) {
    // true | 任意 = true
    if (quadTree1.val) return new Node(true, true);
    // false | B = B
    return new Node(
      quadTree2.val,
      quadTree2.isLeaf,
      quadTree2.topLeft,
      quadTree2.topRight,
      quadTree2.bottomLeft,
      quadTree2.bottomRight,
    );
  }

  // 情况2：B 是叶子（A 已知不是叶子）
  if (quadTree2.isLeaf) {
    if (quadTree2.val) return new Node(true, true);
    // false | A = A
    return new Node(
      quadTree1.val,
      quadTree1.isLeaf,
      quadTree1.topLeft,
      quadTree1.topRight,
      quadTree1.bottomLeft,
      quadTree1.bottomRight,
    );
  }

  // 情况3：两者都不是叶子，递归处理四个子节点
  const topLeft = intersect(quadTree1.topLeft, quadTree2.topLeft);
  const topRight = intersect(quadTree1.topRight, quadTree2.topRight);
  const bottomLeft = intersect(quadTree1.bottomLeft, quadTree2.bottomLeft);
  const bottomRight = intersect(quadTree1.bottomRight, quadTree2.bottomRight);

  // 若四个子节点都是叶子且值相同，合并为一个叶子
  if (
    topLeft !== null &&
    topLeft.isLeaf &&
    topRight !== null &&
    topRight.isLeaf &&
    bottomLeft !== null &&
    bottomLeft.isLeaf &&
    bottomRight !== null &&
    bottomRight.isLeaf &&
    topLeft.val === topRight.val &&
    topLeft.val === bottomLeft.val &&
    topLeft.val === bottomRight.val
  ) {
    return new Node(topLeft.val, true);
  }

  return new Node(false, false, topLeft, topRight, bottomLeft, bottomRight);
}

// 方法2：递归（不展开叶子，简化版本）
// 思路：与方法1相同，但当一方为叶子时直接展开比较，逻辑更紧凑。
function intersectSimple(quadTree1: Node | null, quadTree2: Node | null): Node | null {
  if (quadTree1 === null || quadTree2 === null) {
    return quadTree1 ?? quadTree2;
  }

  if (quadTree1.isLeaf && quadTree2.isLeaf) {
    return new Node(quadTree1.val || quadTree2.val, true);
  }

  // 若一方为叶子，展开成四个相同叶子参与递归
  const a: Node = quadTree1.isLeaf ? expandLeaf(quadTree1) : quadTree1;
  const b: Node = quadTree2.isLeaf ? expandLeaf(quadTree2) : quadTree2;

  // 若某叶子为 true，结果直接是 true 叶子
  if (quadTree1.isLeaf && quadTree1.val) return new Node(true, true);
  if (quadTree2.isLeaf && quadTree2.val) return new Node(true, true);

  const tl = intersectSimple(a.topLeft, b.topLeft)!;
  const tr = intersectSimple(a.topRight, b.topRight)!;
  const bl = intersectSimple(a.bottomLeft, b.bottomLeft)!;
  const br = intersectSimple(a.bottomRight, b.bottomRight)!;

  if (
    tl.isLeaf &&
    tr.isLeaf &&
    bl.isLeaf &&
    br.isLeaf &&
    tl.val === tr.val &&
    tl.val === bl.val &&
    tl.val === br.val
  ) {
    return new Node(tl.val, true);
  }
  return new Node(false, false, tl, tr, bl, br);
}

// 把叶子节点展开成内部节点（四个相同叶子）
function expandLeaf(leaf: Node): Node {
  const child = new Node(leaf.val, true);
  return new Node(leaf.val, false, child, child, child, child);
}

// ============================================================
// 测试
// ============================================================
// 辅助：把四叉树序列化为 [(isLeaf, val)] 的层序数组
function serialize(root: Node | null): Array<[boolean, boolean]> {
  if (root === null) return [];
  const result: Array<[boolean, boolean]> = [];
  const queue: Array<Node | null> = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) continue;
    result.push([node.isLeaf, node.val]);
    if (!node.isLeaf) {
      queue.push(node.topLeft, node.topRight, node.bottomLeft, node.bottomRight);
    }
  }
  return result;
}

console.log("===== 024. 四叉树交集 =====");

// 测试1：两个全 0 叶子 OR -> 全 0 叶子
const a1 = new Node(false, true);
const b1 = new Node(false, true);
console.log("false OR false:", JSON.stringify(serialize(intersect(a1, b1))));
// 期望: [[true,false]]

// 测试2：全 0 叶子 OR 全 1 叶子 -> 全 1 叶子
const a2 = new Node(false, true);
const b2 = new Node(true, true);
console.log("false OR true:", JSON.stringify(serialize(intersect(a2, b2))));
// 期望: [[true,true]]

// 测试3：构造一个内部节点（左上为 1，其余 0）OR 全 0 叶子
const a3 = new Node(
  true,
  false,
  new Node(true, true),
  new Node(false, true),
  new Node(false, true),
  new Node(false, true),
);
const b3 = new Node(false, true); // 全 0
console.log("混合 OR false:", JSON.stringify(serialize(intersect(a3, b3))));
// 期望: 仍是内部节点，四个叶子 [1,0,0,0] -> [[false,true],[true,true],[true,false],[true,false],[true,false]]

export {};
