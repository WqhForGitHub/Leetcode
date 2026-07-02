// ============================================================
// 215. 堆叠长方体的最大高度
// ============================================================
// LeetCode 1691. Maximum Height by Stacking Cuboids
// cuboids[i] = [width, length, height]，可重新排列每块长方体的三边。
// 叠放时上方长方体的长宽高须均 <= 下方对应维度。求最大总高度。

// 方法1：每块排序 + 整体排序 + DP 最长上升子序列（O(n^2)）
function maxHeight(cuboids: number[][]): number {
  // 每块内部三边升序，使 height 取最大边
  const boxes = cuboids.map((c) => [...c].sort((a, b) => a - b));
  // 按 w, l, h 升序，保证下方可承接上方
  boxes.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const n = boxes.length;
  const dp = new Array<number>(n).fill(0);
  let result = 0;
  for (let i = 0; i < n; i++) {
    dp[i] = boxes[i][2];
    for (let j = 0; j < i; j++) {
      if (boxes[j][0] <= boxes[i][0] && boxes[j][1] <= boxes[i][1] && boxes[j][2] <= boxes[i][2]) {
        dp[i] = Math.max(dp[i], dp[j] + boxes[i][2]);
      }
    }
    result = Math.max(result, dp[i]);
  }
  return result;
}

// 方法2：每块排序 + 整体排序 + DP（对象化写法）（O(n^2)）
// 与方法1等价，使用命名字段提升可读性。
function maxHeight2(cuboids: number[][]): number {
  const boxes = cuboids.map((c) => {
    const s = [...c].sort((a, b) => a - b);
    return { w: s[0], l: s[1], h: s[2] };
  });
  boxes.sort((a, b) => a.w - b.w || a.l - b.l || a.h - b.h);
  const n = boxes.length;
  const dp: number[] = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    dp[i] = boxes[i].h;
    for (let j = 0; j < i; j++) {
      if (boxes[j].w <= boxes[i].w && boxes[j].l <= boxes[i].l && boxes[j].h <= boxes[i].h) {
        if (dp[j] + boxes[i].h > dp[i]) dp[i] = dp[j] + boxes[i].h;
      }
    }
  }
  return Math.max(...dp);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 215. 堆叠长方体的最大高度 =====");
console.log(
  "方法1 [[50,45,20],[95,37,53],[45,23,12]]:",
  maxHeight([
    [50, 45, 20],
    [95, 37, 53],
    [45, 23, 12],
  ]),
); // 190
console.log(
  "方法1 [[38,25,45],[76,35,3]]:",
  maxHeight([
    [38, 25, 45],
    [76, 35, 3],
  ]),
); // 76
console.log(
  "方法2 [[50,45,20],[95,37,53],[45,23,12]]:",
  maxHeight2([
    [50, 45, 20],
    [95, 37, 53],
    [45, 23, 12],
  ]),
); // 190
console.log(
  "方法2 [[38,25,45],[76,35,3]]:",
  maxHeight2([
    [38, 25, 45],
    [76, 35, 3],
  ]),
); // 76

export {};
