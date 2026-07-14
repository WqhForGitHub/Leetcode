// ============================================================
// 083. 重构字符串
// ============================================================
// LeetCode 767. Reorganize String
// 给定一个字符串，重新排列使得任意两个相邻字符不相同，返回任意可行解。

// 方法1：最大堆贪心（推荐，O(n log 26) = O(n)）
// 思路：每次从堆中取出出现次数最多的两个字符，交替放入结果。
//       如果某个字符剩余次数>0，放回堆中。最后如果堆中还剩一个字符，直接追加。
function reorganizeString(s: string): string {
  const counts: number[] = new Array(26).fill(0);
  for (const c of s) {
    counts[c.charCodeAt(0) - 97]++;
  }

  // 检查是否可能：某字符出现次数超过半数则不可能
  const maxCount = Math.max(...counts);
  if (maxCount > Math.floor((s.length + 1) / 2)) return "";

  // 构建最大堆（用数组模拟，按 count 降序）
  // 元素: [字符索引, 出现次数]
  const heap: [number, number][] = [];
  for (let i = 0; i < 26; i++) {
    if (counts[i] > 0) heap.push([i, counts[i]]);
  }

  const sortHeap = (): void => {
    heap.sort((a, b) => b[1] - a[1]);
  };
  sortHeap();

  const result: string[] = [];

  while (heap.length >= 2) {
    // 取出出现次数最多的两个字符
    const [c1, cnt1] = heap.shift()!;
    const [c2, cnt2] = heap.shift()!;

    result.push(String.fromCharCode(c1 + 97));
    result.push(String.fromCharCode(c2 + 97));

    // 如果还有剩余，放回堆
    if (cnt1 > 1) heap.push([c1, cnt1 - 1]);
    if (cnt2 > 1) heap.push([c2, cnt2 - 1]);

    sortHeap();
  }

  // 堆中最多剩一个字符，次数应为 1
  if (heap.length === 1) {
    result.push(String.fromCharCode(heap[0][0] + 97));
  }

  return result.join("");
}

// 方法2：计数 + 奇偶位置放置（O(n)）
// 思路：先找到出现次数最多的字符，将其放在偶数位置（0, 2, 4...），
//       然后将其余字符按顺序填入剩余位置。
function reorganizeString2(s: string): string {
  const counts: number[] = new Array(26).fill(0);
  for (const c of s) {
    counts[c.charCodeAt(0) - 97]++;
  }

  // 找出现次数最多的字符
  let maxCount = 0;
  let maxChar = 0;
  for (let i = 0; i < 26; i++) {
    if (counts[i] > maxCount) {
      maxCount = counts[i];
      maxChar = i;
    }
  }

  // 如果最多字符超过半数，不可能
  if (maxCount > Math.floor((s.length + 1) / 2)) return "";

  const result: string[] = new Array(s.length).fill("");
  let idx = 0;

  // 先放出现最多的字符到偶数位置
  while (counts[maxChar] > 0) {
    result[idx] = String.fromCharCode(maxChar + 97);
    idx += 2;
    counts[maxChar]--;
  }

  // 放其余字符
  for (let i = 0; i < 26; i++) {
    while (counts[i] > 0) {
      if (idx >= s.length) idx = 1; // 偶数位置放满，切换到奇数位置
      result[idx] = String.fromCharCode(i + 97);
      idx += 2;
      counts[i]--;
    }
  }

  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 083. 重构字符串 =====");

console.log("测试1:", reorganizeString("aab")); // 期望: "aba"
console.log("测试2:", reorganizeString("aaab")); // 期望: "" (不可能)
console.log("测试3:", reorganizeString("aabbcc")); // 期望: "abcabc" 或类似

console.log("方法2测试1:", reorganizeString2("aab")); // 期望: "aba"
console.log("方法2测试2:", reorganizeString2("aaab")); // 期望: "" (不可能)
console.log("方法2测试3:", reorganizeString2("aabbcc")); // 期望: "abcabc" 或类似

export {};
