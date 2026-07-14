// ============================================================
// 131. 将 x 减到 0 的最小操作数
// ============================================================
// LeetCode 1658. Minimum Operations to Reduce X to Zero
// 每次从数组最左或最右减去元素使 x 变 0，求最少操作数。

// 方法1：逆向思维（找最长的和为 sum-x 的子数组）
function minOperations(nums: number[], x: number): number {
  const total = nums.reduce((a, b) => a + b, 0);
  const target = total - x;
  if (target < 0) return -1;
  if (target === 0) return nums.length;
  // 找最长的和为 target 的连续子数组
  let left = 0;
  let sum = 0;
  let maxLen = -1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target) {
      sum -= nums[left++];
    }
    if (sum === target) {
      maxLen = Math.max(maxLen, right - left + 1);
    }
  }
  return maxLen === -1 ? -1 : nums.length - maxLen;
}

// 方法2：前缀和 + 哈希表
function minOperationsPrefix(nums: number[], x: number): number {
  const n = nums.length;
  const prefixSum = [0];
  for (let i = 0; i < n; i++) {
    prefixSum.push(prefixSum[i] + nums[i]);
  }
  const suffixMap = new Map<number, number>();
  let suffixSum = 0;
  suffixMap.set(0, 0);
  for (let i = n - 1; i >= 0; i--) {
    suffixSum += nums[i];
    if (!suffixMap.has(suffixSum)) {
      suffixMap.set(suffixSum, n - i);
    }
  }
  let result = Infinity;
  for (let i = 0; i <= n; i++) {
    const need = x - prefixSum[i];
    if (suffixMap.has(need)) {
      const totalOps = i + suffixMap.get(need)!;
      if (totalOps <= n) {
        result = Math.min(result, totalOps);
      }
    }
  }
  return result === Infinity ? -1 : result;
}

// 方法3：二分查找（前缀和 + 后缀和）
function minOperationsBinary(nums: number[], x: number): number {
  const n = nums.length;
  const prefix = [0];
  for (let i = 0; i < n; i++) prefix.push(prefix[i] + nums[i]);
  let result = Infinity;
  // 前缀取 i 个，后缀需要 x - prefix[i]
  for (let i = 0; i <= n && prefix[i] <= x; i++) {
    const need = x - prefix[i];
    // 在后缀和中二分查找
    const lo = i;
    let hi = n;
    let suffixSum: number;
    while (lo < hi) {
      suffixSum = 0;
      let j = n - 1;
      let cnt = 0;
      while (cnt < hi - lo && suffixSum < need) {
        suffixSum += nums[j--];
        cnt++;
      }
      if (suffixSum === need) {
        result = Math.min(result, i + (hi - lo));
        break;
      }
      if (suffixSum < need) break;
      hi--;
    }
  }
  return result === Infinity ? -1 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 131. 将 x 减到 0 的最小操作数 =====");
console.log("逆向 [1,1,4,2,3],5:", minOperations([1, 1, 4, 2, 3], 5)); // 2
console.log("逆向 [5,6,7,8,9],4:", minOperations([5, 6, 7, 8, 9], 4)); // -1
console.log("逆向 [3,2,20,1,1,3],10:", minOperations([3, 2, 20, 1, 1, 3], 10)); // 5

export {};
