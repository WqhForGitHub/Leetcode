// ============================================================
// 198. 检查字符串是否可以通过排序子字符串得到另一个字符串
// ============================================================
// LeetCode 1585. Check If String Is Transformable With Substring Sort Operations
// 通过对 s 的任意子字符串进行排序操作（可多次），判断是否能得到 t。

// 方法1：记录每个数字位置队列 + 贪心匹配（O(n * 10)）
function isTransformable(s: string, t: string): boolean {
  // 记录 s 中每个数字 0-9 的位置队列
  const positions: number[][] = Array.from({ length: 10 }, () => []);
  for (let i = 0; i < s.length; i++) {
    positions[parseInt(s[i])].push(i);
  }
  // 记录每个位置已被使用的标记
  const used = new Array<boolean>(s.length).fill(false);
  for (let i = 0; i < t.length; i++) {
    const d = parseInt(t[i]);
    if (positions[d].length === 0) return false;
    const pos = positions[d][0];
    // 检查是否存在比 d 小的数字在 pos 之前且未被使用
    for (let smaller = 0; smaller < d; smaller++) {
      for (const p of positions[smaller]) {
        if (p < pos && !used[p]) return false;
        if (p >= pos) break;
      }
    }
    used[pos] = true;
    positions[d].shift();
  }
  return true;
}

// 方法2：数字位置队列 + 前缀已用计数优化（O(n * 10)）
// 用 BIT/前缀和优化检查"比 d 小的数字是否有未用的在 pos 前"
function isTransformable2(s: string, t: string): boolean {
  const n = s.length;
  const pos: number[][] = Array.from({ length: 10 }, () => []);
  for (let i = 0; i < n; i++) {
    pos[parseInt(s[i])].push(i);
  }
  // 已使用的位置集合（有序数组），用于二分查找比 pos 小的已使用数
  const usedList: number[] = [];
  for (let i = 0; i < n; i++) {
    const d = parseInt(t[i]);
    if (pos[d].length === 0) return false;
    const curPos = pos[d][0];
    // 统计在 curPos 之前已经被使用的位置数量
    // 二分查找 usedList 中 < curPos 的元素个数
    let lo = 0;
    let hi = usedList.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (usedList[mid] < curPos) lo = mid + 1;
      else hi = mid;
    }
    const usedBefore = lo;
    // curPos 之前共有 curPos 个原始位置，其中 usedBefore 个已用，
    // 所以 curPos 在 s 中的实际"有效前缀位置" = curPos - usedBefore
    // 检查比 d 小的数字是否有在 curPos 之前未被使用的
    for (let smaller = 0; smaller < d; smaller++) {
      // pos[smaller] 中小于 curPos 且未被使用的数量
      // 已用位置中属于 smaller 的数量 = 在 usedList 中 < curPos 的 smaller 原始位置
      // 简化：检查 pos[smaller] 中第一个 >= curPos 的位置之前的元素数
      let idx = 0;
      while (idx < pos[smaller].length && pos[smaller][idx] < curPos) idx++;
      // idx 个 smaller 数字在 curPos 之前
      // 其中已使用的数量需要从 usedList 计算（这里简化：所有 smaller 在 curPos 前都应已被用）
      // 如果存在未使用的 smaller 在 curPos 前，返回 false
      if (idx > 0) {
        // 统计 usedList 中 < curPos 且属于 smaller 的数量
        let usedSmaller = 0;
        for (const u of usedList) {
          if (u >= curPos) break;
          if (parseInt(s[u]) === smaller) usedSmaller++;
        }
        if (usedSmaller < idx) return false;
      }
    }
    // 插入 curPos 到 usedList（保持有序）
    let insertIdx = 0;
    while (insertIdx < usedList.length && usedList[insertIdx] < curPos) insertIdx++;
    usedList.splice(insertIdx, 0, curPos);
    pos[d].shift();
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 198. 检查字符串是否可以通过排序子字符串得到另一个字符串 =====");
console.log("方法1:", isTransformable("84532", "34852")); // true
console.log("方法2:", isTransformable2("84532", "34852")); // true
console.log("方法1:", isTransformable("34521", "23415")); // true
console.log("方法2:", isTransformable2("34521", "23415")); // true
console.log("方法1:", isTransformable("12345", "12435")); // false
console.log("方法2:", isTransformable2("12345", "12435")); // false

export {};
