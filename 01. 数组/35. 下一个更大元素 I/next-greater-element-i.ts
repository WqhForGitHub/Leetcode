// ============================================================
// 35. 下一个更大元素 I
// ============================================================
// LeetCode 496. Next Greater Element I
// 给定两个无重复元素数组 nums1（nums2的子集）和 nums2，对 nums1 中每个元素，
// 找其在 nums2 中右边第一个更大的元素。
// 时间复杂度：O(n+m)，空间复杂度：O(n)

// 方法1：单调栈+哈希表（推荐）
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  // 哈希表：记录 nums2 中每个元素的"下一个更大元素"
  const nextGreater = new Map<number, number>();
  // 单调递减栈（存元素值），用于找右侧第一个更大值
  const stack: number[] = [];

  for (const num of nums2) {
    // 当前元素大于栈顶时，栈顶的"下一个更大元素"就是当前元素
    while (stack.length > 0 && stack[stack.length - 1] < num) {
      const top = stack.pop()!;
      nextGreater.set(top, num);
    }
    stack.push(num);
  }

  // 栈中剩余元素没有下一个更大元素，设为 -1
  while (stack.length > 0) {
    const top = stack.pop()!;
    nextGreater.set(top, -1);
  }

  // 根据 nums1 查询结果
  return nums1.map((num) => nextGreater.get(num)!);
}

// 方法2：暴力双循环
function nextGreaterElementBruteForce(nums1: number[], nums2: number[]): number[] {
  const result: number[] = [];

  for (const num of nums1) {
    // 先在 nums2 中找到 num 的位置
    const index = nums2.indexOf(num);
    let found = -1;
    // 从该位置向右找第一个更大的元素
    for (let i = index + 1; i < nums2.length; i++) {
      if (nums2[i] > num) {
        found = nums2[i];
        break;
      }
    }
    result.push(found);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 35. 下一个更大元素 I =====");
console.log("描述:", nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // 期望结果: [-1,3,-1]
console.log("描述:", nextGreaterElement([2, 4], [1, 2, 3, 4])); // 期望结果: [3,-1]
console.log("描述:", nextGreaterElementBruteForce([4, 1, 2], [1, 3, 4, 2])); // 期望结果: [-1,3,-1]

export {};
