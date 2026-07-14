// ============================================================
// 031. 电话目录管理系统
// ============================================================
// LeetCode 379. Design Phone Directory
// 设计一个电话目录管理系统，支持：
//   get()：获取一个可用号码，无可用号码返回 -1
//   check(number)：检查号码是否可用
//   release(number)：释放号码使其重新可用
// 最多有 maxNumbers 个号码（0 ~ maxNumbers-1）
// 时间复杂度：get/check/release 均为 O(1)

class PhoneDirectory {
  private available: Set<number>; // 可用号码集合
  private recycled: number[]; // 释放的号码队列（可复用）
  private next: number; // 下一个从未分配的号码
  private maxNumbers: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.available = new Set<number>();
    this.recycled = [];
    this.next = 0;
    // 初始时所有号码都可用
    for (let i = 0; i < maxNumbers; i++) {
      this.available.add(i);
    }
  }

  // 获取一个可用号码，无则返回 -1
  get(): number {
    if (this.recycled.length > 0) {
      // 优先复用已释放的号码
      const num = this.recycled.pop()!;
      this.available.delete(num);
      return num;
    }
    if (this.next < this.maxNumbers) {
      const num = this.next++;
      this.available.delete(num);
      return num;
    }
    return -1;
  }

  // 检查号码是否可用
  check(number: number): boolean {
    return this.available.has(number);
  }

  // 释放号码，使其重新可用
  release(number: number): void {
    if (number < 0 || number >= this.maxNumbers) return;
    if (!this.available.has(number)) {
      this.available.add(number);
      this.recycled.push(number);
    }
  }
}

// 测试
console.log("===== 031. 电话目录管理系统 =====");
{
  const directory = new PhoneDirectory(3);
  console.log("可用号码状态：", directory.check(0)); // true
  console.log("获取号码：", directory.get()); // 0
  console.log("可用号码状态：", directory.check(0)); // false
  console.log("获取号码：", directory.get()); // 1
  console.log("获取号码：", directory.get()); // 2
  console.log("获取号码（无可用）：", directory.get()); // -1
  directory.release(1);
  console.log("释放1后检查1是否可用：", directory.check(1)); // true
  console.log("获取号码（复用1）：", directory.get()); // 1
}
{
  // 测试2：多次获取释放
  const directory = new PhoneDirectory(2);
  console.log("获取：", directory.get()); // 0
  console.log("获取：", directory.get()); // 1
  console.log("获取（无可用）：", directory.get()); // -1
  directory.release(0);
  directory.release(0); // 重复释放不会出问题
  console.log("检查0：", directory.check(0)); // true
  console.log("获取：", directory.get()); // 0
}

export {};
