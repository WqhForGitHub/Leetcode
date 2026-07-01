// ============================================================
// 005. 字母异位词分组
// ============================================================
// LeetCode 49. Group Anagrams
// 将字母异位词组合在一起，字母异位词指字母相同但排列不同的字符串。

// 方法1：排序每个字符串作为键（时间 O(n*k*log k)，空间 O(n*k)）
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    const list = map.get(key);
    if (list) {
      list.push(s);
    } else {
      map.set(key, [s]);
    }
  }
  return Array.from(map.values());
}

// 方法2：字符计数作为键（时间 O(n*k)，空间 O(n*k)）
function groupAnagrams2(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const count = new Array<number>(26).fill(0);
    for (const ch of s) {
      count[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }
    // 用分隔符连接避免计数歧义，例如 [1,11,...] 与 [11,1,...]
    const key = count.join("#");
    const list = map.get(key);
    if (list) {
      list.push(s);
    } else {
      map.set(key, [s]);
    }
  }
  return Array.from(map.values());
}

// ============================================================
// 测试
// ============================================================
console.log("===== 005. 字母异位词分组 =====");
console.log("方法1:", groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// 期望: [["eat","tea","ate"],["tan","nat"],["bat"]] (顺序可能不同)
console.log("方法1:", groupAnagrams([""])); // 期望: [[""]]
console.log("方法1:", groupAnagrams(["a"])); // 期望: [["a"]]
console.log("方法2:", groupAnagrams2(["eat", "tea", "tan", "ate", "nat", "bat"]));
console.log("方法2:", groupAnagrams2([""])); // 期望: [[""]]

export {};
