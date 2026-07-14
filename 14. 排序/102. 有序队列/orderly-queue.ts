// ============================================================
// 102. 有序队列
// ============================================================
// LeetCode 899. Orderly Queue
// 给定字符串 s 和整数 k，每次操作可把首字符移到末尾（k>=2 时还能更灵活地交换）。
// 求能得到的字典序最小的字符串。

// 方法1：分类讨论（推荐，时间 O(n^2)（k==1 枚举旋转），空间 O(n)）
// k == 1：只能整体旋转，枚举所有旋转取字典序最小。
// k >= 2：可以交换任意相邻字符（首字符移到末尾两次可实现相邻交换），
//         等价于可对字符串任意排序，直接排序即可。
function orderlyQueue(s: string, k: number): string {
  if (k === 1) {
    // 枚举所有旋转，取最小
    let best = s;
    for (let i = 1; i < s.length; i++) {
      const rotated = s.slice(i) + s.slice(0, i);
      if (rotated < best) {
        best = rotated;
      }
    }
    return best;
  }
  // k >= 2：可任意排序
  return s.split("").sort().join("");
}

// 方法2：k==1 用最小表示法（时间 O(n) for k==1, O(n log n) for k>=2，空间 O(n)）
// 对 k==1 的情况使用最小表示法在线性时间内求字典序最小的旋转。
function orderlyQueueMinimal(s: string, k: number): string {
  if (k === 1) {
    return minimalRotation(s);
  }
  return s.split("").sort().join("");
}

// 最小表示法：在拼接串 s+s 上用双指针寻找字典序最小旋转起点
function minimalRotation(s: string): string {
  const n = s.length;
  const doubled = s + s;
  let i = 0;
  let j = 1;
  let k = 0;
  while (i < n && j < n && k < n) {
    const a = doubled.charCodeAt(i + k);
    const b = doubled.charCodeAt(j + k);
    if (a === b) {
      k++;
    } else if (a < b) {
      // 起点 j 不可能更优
      j = j + k + 1;
      if (j <= i) j = i + 1;
      k = 0;
    } else {
      // 起点 i 不可能更优
      i = i + k + 1;
      if (i <= j) i = j + 1;
      k = 0;
    }
  }
  const start = Math.min(i, j);
  return doubled.slice(start, start + n);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 102. 有序队列 =====");
console.log("方法1:", orderlyQueue("cba", 1)); // 期望: "acb"
console.log("方法1:", orderlyQueue("baaca", 3)); // 期望: "aaabc"
console.log("方法2:", orderlyQueueMinimal("cba", 1)); // 期望: "acb"
console.log("方法2:", orderlyQueueMinimal("baaca", 3)); // 期望: "aaabc"
console.log("方法2:", orderlyQueueMinimal("gxzlk", 1)); // 期望: "gxzlk" (所有旋转中字典序最小)

export {};
