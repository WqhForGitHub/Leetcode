// ============================================================
// 146. 交换字符串中的元素
// ============================================================
// LeetCode 1202. Smallest String With Swaps
// 给定字符串 s 和若干可交换下标对，可任意次交换，返回能得到的字典序最小字符串。

// 并查集：把可交换的下标归到同一连通分量，每个分量内的字符可任意排列，
// 因此对每个分量内的字符排序后填回即可得到字典序最小串。
class UnionFind {
  parent: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const px: number = this.find(x);
    const py: number = this.find(y);
    if (px !== py) {
      this.parent[px] = py;
    }
  }
}

// 方法1：并查集 + 分量内排序（推荐，O(n log n + n * α)）
function smallestStringWithSwaps(s: string, pairs: number[][]): string {
  const n: number = s.length;
  const uf: UnionFind = new UnionFind(n);
  for (const [a, b] of pairs) {
    uf.union(a, b);
  }

  // 按根节点分组下标
  const groups: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) {
    const root: number = uf.find(i);
    const arr: number[] | undefined = groups.get(root);
    if (arr === undefined) {
      groups.set(root, [i]);
    } else {
      arr.push(i);
    }
  }

  const chars: string[] = s.split("");
  for (const indices of groups.values()) {
    // 下标已天然升序（按 i 顺序加入）
    const sortedChars: string[] = indices.map((idx) => chars[idx]).sort();
    indices.forEach((idx, i) => {
      chars[idx] = sortedChars[i];
    });
  }
  return chars.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 146. 交换字符串中的元素 =====");
console.log(
  "方法1:",
  smallestStringWithSwaps("dcab", [
    [0, 3],
    [1, 2],
  ]),
); // 期望: "bacd"
console.log(
  "方法1:",
  smallestStringWithSwaps("dcab", [
    [0, 3],
    [1, 2],
    [0, 2],
  ]),
); // 期望: "abcd"
console.log(
  "方法1:",
  smallestStringWithSwaps("cba", [
    [0, 1],
    [1, 2],
  ]),
); // 期望: "abc"

export {};
