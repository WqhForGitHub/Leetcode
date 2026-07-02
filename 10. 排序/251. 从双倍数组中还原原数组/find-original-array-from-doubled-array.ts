// ============================================================
// 251. 从双倍数组中还原原数组
// ============================================================
// LeetCode 2007. Find Original Array From Doubled Array
// 给定一个数组 changed，它是某个原数组 original 与 original 中每个元素的 2 倍
// 组合后再打乱得到的。长度为 2n。求出 original，若无法还原返回空数组。

// 方法1：排序 + 哈希表计数 + 贪心从小到大匹配其 2 倍
// 时间复杂度 O(n log n)
function findOriginalArray1(changed: number[]): number[] {
  const n = changed.length;
  if (n % 2 !== 0) return [];
  const count: Map<number, number> = new Map();
  for (const v of changed) count.set(v, (count.get(v) ?? 0) + 1);
  const sorted = [...changed].sort((a, b) => a - b);
  const res: number[] = [];
  for (const v of sorted) {
    const cnt = count.get(v) ?? 0;
    if (cnt === 0) continue;
    if (v === 0) {
      // 0 的双倍仍为 0，需要成对消费
      if (cnt < 2) return [];
      const pairs = Math.floor(cnt / 2);
      for (let i = 0; i < pairs; i++) res.push(0);
      count.set(0, cnt - pairs * 2);
      continue;
    }
    const double = v * 2;
    const dCnt = count.get(double) ?? 0;
    if (dCnt < cnt) return [];
    // 取出 v 作为原数组元素
    for (let i = 0; i < cnt; i++) res.push(v);
    count.set(v, 0);
    count.set(double, dCnt - cnt);
  }
  if (res.length !== n / 2) return [];
  return res;
}

// 方法2：排序 + 多重集合式计数 + 始终处理最小元素
// 时间复杂度 O(n log n)
function findOriginalArray2(changed: number[]): number[] {
  const n = changed.length;
  if (n % 2 !== 0) return [];
  const count: Map<number, number> = new Map();
  for (const v of changed) count.set(v, (count.get(v) ?? 0) + 1);
  const sorted = [...new Set(changed)].sort((a, b) => a - b);
  const res: number[] = [];
  for (const v of sorted) {
    const cnt = count.get(v) ?? 0;
    if (cnt === 0) continue;
    if (v === 0) {
      if (cnt % 2 !== 0) return [];
      for (let i = 0; i < cnt / 2; i++) res.push(0);
      continue;
    }
    const double = v * 2;
    const dCnt = count.get(double) ?? 0;
    if (dCnt < cnt) return [];
    for (let i = 0; i < cnt; i++) res.push(v);
    count.set(double, dCnt - cnt);
  }
  return res.length === n / 2 ? res : [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 251. 从双倍数组中还原原数组 =====");
console.log("方法1 [1,3,4,2,6,8]:", findOriginalArray1([1, 3, 4, 2, 6, 8]));
console.log("方法1 [6,3,0,1]:", findOriginalArray1([6, 3, 0, 1]));
console.log("方法1 [1]:", findOriginalArray1([1]));
console.log("方法2 [1,3,4,2,6,8]:", findOriginalArray2([1, 3, 4, 2, 6, 8]));
console.log("方法2 [6,3,0,1]:", findOriginalArray2([6, 3, 0, 1]));
console.log("方法2 [1]:", findOriginalArray2([1]));

export {};
