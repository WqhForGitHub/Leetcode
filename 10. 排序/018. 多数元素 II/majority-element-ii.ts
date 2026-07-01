// ============================================================
// 018. 多数元素 II
// ============================================================
// LeetCode 229. Majority Element II
// 给定大小为 n 的整数数组，找出所有出现次数大于 ⌊n/3⌋ 的元素。

// 方法1：Boyer-Moore 摩尔投票法（推荐，O(n)，O(1)）
// 出现次数超过 n/3 的元素最多有 2 个，使用两个候选人进行投票。
function majorityElement(nums: number[]): number[] {
  const n: number = nums.length;
  let cand1: number = 0;
  let cand2: number = 1;
  let count1: number = 0;
  let count2: number = 0;

  // 第一轮投票
  for (const num of nums) {
    if (num === cand1) {
      count1++;
    } else if (num === cand2) {
      count2++;
    } else if (count1 === 0) {
      cand1 = num;
      count1 = 1;
    } else if (count2 === 0) {
      cand2 = num;
      count2 = 1;
    } else {
      count1--;
      count2--;
    }
  }

  // 第二轮验证
  count1 = 0;
  count2 = 0;
  for (const num of nums) {
    if (num === cand1) count1++;
    else if (num === cand2) count2++;
  }

  const res: number[] = [];
  const threshold: number = Math.floor(n / 3);
  if (count1 > threshold) res.push(cand1);
  if (count2 > threshold) res.push(cand2);
  return res;
}

// 方法2：哈希表计数（O(n)，O(n)）
function majorityElement2(nums: number[]): number[] {
  const n: number = nums.length;
  const map = new Map<number, number>();
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1);
  }

  const res: number[] = [];
  const threshold: number = Math.floor(n / 3);
  for (const [num, count] of map) {
    if (count > threshold) res.push(num);
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 多数元素 II =====");
console.log("方法1:", majorityElement([3, 2, 3])); // 期望 [3]
console.log("方法1:", majorityElement([1])); // 期望 [1]
console.log("方法1:", majorityElement([1, 1, 1, 3, 3, 2, 2, 2])); // 期望 [1,2]
console.log("方法2:", majorityElement2([3, 2, 3])); // 期望 [3]
console.log("方法2:", majorityElement2([1, 1, 1, 3, 3, 2, 2, 2])); // 期望 [1,2]

export {};
