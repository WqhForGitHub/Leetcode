// ============================================================
// 086. 环形数组是否存在循环
// ============================================================
// LeetCode 457. Circular Array Loop
// 环形数组 nums，nums[i] 表示从 i 向前或向后移动的步数，判断是否存在长度大于 1 的同方向循环
// 思路：快慢指针模拟遍历，检测是否存在环，同时保证方向一致且环长大于 1
// 时间复杂度：O(n)，空间复杂度：O(1)

function circularArrayLoop(nums: number[]): boolean {
  const n = nums.length;

  // 计算下一个索引（处理正负方向和环绕）
  const getNext = (i: number): number => {
    return (((i + nums[i]) % n) + n) % n;
  };

  for (let i = 0; i < n; i++) {
    // 已访问标记为 0 的跳过
    if (nums[i] === 0) continue;

    let slow = i;
    let fast = getNext(i);

    // 确保方向一致（同正或同负）
    while (
      nums[slow] * nums[fast] > 0 &&
      nums[slow] * nums[getNext(fast)] > 0
    ) {
      if (slow === fast) {
        // 检查环长度是否大于 1（不是自环）
        if (slow === getNext(slow)) {
          break;
        }
        return true;
      }
      slow = getNext(slow);
      fast = getNext(getNext(fast));
    }

    // 将当前路径上方向一致的元素标记为 0（已访问）
    let j = i;
    const direction = nums[i];
    while (nums[j] * direction > 0) {
      const next = getNext(j);
      nums[j] = 0;
      j = next;
    }
  }

  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 环形数组是否存在循环 =====");
console.log(circularArrayLoop([2, -1, 1, 2, 2])); // 期望输出: true
console.log(circularArrayLoop([-1, 2])); // 期望输出: false
console.log(circularArrayLoop([-2, 1, -1, -2, -2])); // 期望输出: false
console.log(circularArrayLoop([1, 1, 2])); // 期望输出: true

export {};
