// ============================================================
// 128. 数组的度
// ============================================================
// LeetCode 697. Degree of an Array
// 数组的度指出现次数最多的元素的频次。找到与原数组相同度的最短连续子数组长度。
// 时间复杂度：O(n)，空间复杂度：O(n)

function findShortestSubArray(nums: number[]): number {
  // 哈希表：值 -> [首次出现位置, 末次出现位置, 出现次数]
  const info = new Map<number, [number, number, number]>();

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (!info.has(num)) {
      info.set(num, [i, i, 1]);
    } else {
      const data = info.get(num)!;
      data[1] = i; // 更新末次位置
      data[2]++; // 次数+1
    }
  }

  // 找最大频次
  let maxFreq = 0;
  for (const [, , freq] of info.values()) {
    maxFreq = Math.max(maxFreq, freq);
  }

  // 在最大频次元素中找最短子数组长度
  let minLen = nums.length;
  for (const [first, last, freq] of info.values()) {
    if (freq === maxFreq) {
      minLen = Math.min(minLen, last - first + 1);
    }
  }
  return minLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 128. 数组的度 =====");
// 测试 1
console.log(findShortestSubArray([1, 2, 2, 3, 1])); // 期望: 2 ([2,2])
// 测试 2
console.log(findShortestSubArray([1, 2, 2, 3, 1, 4, 2])); // 期望: 6

export {};
