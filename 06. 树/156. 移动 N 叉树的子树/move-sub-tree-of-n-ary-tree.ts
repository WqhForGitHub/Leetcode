// ============================================================
// 156. 移动 N 叉树的子树
// ============================================================
// LeetCode 1516. Move Sub-Tree of N-Ary Tree
// 给定一棵 N 叉树，以及两个节点 node 和 p。
// 将 node 子树移动到 p 的子节点列表中。
// 如果 node 已经在 p 的子树中，需要先从原位置移除。
// 时间复杂度：O(n)，空间复杂度：O(h)

class Node {
  val: number;
  children: Node[];
  parent: Node | null;
  constructor(val?: number, children?: Node[], parent?: Node | null) {
    this.val = val ?? 0;
    this.children = children ?? [];
    this.parent = parent ?? null;
  }
}

// 方法1：DFS递归处理
// 关键判断：node 是否在 p 的子树中（此时需要特殊处理，否则会形成环）
function moveSubTree(root: Node | null, p: Node, q: Node): Node {
  // p 为要移动的子树根，q 为目标父节点。题目中叫 node 和 p，这里统一为 p(被移动) 和 q(目标)
  // 判断 p 是否在 q 的子树中
  let isInSubtree = false;
  function contains(node: Node, target: Node): boolean {
    if (node === target) return true;
    for (const c of node.children) {
      if (contains(c, target)) return true;
    }
    return false;
  }
  isInSubtree = contains(p, q);

  // 找到 p 的父节点 pParent
  function findParent(node: Node | null, target: Node, parent: Node | null): Node | null {
    if (node === null) return null;
    if (node === target) return parent;
    for (const c of node.children) {
      const r = findParent(c, target, node);
      if (r !== null) return r;
    }
    return null;
  }

  if (isInSubtree) {
    // p 是 q 的祖先之一。先把 p 从其父节点中移除
    const pParent = findParent(root, p, null);
    if (pParent !== null) {
      const idx = pParent.children.indexOf(p);
      pParent.children.splice(idx, 1);
    } else {
      // p 是根，先标记
      root = root === p ? null : root;
    }
    // 将 q 添加到 p 的原父节点的子列表中（替代 p 的位置）—— 题目原意
    // 实际：若 p 在 q 子树中，需要把 q 加入到 p 的原父节点的子节点列表中 p 的位置
    if (pParent !== null) {
      pParent.children.splice(pParent.children.indexOf(q) === -1 ? pParent.children.length : pParent.children.length, 0, q);
      // 从 q 的父节点中移除 q
      const qParent = findParent(root, q, null);
      if (qParent !== null && qParent !== pParent) {
        const qi = qParent.children.indexOf(q);
        if (qi !== -1) qParent.children.splice(qi, 1);
      }
    }
    // 把 p 作为 q 的孩子
    q.children.push(p);
    if (root === null) root = p;
    // 若 p 原本是根，则 q 的父节点变为新根
    return root === p ? root : (root ?? p);
  }

  // 正常情况：p 不在 q 的子树中
  const pParent = findParent(root, p, null);
  if (pParent !== null) {
    const idx = pParent.children.indexOf(p);
    pParent.children.splice(idx, 1);
  }
  q.children.push(p);
  return root ?? p;
}

// 简化版方法1（处理 LeetCode 题目 main 接口）
// 题目实际接口：moveSubTree(root, p, q) 把 p 整个子树移到 q 的子节点列表末尾
function moveSubTreeSimple(root: Node | null, p: Node, q: Node): Node {
  // 1. 判断 p 是否是 q 的祖先（p 在 q 到根的路径上）
  function isAncestor(ancestor: Node, descendant: Node): boolean {
    if (ancestor === descendant) return true;
    for (const c of ancestor.children) {
      if (isAncestor(c, descendant)) return true;
    }
    return false;
  }

  // 2. 找到 node 的父节点
  function findParent(node: Node | null, target: Node): Node | null {
    if (node === null) return null;
    for (const c of node.children) {
      if (c === target) return node;
      const r = findParent(c, target);
      if (r !== null) return r;
    }
    return null;
  }

  if (isAncestor(p, q)) {
    // p 是 q 的祖先（包括 p === q 的情况）
    if (p === q) return root ?? p;

    const pParent = findParent(root, p);
    const qParent = findParent(root, q);

    // 从 pParent 的子列表中移除 p
    if (pParent !== null) {
      const idx = pParent.children.indexOf(p);
      pParent.children.splice(idx, 1);
    }
    // 从 qParent 的子列表中移除 q
    if (qParent !== null) {
      const idx = qParent.children.indexOf(q);
      qParent.children.splice(idx, 1);
    }
    // q 加入到 pParent 的子列表中（替代 p 的位置）
    if (pParent !== null) {
      pParent.children.push(q);
    }
    // p 加入 q 的子列表末尾
    q.children.push(p);

    // 如果 p 是根，那么 q 变成新的根
    if (root === p) {
      root = q;
    }
    return root ?? q;
  } else {
    // 一般情况
    const pParent = findParent(root, p);
    if (pParent !== null) {
      const idx = pParent.children.indexOf(p);
      pParent.children.splice(idx, 1);
    }
    q.children.push(p);
    return root ?? p;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 156. 移动 N 叉树的子树 =====");

// 辅助：序列化 N 叉树（层序输出 [val, childCount]）
function serialize(root: Node | null): string {
  if (root === null) return "null";
  const result: [number, number[]][] = [];
  const queue: Node[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push([node.val, node.children.map((c) => c.val)]);
    for (const c of node.children) queue.push(c);
  }
  return JSON.stringify(result);
}

// 测试1: 一般情况 - 把 4 移到 1 的子节点
//     1
//    / \
//   2   3
//      / \
//     4   5
const a1 = new Node(1);
const a2 = new Node(2);
const a3 = new Node(3);
const a4 = new Node(4);
const a5 = new Node(5);
a1.children = [a2, a3];
a3.children = [a4, a5];
console.log("测试1 before:", serialize(a1));
console.log("测试1 after:", serialize(moveSubTreeSimple(a1, a4, a1)));

// 测试2: p 是 q 的祖先
//     1
//    / \
//   2   3
//  /
// 4
const b1 = new Node(1);
const b2 = new Node(2);
const b3 = new Node(3);
const b4 = new Node(4);
b1.children = [b2, b3];
b2.children = [b4];
console.log("测试2 before:", serialize(b1));
console.log("测试2 after:", serialize(moveSubTreeSimple(b1, b2, b4)));

export {};
