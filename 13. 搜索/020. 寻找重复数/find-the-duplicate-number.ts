// ============================================================
// 020. 寻找重复数
// ============================================================
// LeetCode 287. Find the Duplicate Number
// 给定 n+1 个整数的数组，每个元素在 [1, n] 范围内，只有一个重复整数，找出它。
// 不能修改数组，只能使用常量额外空间。

// 方法1：二分查找（O(n log n)）
function findDuplicate(nums: number[]): number {
  const n = nums.length - 1;
  let left = 1;
  let right = n;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    let count = 0;
    for (const num of nums) {
      if (num <= mid) count++;
    }
    if (count > mid) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

// 方法2：快慢指针（O(n)，类似检测链表环）
function findDuplicateFloyd(nums: number[]): number {
  let slow = nums[0];
  let fast = nums[0];
  // 找到相遇点
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  // 找到入口
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}

// 方法3：位运算
function findDuplicateBit(nums: number[]): number {
  const n = nums.length - 1;
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let count1 = 0;
    let count2 = 0;
    const mask = 1 << bit;
    for (let i = 0; i <= n; i++) {
      if (i & mask) count2++;
      if (nums[i] & mask) count1++;
    }
    if (count1 > count2) {
      result |= mask;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 寻找重复数 =====");
console.log("二分 [1,3,4,2,2]:", findDuplicate([1, 3, 4, 2, 2])); // 2
console.log("二分 [3,1,3,4,2]:", findDuplicate([3, 1, 3, 4, 2])); // 3
console.log("快慢指针 [1,3,4,2,2]:", findDuplicateFloyd([1, 3, 4, 2, 2])); // 2
console.log("位运算 [3,1,3,4,2]:", findDuplicateBit([3, 1, 3, 4, 2])); // 3

export {};
