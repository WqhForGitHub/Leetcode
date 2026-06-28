// ============================================================
// 090. 下一个更大元素 I
// ============================================================
// LeetCode 496. Next Greater Element I
// nums1 是 nums2 的子集，对 nums1 每个元素找其在 nums2 中右侧第一个更大元素
// 思路：单调栈处理 nums2 得到每个元素的下一个更大元素，用哈希表存映射，再查 nums1
// 时间复杂度：O(n + m)，空间复杂度：O(n)

function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  // 哈希表：元素值 -> 下一个更大元素值
  const nextGreater = new Map<number, number>();
  // 单调递减栈（存元素值）
  const stack: number[] = [];

  for (const num of nums2) {
    // 当前元素大于栈顶时，栈顶的下一个更大元素就是当前元素
    while (stack.length > 0 && stack[stack.length - 1] < num) {
      nextGreater.set(stack.pop()!, num);
    }
    stack.push(num);
  }

  // 栈中剩余元素没有下一个更大元素
  while (stack.length > 0) {
    nextGreater.set(stack.pop()!, -1);
  }

  // 根据 nums1 查询结果
  return nums1.map((num) => nextGreater.get(num) ?? -1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 下一个更大元素 I =====");
console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // 期望输出: [-1, 3, -1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])); // 期望输出: [3, -1]
console.log(nextGreaterElement([1], [1])); // 期望输出: [-1]

export {};
