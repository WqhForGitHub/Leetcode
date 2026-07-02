// ============================================================
// 184. 不同整数的最少数目
// ============================================================
// LeetCode 1481. Least Number of Unique Integers after K Removals
// 给定整数数组 arr 和整数 k，恰好移除 k 个元素后，
// 返回数组中剩余不同整数的最小数目。

// 方法1：频次统计 + 按频次排序 + 贪心移除（O(n log n)）
function findLeastNumOfUniqueInts(arr: number[], k: number): number {
  const freq = new Map<number, number>();
  for (const v of arr) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  // 按频次升序排序
  const freqs = [...freq.values()].sort((a, b) => a - b);
  let remain = freqs.length;
  let removed = 0;
  for (const f of freqs) {
    if (removed + f <= k) {
      removed += f;
      remain--;
    } else {
      break;
    }
  }
  return remain;
}

// 方法2：频次统计 + 桶排序（O(n)）
// 按频次分桶，从低频到高频依次移除。
function findLeastNumOfUniqueInts2(arr: number[], k: number): number {
  const freq = new Map<number, number>();
  for (const v of arr) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  const n = arr.length;
  // bucket[i] 表示频次为 i 的不同整数个数
  const bucket: number[] = new Array(n + 1).fill(0);
  for (const f of freq.values()) {
    bucket[f]++;
  }
  let remain = freq.size;
  let removed = 0;
  for (let f = 1; f <= n && removed < k; f++) {
    if (bucket[f] === 0) continue;
    // 每个频次为 f 的整数需要移除 f 个元素才能消除
    const full = Math.min(bucket[f], Math.floor((k - removed) / f));
    removed += full * f;
    remain -= full;
  }
  return remain;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 184. 不同整数的最少数目 =====");
console.log("方法1 [5,5,4], k=1:", findLeastNumOfUniqueInts([5, 5, 4], 1)); // 1
console.log("方法1 [4,3,1,1,3,3,2], k=3:", findLeastNumOfUniqueInts([4, 3, 1, 1, 3, 3, 2], 3)); // 2
console.log("方法2 [5,5,4], k=1:", findLeastNumOfUniqueInts2([5, 5, 4], 1)); // 1
console.log("方法2 [4,3,1,1,3,3,2], k=3:", findLeastNumOfUniqueInts2([4, 3, 1, 1, 3, 3, 2], 3)); // 2

export {};
