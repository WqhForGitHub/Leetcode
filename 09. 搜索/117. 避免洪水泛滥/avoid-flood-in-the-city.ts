// ============================================================
// 117. 避免洪水泛滥
// ============================================================
// LeetCode 1488. Avoid Flood in The City
// 湖泊数组， rains[i]>0 表示第 i 天湖泊 rains[i] 下雨，0 表示可抽干一个湖。
// 避免同一湖两次下雨之间不抽干。返回操作数组。

// 方法1：贪心 + 有序集合（二分查找）
function avoidFlood(rains: number[]): number[] {
  const n = rains.length;
  const result = new Array(n).fill(-1);
  const full = new Map<number, number>(); // 湖 -> 上次下雨的天
  const dryDays: number[] = []; // 可抽干的天（索引）
  for (let i = 0; i < n; i++) {
    if (rains[i] > 0) {
      const lake = rains[i];
      if (full.has(lake)) {
        // 需要在 full.get(lake) 之后找一个晴天抽干
        const prevDay = full.get(lake)!;
        // 二分找第一个 > prevDay 的晴天
        let lo = 0;
        let hi = dryDays.length - 1;
        let idx = -1;
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (dryDays[mid] > prevDay) {
            idx = mid;
            hi = mid - 1;
          } else {
            lo = mid + 1;
          }
        }
        if (idx === -1) return []; // 无法避免洪水
        result[dryDays[idx]] = lake;
        dryDays.splice(idx, 1);
      }
      full.set(lake, i);
    } else {
      dryDays.push(i);
    }
  }
  // 剩余晴天填任意湖（填1）
  for (const day of dryDays) {
    result[day] = 1;
  }
  return result;
}

// 方法2：贪心 + TreeMap（类似方法1）
function avoidFloodAlt(rains: number[]): number[] {
  const n = rains.length;
  const result = new Array(n).fill(-1);
  const full = new Map<number, number>();
  const sunnyDays: number[] = [];
  for (let i = 0; i < n; i++) {
    if (rains[i] === 0) {
      sunnyDays.push(i);
      result[i] = 1; // 默认填1
    } else {
      const lake = rains[i];
      if (full.has(lake)) {
        const lastRain = full.get(lake)!;
        // 在 sunnyDays 中二分找 > lastRain 的
        let lo = 0;
        let hi = sunnyDays.length;
        while (lo < hi) {
          const mid = Math.floor((lo + hi) / 2);
          if (sunnyDays[mid] > lastRain) hi = mid;
          else lo = mid + 1;
        }
        if (lo === sunnyDays.length) return [];
        result[sunnyDays[lo]] = lake;
        sunnyDays.splice(lo, 1);
      }
      full.set(lake, i);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 117. 避免洪水泛滥 =====");
console.log("贪心 [1,2,3,4]:", avoidFlood([1, 2, 3, 4])); // [-1,-1,-1,-1]
console.log("贪心 [1,2,0,0,2,1]:", avoidFlood([1, 2, 0, 0, 2, 1])); // [-1,-1,2,1,-1,-1]
console.log("贪心 [1,2,0,1,2]:", avoidFlood([1, 2, 0, 1, 2])); // []

export {};
