// ============================================================
// 056. 序列化和反序列化二叉搜索树
// ============================================================
// LeetCode 449. Serialize and Deserialize BST
// 设计一个算法来序列化和反序列化二叉搜索树。
// 不需要记录空节点，利用BST性质可以重建。
// 时间复杂度：O(n)，空间复杂度：O(n)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：前序遍历（推荐）
// 序列化：前序遍历（根-左-右），只记录节点值
// 反序列化：根据BST性质，第一个是根，后续比根小的属于左子树，比根大的属于右子树
function serialize(root: TreeNode | null): string {
  const result: number[] = [];
  function preorder(node: TreeNode | null): void {
    if (node === null) return;
    result.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }
  preorder(root);
  return result.join(",");
}

function deserialize(data: string): TreeNode | null {
  if (data === "") return null;
  const values = data.split(",").map(Number);
  let index = 0;

  // 在指定范围内构建BST
  function build(min: number, max: number): TreeNode | null {
    if (index >= values.length) return null;
    const val = values[index];
    if (val < min || val > max) return null;
    index++;
    const node = new TreeNode(val);
    node.left = build(min, val);
    node.right = build(val, max);
    return node;
  }

  return build(-Infinity, Infinity);
}

// 方法2：后序遍历
// 序列化：后序遍历（左-右-根）
// 反序列化：倒序处理，先处理根再处理右子树再处理左子树
function serializePostorder(root: TreeNode | null): string {
  const result: number[] = [];
  function postorder(node: TreeNode | null): void {
    if (node === null) return;
    postorder(node.left);
    postorder(node.right);
    result.push(node.val);
  }
  postorder(root);
  return result.join(",");
}

function deserializePostorder(data: string): TreeNode | null {
  if (data === "") return null;
  const values = data.split(",").map(Number);
  let index = values.length - 1;

  function build(min: number, max: number): TreeNode | null {
    if (index < 0) return null;
    const val = values[index];
    if (val < min || val > max) return null;
    index--;
    const node = new TreeNode(val);
    // 后序是 左-右-根，倒序是 根-右-左，所以先建右子树
    node.right = build(val, max);
    node.left = build(min, val);
    return node;
  }

  return build(-Infinity, Infinity);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 056. 序列化和反序列化二叉搜索树 =====");
// 构造BST: [2,1,3]
//     2
//    / \
//   1   3
const tree1 = new TreeNode(2);
tree1.left = new TreeNode(1);
tree1.right = new TreeNode(3);

const serialized1 = serialize(tree1);
console.log("前序序列化:", serialized1); // 期望 "2,1,3"
const deserialized1 = deserialize(serialized1);
console.log("前序反序列化根值:", deserialized1?.val); // 期望 2
console.log("前序反序列化左孩子:", deserialized1?.left?.val); // 期望 1
console.log("前序反序列化右孩子:", deserialized1?.right?.val); // 期望 3

const serializedPost1 = serializePostorder(tree1);
console.log("后序序列化:", serializedPost1); // 期望 "1,3,2"
const deserializedPost1 = deserializePostorder(serializedPost1);
console.log("后序反序列化根值:", deserializedPost1?.val); // 期望 2
console.log("后序反序列化左孩子:", deserializedPost1?.left?.val); // 期望 1
console.log("后序反序列化右孩子:", deserializedPost1?.right?.val); // 期望 3

// 空树
console.log("空树前序序列化:", serialize(null)); // 期望 ""
console.log("空树前序反序列化:", deserialize("")); // 期望 null

export {};
