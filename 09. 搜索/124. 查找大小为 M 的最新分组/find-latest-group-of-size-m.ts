// ============================================================
// 124. 查找大小为 M 的最新分组
// ============================================================
// LeetCode 1562. Find Latest Group of Size M
// 步骤数组 arr[i] 表示将位置 arr[i] 的 0 变 1，求最后存在长度为 m 连续1的步骤。

// 方法1：并查集 + 反向处理
function findLatestStep(arr: number[], m: number): number {
  const n = arr.length;
  if (m === n) return n;
  const parent = new Array(n + 2).fill(0).map((_, i) => i);
  const size = new Array(n + 2).fill(0);
  const count = new Map<number, number>(); // 长度 -> 个数
  let result = -1;

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    const px = find(x);
    const py = find(y);
    if (px === py) return;
    // 更新计数
    count.set(size[px], (count.get(size[px]) || 0) - 1);
    count.set(size[py], (count.get(size[py]) || 0) - 1);
    parent[px] = py;
    size[py] += size[px];
    count.set(size[py], (count.get(size[py]) || 0) + 1);
  }

  for (let i = 0; i < n; i++) {
    const pos = arr[i];
    size[pos] = 1;
    count.set(1, (count.get(1) || 0) + 1);
    if (size[pos - 1] > 0) union(pos, pos - 1);
    if (size[pos + 1] > 0) union(pos, pos + 1);
    if ((count.get(m) || 0) > 0) {
      result = i + 1;
    }
  }
  return result;
}

// 方法2：区间合并
function findLatestStepInterval(arr: number[], m: number): number {
  const n = arr.length;
  if (m === n) return n;
  // length[i] = 以 i 为端点的区间长度
  const length = new Array(n + 2).fill(0);
  const count = new Array(n + 1).fill(0);
  let result = -1;
  for (let i = 0; i < n; i++) {
    const pos = arr[i];
    const leftLen = length[pos - 1];
    const rightLen = length[pos + 1];
    const totalLen = leftLen + rightLen + 1;
    length[pos - leftLen] = totalLen;
    length[pos + rightLen] = totalLen;
    count[leftLen]--;
    count[rightLen]--;
    count[totalLen]++;
    if (count[m] > 0) result = i + 1;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 124. 查找大小为 M 的最新分组 =====");
console.log("并查集 [3,5,1,2,4],1:", findLatestStep([3, 5, 1, 2, 4], 1)); // 4
console.log("并查集 [3,1,5,4,2],2:", findLatestStep([3, 1, 5, 4, 2], 2)); // -1
console.log("区间 [3,5,1,2,4],1:", findLatestStepInterval([3, 5, 1, 2, 4], 1)); // 4

export {};
