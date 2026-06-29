// ============================================================
// 030. K 个关闭的灯泡
// ============================================================
// LeetCode 683. K Empty Slots
// n 个灯泡初始关闭，按 flowers 数组顺序逐个打开，求首次出现两朵花之间恰好有 k 朵未开花的位置（第几天）。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：有序集合 + 二分
function kEmptySlots(flowers: number[], k: number): number {
  const pos: number[] = []; // 已开花位置（有序）
  for (let i = 0; i < flowers.length; i++) {
    const p = flowers[i];
    let lo = 0;
    let hi = pos.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (pos[mid] < p) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0 && p - pos[lo - 1] - 1 === k) return i + 1;
    if (lo < pos.length && pos[lo] - p - 1 === k) return i + 1;
    pos.splice(lo, 0, p);
  }
  return -1;
}

// 方法2：滑动窗口
function kEmptySlotsWindow(flowers: number[], k: number): number {
  const n = flowers.length;
  const days: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) days[flowers[i]] = i + 1;
  let left = 1;
  let right = left + k + 1;
  let result = Infinity;
  for (let i = 1; i <= n; i++) {
    if (right > n) break;
    if (i === right) {
      let valid = true;
      for (let j = left + 1; j < right; j++) {
        if (days[j] < days[left] || days[j] < days[right]) {
          valid = false;
          break;
        }
      }
      if (valid) result = Math.min(result, Math.max(days[left], days[right]));
      left = i;
      right = left + k + 1;
    } else if (days[i] < days[left] || days[i] < days[right]) {
      left = i;
      right = left + k + 1;
    }
  }
  return result === Infinity ? -1 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. K 个关闭的灯泡 =====");
console.log("二分:", kEmptySlots([1, 3, 2], 1)); // 期望 2
console.log("窗口:", kEmptySlotsWindow([1, 2, 3], 1)); // 期望 -1

export {};
