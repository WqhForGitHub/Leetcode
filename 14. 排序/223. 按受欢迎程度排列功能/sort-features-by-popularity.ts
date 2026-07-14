// ============================================================
// 223. 按受欢迎程度排列功能
// ============================================================
// LeetCode 1772. Sort Features by Popularity
// 给定功能名数组 features 和 responses（每个元素是该回答中提及的功能列表）。
// 功能受欢迎度 = 提及该功能的回答数（同一回答内重复只算一次）。
// 按受欢迎度降序排列 features，并列时保持原数组顺序。

// 方法1：哈希表统计 + 带下标稳定排序（O(R + F log F)）
// 用 Map 统计每个功能被多少个回答提及（每条回答内用 Set 去重），
// 再带上原下标排序：先按计数降序，再按下标升序。
function sortFeatures1(features: string[], responses: string[][]): string[] {
  const count = new Map<string, number>();
  for (const feat of features) count.set(feat, 0);
  for (const resp of responses) {
    const seen = new Set<string>();
    for (const w of resp) {
      if (count.has(w) && !seen.has(w)) {
        seen.add(w);
        count.set(w, (count.get(w) ?? 0) + 1);
      }
    }
  }
  const indexed = features.map((f, i) => ({ f, i }));
  indexed.sort((a, b) => {
    const ca = count.get(a.f) ?? 0;
    const cb = count.get(b.f) ?? 0;
    if (cb !== ca) return cb - ca;
    return a.i - b.i;
  });
  return indexed.map((x) => x.f);
}

// 方法2：哈希表统计 + 索引比较器（O(R + F log F)）
// 思路同方法1，用功能集合做 O(1) 判定，比较器闭包捕获计数表与索引表。
function sortFeatures2(features: string[], responses: string[][]): string[] {
  const featSet = new Set(features);
  const count = new Map<string, number>();
  for (const feat of features) count.set(feat, 0);
  for (const resp of responses) {
    const seen = new Set<string>();
    for (const w of resp) {
      if (featSet.has(w) && !seen.has(w)) {
        seen.add(w);
        count.set(w, (count.get(w) ?? 0) + 1);
      }
    }
  }
  const indexMap = new Map<string, number>();
  features.forEach((f, i) => indexMap.set(f, i));
  const result = [...features];
  result.sort((a, b) => {
    const ca = count.get(a) ?? 0;
    const cb = count.get(b) ?? 0;
    if (cb !== ca) return cb - ca;
    return (indexMap.get(a) ?? 0) - (indexMap.get(b) ?? 0);
  });
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 223. 按受欢迎程度排列功能 =====");
const features1 = ["cooler", "lock", "cook"];
const responses1 = [
  ["a", "cooler", "lock"],
  ["cooler", "a", "lock"],
  ["cooler", "lock", "cook"],
];
console.log("方法1:", JSON.stringify(sortFeatures1(features1, responses1))); // ["cooler","lock","cook"]
console.log("方法2:", JSON.stringify(sortFeatures2(features1, responses1))); // ["cooler","lock","cook"]

const features2 = ["a", "aa", "b", "c"];
const responses2 = [
  ["a", "a", "a"],
  ["a", "aa", "a"],
  ["a", "a", "aa"],
];
console.log("方法1:", JSON.stringify(sortFeatures1(features2, responses2))); // ["a","aa","b","c"]
console.log("方法2:", JSON.stringify(sortFeatures2(features2, responses2))); // ["a","aa","b","c"]

export {};
