// ============================================================
// 231. 减小和重新排列数组后的最大元素
// ============================================================
// LeetCode 1846. Maximum Element After Decreasing and Rearranging
// 可以重新排列数组，且可以减小元素。要求 arr[0] == 1，相邻元素差 <= 1。
// 求满足条件后数组最后一个元素的最大可能值。

// 方法1：排序 + 贪心（O(n log n)）
// 升序排序后，把首元素置为 1，后续每个元素至多为前一个 + 1（超出则减小）。
function maximumElementAfterDecrementingAndRearranging(arr: number[]): number {
  arr.sort((a, b) => a - b);
  arr[0] = 1;
  for (let i = 1; i < arr.length; i++) {
    arr[i] = Math.min(arr[i], arr[i - 1] + 1);
  }
  return arr[arr.length - 1];
}

// 方法2：排序 + 累加（O(n log n)）
// 不修改原数组（拷贝排序），用累加变量 cur 表示当前位置能取到的最大值：
// cur = min(当前值, cur + 1)，初值 0 使首元素变为 1。
function maximumElementAfterDecrementingAndRearranging2(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  let cur = 0;
  for (const v of sorted) {
    cur = Math.min(v, cur + 1);
  }
  return cur;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 231. 减小和重新排列数组后的最大元素 =====");
console.log("方法1 [2,2,1,2,1]:", maximumElementAfterDecrementingAndRearranging([2, 2, 1, 2, 1]));
console.log("方法2 [2,2,1,2,1]:", maximumElementAfterDecrementingAndRearranging2([2, 2, 1, 2, 1]));
console.log("方法1 [100,3,2,1]:", maximumElementAfterDecrementingAndRearranging([100, 3, 2, 1]));
console.log("方法2 [100,3,2,1]:", maximumElementAfterDecrementingAndRearranging2([100, 3, 2, 1]));
console.log("方法1 [1,2,3,4,5]:", maximumElementAfterDecrementingAndRearranging([1, 2, 3, 4, 5]));
console.log("方法2 [1,2,3,4,5]:", maximumElementAfterDecrementingAndRearranging2([1, 2, 3, 4, 5]));

export {};
