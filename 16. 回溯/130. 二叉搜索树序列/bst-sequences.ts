// ============================================================
// 130. 二叉搜索树序列
// ============================================================
// 面试金典 CCI 04.09. BST 序列
// 给定一棵二叉搜索树，返回所有可能产生该树的插入顺序数组。
// 根节点必先插入，左右子树的插入顺序可任意交织，但子树内部相对顺序需保持。
// 时间复杂度：O(2^N * N), 空间复杂度：O(N)

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

// 方法1：递归+交织(weave) (推荐)
// 对每个节点：递归求左右子树的所有可能序列，再将每对左右序列做交织(weave)，
// 最后在头部加上当前节点值。
// 时间复杂度 O(2^N * N), 空间复杂度 O(N)
function bstSequences(root: TreeNode | null): number[][] {
  if (root === null) {
    return [[]];
  }
  // 递归获取左右子树所有可能序列
  const leftSeqs: number[][] = bstSequences(root.left);
  const rightSeqs: number[][] = bstSequences(root.right);

  const result: number[][] = [];
  for (const left of leftSeqs) {
    for (const right of rightSeqs) {
      // 交织 left 和 right，保持各自内部相对顺序
      const weaved: number[][] = [];
      weave([...left], [...right], [], weaved);
      for (const w of weaved) {
        result.push([root.val, ...w]);
      }
    }
  }
  return result;
}

// 交织两个数组，保持各自相对顺序，结果收集到 out 中
function weave(first: number[], second: number[], prefix: number[], out: number[][]): void {
  // 其中一个为空时，直接拼接剩余部分
  if (first.length === 0 || second.length === 0) {
    out.push([...prefix, ...first, ...second]);
    return;
  }
  // 从 first 取首元素
  const firstHead: number = first.shift() as number;
  prefix.push(firstHead);
  weave(first, second, prefix, out);
  prefix.pop();
  first.unshift(firstHead);

  // 从 second 取首元素
  const secondHead: number = second.shift() as number;
  prefix.push(secondHead);
  weave(first, second, prefix, out);
  prefix.pop();
  second.unshift(secondHead);
}

// 方法2：回溯+候选队列
// 维护一个"候选节点"列表，表示当前可选择的下一个插入节点。
// 每次从候选中选一个，将其左右孩子加入候选，递归后回溯。
// 时间复杂度 O(2^N * N), 空间复杂度 O(N)
function bstSequencesBacktrack(root: TreeNode | null): number[][] {
  if (root === null) {
    return [[]];
  }
  const result: number[][] = [];
  const path: number[] = [];
  const candidates: TreeNode[] = [root];

  const backtrack = (): void => {
    if (candidates.length === 0) {
      result.push([...path]);
      return;
    }
    const size: number = candidates.length;
    for (let i: number = 0; i < size; i++) {
      const node: TreeNode = candidates[i];
      // 从候选中移除当前节点
      candidates.splice(i, 1);
      path.push(node.val);
      // 将子节点加入候选末尾
      let added: number = 0;
      if (node.left !== null) {
        candidates.push(node.left);
        added++;
      }
      if (node.right !== null) {
        candidates.push(node.right);
        added++;
      }
      backtrack();
      // 恢复：移除新增的子节点
      for (let k: number = 0; k < added; k++) {
        candidates.pop();
      }
      path.pop();
      // 将当前节点放回原位置
      candidates.splice(i, 0, node);
    }
  };

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 130. 二叉搜索树序列 =====");
// 树: root=2, left=1, right=3
const bst: TreeNode = new TreeNode(2);
bst.left = new TreeNode(1);
bst.right = new TreeNode(3);
console.log(bstSequences(bst));
// 期望结果: [[2,1,3],[2,3,1]]
console.log(bstSequencesBacktrack(bst));
// 期望结果: [[2,1,3],[2,3,1]]
// 单节点
const single: TreeNode = new TreeNode(1);
console.log(bstSequences(single)); // 期望结果: [[1]]

export {};
