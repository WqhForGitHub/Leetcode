// ============================================================
// 145. 最小绝对差
// ============================================================
// LeetCode 1200. Minimum Absolute Difference
// 给定整数数组，找出所有具有最小绝对差的元素对，按升序返回。

// 方法1：排序 + 扫描相邻元素（推荐，O(n log n)）
// 排序后，最小绝对差必然出现在相邻元素之间。
function minimumAbsDifference(arr: number[]): number[][] {
  arr.sort((a, b) => a - b);
  let minDiff: number = Infinity;
  const result: number[][] = [];
  for (let i = 1; i < arr.length; i++) {
    const diff: number = arr[i] - arr[i - 1];
    if (diff < minDiff) {
      minDiff = diff;
      result.length = 0;
      result.push([arr[i - 1], arr[i]]);
    } else if (diff === minDiff) {
      result.push([arr[i - 1], arr[i]]);
    }
  }
  return result;
}

// 方法2：排序 + 两趟扫描（O(n log n)）
// 第一趟求最小差，第二趟收集结果，逻辑更直观。
function minimumAbsDifference2(arr: number[]): number[][] {
  arr.sort((a, b) => a - b);
  let minDiff: number = Infinity;
  for (let i = 1; i < arr.length; i++) {
    minDiff = Math.min(minDiff, arr[i] - arr[i - 1]);
  }
  const result: number[][] = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] === minDiff) {
      result.push([arr[i - 1], arr[i]]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 145. 最小绝对差 =====");
console.log("方法1:", JSON.stringify(minimumAbsDifference([4, 2, 1, 3]))); // 期望: [[1,2],[2,3],[3,4]]
console.log("方法1:", JSON.stringify(minimumAbsDifference([1, 3, 6, 10, 15]))); // 期望: [[1,3]]
console.log("方法1:", JSON.stringify(minimumAbsDifference([3, 8, -10, 23, 19, -4, -14, 27]))); // 期望: [[-14,-10],[19,23],[23,27]]
console.log("方法2:", JSON.stringify(minimumAbsDifference2([4, 2, 1, 3]))); // 期望: [[1,2],[2,3],[3,4]]

export {};
