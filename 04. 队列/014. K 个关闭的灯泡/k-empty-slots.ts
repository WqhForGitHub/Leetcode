// ============================================================
// 014. K 个关闭的灯泡
// ============================================================
// LeetCode 683. K Empty Slots
// 有 N 个灯泡排成一行，按 bulbs[i] 的顺序每天打开一个灯泡。
// 返回存在两个打开的灯泡之间恰好有 K 个关闭灯泡的最小天数，不存在返回 -1。

// ------------------------------------------------------------
// 方法1：滑动窗口 + 位置数组
// ------------------------------------------------------------
// days[i] 表示位置 i+1 的灯泡第几天开。用滑动窗口 [left, right] 满足
// 区间内所有 days 都大于两端的最小值，且区间长度为 K+1。
// 时间 O(n)，空间 O(n)。
function kEmptySlots1(bulbs: number[], k: number): number {
  const n = bulbs.length;
  const days: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    days[bulbs[i] - 1] = i + 1;
  }
  let left = 0;
  let right = k + 1;
  let result = Infinity;
  let i = 0;
  while (right < n) {
    // 检查 (left, right) 之间所有 days 是否都大于两端较小值
    for (i = left + 1; i < right; i++) {
      if (days[i] < days[left] || days[i] < days[right]) {
        break;
      }
    }
    if (i === right) {
      result = Math.min(result, Math.max(days[left], days[right]));
      left = right;
      right = left + k + 1;
    } else {
      left = i;
      right = left + k + 1;
    }
  }
  return result === Infinity ? -1 : result;
}

// ------------------------------------------------------------
// 方法2：有序集合
// ------------------------------------------------------------
// 按天顺序将位置插入有序集合，每次检查相邻位置的差是否为 K+1。
// 时间 O(n log n)，空间 O(n)。
function kEmptySlots2(bulbs: number[], k: number): number {
  const positions: number[] = [];
  for (let day = 0; day < bulbs.length; day++) {
    const pos = bulbs[day];
    // 二分查找插入位置
    let lo = 0;
    let hi = positions.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (positions[mid] < pos) lo = mid + 1;
      else hi = mid;
    }
    positions.splice(lo, 0, pos);
    // 检查左邻居
    if (lo > 0 && pos - positions[lo - 1] - 1 === k) {
      return day + 1;
    }
    // 检查右邻居
    if (lo < positions.length - 1 && positions[lo + 1] - pos - 1 === k) {
      return day + 1;
    }
  }
  return -1;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", kEmptySlots1([1, 3, 2], 1), "期望: 2");
  console.log("测试2:", kEmptySlots1([1, 2, 3], 1), "期望: -1");
  console.log("测试3:", kEmptySlots2([1, 3, 2], 1), "期望: 2");
  console.log("测试4:", kEmptySlots2([1, 2, 3], 1), "期望: -1");
}

test();

export {};
