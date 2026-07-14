// ============================================================
// 054. 给定数字能组成的最大时间
// ============================================================
// LeetCode 949. Largest Time for Given Digits
// 给定4个数字（0-9），用其组成最大的24小时制合法时间 "HH:MM"。无解返回 ""。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(全排列) (推荐)
// 对4个数字全排列，过滤出合法时间（HH<24, MM<60），记录最大值。
// 时间复杂度 O(4! * 4) = O(96), 空间复杂度 O(4)
function largestTimeFromDigits(arr: number[]): string {
  const n = arr.length;
  const used = new Array<boolean>(n).fill(false);
  const path: number[] = [];
  let bestMinutes = -1;

  const backtrack = (): void => {
    if (path.length === 4) {
      const hh = path[0] * 10 + path[1];
      const mm = path[2] * 10 + path[3];
      if (hh < 24 && mm < 60) {
        const minutes = hh * 60 + mm;
        if (minutes > bestMinutes) bestMinutes = minutes;
      }
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      // 跳过相同数字避免重复
      if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(arr[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  // 排序以便去重
  arr.sort((a, b) => a - b);
  backtrack();

  if (bestMinutes === -1) return "";
  const hh = Math.floor(bestMinutes / 60);
  const mm = bestMinutes % 60;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

// 方法2：排序+枚举
// 枚举所有4!排列组合，过滤合法并取最大。简单直观。
// 时间复杂度 O(4!) = O(24), 空间复杂度 O(1)
function largestTimeFromDigitsEnum(arr: number[]): string {
  let bestMinutes = -1;
  // 枚举4个位置的不同下标排列
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (j === i) continue;
      for (let k = 0; k < 4; k++) {
        if (k === i || k === j) continue;
        const l = 6 - i - j - k; // 0+1+2+3=6
        const hh = arr[i] * 10 + arr[j];
        const mm = arr[k] * 10 + arr[l];
        if (hh < 24 && mm < 60) {
          const minutes = hh * 60 + mm;
          if (minutes > bestMinutes) bestMinutes = minutes;
        }
      }
    }
  }
  if (bestMinutes === -1) return "";
  const hh = Math.floor(bestMinutes / 60);
  const mm = bestMinutes % 60;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 054. 给定数字能组成的最大时间 =====");
console.log(largestTimeFromDigits([1, 2, 3, 4])); // 期望结果: "23:41"
console.log(largestTimeFromDigits([5, 5, 5, 5])); // 期望结果: ""
console.log(largestTimeFromDigitsEnum([1, 2, 3, 4])); // 期望结果: "23:41"
console.log(largestTimeFromDigitsEnum([5, 5, 5, 5])); // 期望结果: ""

export {};
