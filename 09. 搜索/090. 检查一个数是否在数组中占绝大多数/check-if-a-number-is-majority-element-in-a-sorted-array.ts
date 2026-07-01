// ============================================================
// 090. 检查一个数是否在数组中占绝大多数
// ============================================================
// LeetCode 1150. Check If a Number Is Majority Element in a Sorted Array
// 升序数组中 target 是否出现超过 n/2 次。

// 方法1：二分查找边界
function isMajorityElement(nums: number[], target: number): boolean {
  const first = findFirst(nums, target);
  if (first === -1) return false;
  const last = findLast(nums, target);
  return last - first + 1 > Math.floor(nums.length / 2);
}

function findFirst(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo] === target ? lo : -1;
}

function findLast(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (nums[mid] > target) hi = mid - 1;
    else lo = mid;
  }
  return nums[lo] === target ? lo : -1;
}

// 方法2：二分找出现次数
function isMajorityElementCount(nums: number[], target: number): boolean {
  let lo = 0;
  let hi = nums.length - 1;
  // 找第一个 >= target 的位置
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  const start = lo;
  // 检查 start + n/2 位置是否也是 target
  const n = nums.length;
  if (start + Math.floor(n / 2) < n && nums[start + Math.floor(n / 2)] === target) {
    return true;
  }
  return false;
}

// 方法3：线性扫描计数
function isMajorityElementLinear(nums: number[], target: number): boolean {
  let count = 0;
  for (const num of nums) {
    if (num === target) count++;
  }
  return count > Math.floor(nums.length / 2);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 检查一个数是否在数组中占绝大多数 =====");
console.log("二分 [2,4,5,5,5,5,5,6,6],5:", isMajorityElement([2, 4, 5, 5, 5, 5, 5, 6, 6], 5)); // true
console.log("二分 [10,100,101,101],101:", isMajorityElement([10, 100, 101, 101], 101)); // false
console.log("计数 [2,4,5,5,5,5,5,6,6],5:", isMajorityElementCount([2, 4, 5, 5, 5, 5, 5, 6, 6], 5)); // true

export {};
