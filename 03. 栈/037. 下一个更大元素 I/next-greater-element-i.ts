// ============================================================
// 037. 下一个更大元素 I
// ============================================================
// LeetCode 496. Next Greater Element I
// nums1 是 nums2 的子集。对 nums1 每个元素，找其在 nums2 中右侧第一个更大的元素。

// ------------------------------------------------------------
// 方法1：单调栈 + 哈希表
// ------------------------------------------------------------
// 对 nums2 用单调递减栈预处理「每个元素的下一个更大元素」，存入哈希表。
// 再查 nums1。时间 O(n+m)，空间 O(n)。
function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const nextGreater: Record<number, number> = {};
  const stack: number[] = [];
  for (const num of nums2) {
    while (stack.length > 0 && stack[stack.length - 1] < num) {
      nextGreater[stack.pop()!] = num;
    }
    stack.push(num);
  }
  // 栈中剩余元素没有更大值
  while (stack.length > 0) {
    nextGreater[stack.pop()!] = -1;
  }
  return nums1.map((n) => nextGreater[n]);
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", nextGreaterElement([4, 1, 2], [1, 3, 4, 2]), "期望: [-1,3,-1]");
  console.log("测试2:", nextGreaterElement([2, 4], [1, 2, 3, 4]), "期望: [3,-1]");
}

test();

export {};
