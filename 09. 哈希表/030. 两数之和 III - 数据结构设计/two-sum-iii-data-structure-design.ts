// ============================================================
// 030. 两数之和 III - 数据结构设计
// ============================================================
// LeetCode 170. Two Sum III - Data Structure Design
// 设计一个数据结构，支持 add(number) 添加数字，以及 find(value) 判断是否存在两个数字之和等于 value。
// 使用哈希表记录每个数字出现次数。
// add 时间复杂度：O(1)；find 时间复杂度：O(n)；空间复杂度：O(n)

class TwoSum {
  // 哈希表：数字 -> 出现次数
  private numCount: Map<number, number>;

  constructor() {
    this.numCount = new Map<number, number>();
  }

  // 添加一个数字
  add(number: number): void {
    this.numCount.set(number, (this.numCount.get(number) || 0) + 1);
  }

  // 判断是否存在两个数字之和等于 value（同一数字使用两次需出现至少两次）
  find(value: number): boolean {
    for (const num of this.numCount.keys()) {
      const target = value - num;
      if (target === num) {
        // 两数相同，需要该数字至少出现两次
        if ((this.numCount.get(num) || 0) >= 2) {
          return true;
        }
      } else {
        // 两数不同，只需 target 存在
        if (this.numCount.has(target)) {
          return true;
        }
      }
    }
    return false;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 两数之和 III - 数据结构设计 =====");
const ts = new TwoSum();
ts.add(1);
ts.add(3);
ts.add(5);
console.log(ts.find(4)); // true (1 + 3)
console.log(ts.find(7)); // false
ts.add(3);
console.log(ts.find(6)); // true (3 + 3)
console.log(ts.find(10)); // true (5 + 5)
console.log(ts.find(8)); // true (3 + 5)

export {};
