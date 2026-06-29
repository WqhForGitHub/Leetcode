// ============================================================
// 073. 避免洪水泛滥
// ============================================================
// LeetCode 1488. Avoid Flood in The City
// 湖泊下雨满，晴天可抽干一个湖，求抽干方案使不发生洪水。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：贪心 + 最小堆（按下次下雨）
function avoidFlood(rains: number[]): number[] {
  const result: number[] = new Array(rains.length).fill(-1);
  const full: Map<number, number> = new Map(); // 湖 -> 上次下雨日
  const dryDays: number[] = []; // 可用的晴天索引（有序）
  for (let i = 0; i < rains.length; i++) {
    if (rains[i] === 0) {
      dryDays.push(i);
      result[i] = 1;
    } else {
      const lake = rains[i];
      if (full.has(lake)) {
        // 找到上次下雨后第一个晴天
        const prev = full.get(lake)!;
        let lo = 0;
        let hi = dryDays.length - 1;
        let idx = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (dryDays[mid] > prev) {
            idx = mid;
            hi = mid - 1;
          } else lo = mid + 1;
        }
        if (idx === -1) return [];
        result[dryDays[idx]] = lake;
        dryDays.splice(idx, 1);
      }
      full.set(lake, i);
    }
  }
  return result;
}

// 方法2：有序集合（用排序数组 + 二分）
function avoidFloodSet(rains: number[]): number[] {
  const result: number[] = new Array(rains.length).fill(-1);
  const full: Map<number, number> = new Map();
  const dry: number[] = [];
  for (let i = 0; i < rains.length; i++) {
    if (rains[i] === 0) {
      dry.push(i);
      result[i] = 1;
      continue;
    }
    const lake = rains[i];
    if (full.has(lake)) {
      const prev = full.get(lake)!;
      let idx = -1;
      for (let j = 0; j < dry.length; j++) {
        if (dry[j] > prev) {
          idx = j;
          break;
        }
      }
      if (idx === -1) return [];
      result[dry[idx]] = lake;
      dry.splice(idx, 1);
    }
    full.set(lake, i);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 避免洪水泛滥 =====");
console.log("贪心:", avoidFlood([1, 2, 3, 4])); // 期望 [-1,-1,-1,-1]
console.log("贪心:", avoidFlood([1, 2, 0, 0, 2, 1])); // 期望 [-1,-1,2,1,-1,-1]
console.log("贪心:", avoidFlood([1, 2, 0, 1, 2])); // 期望 []

export {};
