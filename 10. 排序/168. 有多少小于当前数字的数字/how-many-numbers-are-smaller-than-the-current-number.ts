// ============================================================
// 168. 有多少小于当前数字的数字
// ============================================================
// LeetCode 1365. How Many Numbers Are Smaller Than the Current Number
// 对每个 nums[i]，统计数组中有多少个 nums[j] < nums[i]，返回结果数组。

// 方法1：排序 + 二分查找下界（O(n log n)）
function smallerNumbersThanCurrent1(nums: number[]): number[] {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const res: number[] = [];
  for (const v of nums) {
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    res.push(lo);
  }
  return res;
}

// 方法2：计数排序（O(n + W)，W=101）
function smallerNumbersThanCurrent2(nums: number[]): number[] {
  const W = 101;
  const freq = new Array<number>(W).fill(0);
  for (const v of nums) freq[v]++;
  // less[v] = 小于 v 的元素总数 = freq[0..v-1] 之和
  const less = new Array<number>(W).fill(0);
  let running = 0;
  for (let i = 0; i < W; i++) {
    less[i] = running;
    running += freq[i];
  }
  return nums.map((v) => less[v]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 168. 有多少小于当前数字的数字 =====");
console.log("方法1 [8,1,2,2,3]:", smallerNumbersThanCurrent1([8, 1, 2, 2, 3])); // [4,0,1,1,3]
console.log("方法2 [8,1,2,2,3]:", smallerNumbersThanCurrent2([8, 1, 2, 2, 3])); // [4,0,1,1,3]
console.log("方法1 [6,5,4,8]:", smallerNumbersThanCurrent1([6, 5, 4, 8])); // [2,1,0,3]
console.log("方法2 [7,7,7,7]:", smallerNumbersThanCurrent2([7, 7, 7, 7])); // [0,0,0,0]

export {};
