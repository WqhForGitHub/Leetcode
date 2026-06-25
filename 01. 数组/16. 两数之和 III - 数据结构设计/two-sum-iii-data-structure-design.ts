// ============================================================
// 16. 两数之和 III - 数据结构设计
// ============================================================
// LeetCode 170. Two Sum III - Data structure design
// 设计并实现一个 TwoSum 类，支持 add(number) 和 find(value) 操作。
// add: 添加一个数到内部数据结构；find: 判断是否存在两个数之和等于 value。
// 时间复杂度：add O(1)，find O(n)（方法1）

// 方法1：哈希表 - add O(1), find O(n)（推荐）
class TwoSum {
  // 数字 -> 出现次数
  private count: Map<number, number>;

  constructor() {
    this.count = new Map<number, number>();
  }

  add(number: number): void {
    this.count.set(number, (this.count.get(number) ?? 0) + 1);
  }

  find(value: number): boolean {
    for (const num of this.count.keys()) {
      const complement = value - num;
      if (complement === num) {
        // 两数相同，需要该数出现至少 2 次
        if ((this.count.get(num) ?? 0) >= 2) return true;
      } else {
        if (this.count.has(complement)) return true;
      }
    }
    return false;
  }
}

// 方法2：排序数组 - add O(n), find O(n)（双指针）
class TwoSumSorted {
  private nums: number[];

  constructor() {
    this.nums = [];
  }

  // 插入时保持有序，O(n)
  add(number: number): void {
    let i = 0;
    while (i < this.nums.length && this.nums[i] < number) {
      i++;
    }
    this.nums.splice(i, 0, number);
  }

  // 双指针查找，O(n)
  find(value: number): boolean {
    let left = 0;
    let right = this.nums.length - 1;
    while (left < right) {
      const sum = this.nums[left] + this.nums[right];
      if (sum === value) {
        return true;
      } else if (sum < value) {
        left++;
      } else {
        right--;
      }
    }
    return false;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 16. 两数之和 III - 数据结构设计 =====");

const ts = new TwoSum();
ts.add(1);
ts.add(3);
ts.add(5);
console.log("描述 find(4):", ts.find(4)); // 期望结果: true (1+3)
console.log("描述 find(7):", ts.find(7)); // 期望结果: false
ts.add(3);
console.log("描述 find(6):", ts.find(6)); // 期望结果: true (3+3)
console.log("描述 find(8):", ts.find(8)); // 期望结果: true (3+5)

const ts2 = new TwoSumSorted();
ts2.add(1);
ts2.add(3);
ts2.add(5);
console.log("描述 Sorted find(4):", ts2.find(4)); // 期望结果: true
console.log("描述 Sorted find(7):", ts2.find(7)); // 期望结果: false
ts2.add(3);
console.log("描述 Sorted find(6):", ts2.find(6)); // 期望结果: true

export {};
