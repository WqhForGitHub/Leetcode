// ============================================================
// 080. 设置交集大小至少为2
// ============================================================
// LeetCode 757. Set Intersection Size At Least Two
// 给定若干闭区间，求最小集合 S，使每个区间至少包含 S 中 2 个元素。

// 方法1：贪心，按区间右端点排序 + 维护最后加入的两个元素（O(n log n)）
// 思路：按右端点升序排序（右端点相同按左端点升序）。维护已选集合中最大的两个元素 a < b。
// 对每个区间 [start, end]：
//   - start > b：完全不相交，加入 end-1 与 end（贪心选尽量靠右以覆盖更多后续区间）；
//   - start > a 且 start <= b：仅 b 在区间内，再补一个 end；
//   - 否则 a、b 均在区间内，无需添加。
function intersectionSizeTwo(intervals: number[][]): number {
  intervals.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  let result = 0;
  let a = -1; // 已选集合中倒数第二小（较小者）
  let b = -1; // 已选集合中最大者
  for (const [start, end] of intervals) {
    if (start > b) {
      // 完全不相交，需加入 2 个新元素
      result += 2;
      a = end - 1;
      b = end;
    } else if (start > a) {
      // 已有 1 个元素 (b) 在区间内，再补 1 个
      result += 1;
      a = b;
      b = end;
    }
    // 否则 a、b 均在区间内，无需添加
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 设置交集大小至少为2 =====");
console.log(
  "结果:",
  intersectionSizeTwo([
    [1, 3],
    [3, 7],
    [8, 9],
  ]),
); // 期望 5
console.log(
  "结果:",
  intersectionSizeTwo([
    [1, 2],
    [2, 3],
    [2, 4],
    [4, 5],
  ]),
); // 期望 5
console.log(
  "结果:",
  intersectionSizeTwo([
    [1, 2],
    [3, 4],
    [5, 6],
  ]),
); // 期望 6

export {};
