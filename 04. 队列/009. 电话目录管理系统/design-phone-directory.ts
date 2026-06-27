// ============================================================
// 009. 电话目录管理系统
// ============================================================
// LeetCode 379. Design Phone Directory
// 设计一个电话目录管理系统，支持：获取一个可用号码、检查号码是否可用、回收号码。

// ------------------------------------------------------------
// 方法1：队列 + 哈希集合
// ------------------------------------------------------------
// 队列保存可用号码，集合用于 O(1) 判断号码是否可用。
// get 从队列取号并从集合中删除；check 查集合；check 把号加回队列和集合。
// 时间 O(1) 所有操作，空间 O(maxNumbers)。
class PhoneDirectory1 {
  private available: number[];
  private used: Set<number>;
  private maxNumbers: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.available = [];
    for (let i = 0; i < maxNumbers; i++) {
      this.available.push(i);
    }
    this.used = new Set();
  }

  get(): number {
    if (this.available.length === 0) return -1;
    const num = this.available.shift()!;
    this.used.add(num);
    return num;
  }

  check(number: number): boolean {
    return !this.used.has(number) && number >= 0 && number < this.maxNumbers;
  }

  release(number: number): void {
    if (this.used.has(number)) {
      this.used.delete(number);
      this.available.push(number);
    }
  }
}

// ------------------------------------------------------------
// 方法2：位图 + 指针
// ------------------------------------------------------------
// 用一个 next 指针指向下一个未分配的号码，recycled 队列保存回收的号码，
// 用布尔数组标记号码是否被使用。
// 时间 O(1) 所有操作，空间 O(maxNumbers)。
class PhoneDirectory2 {
  private used: boolean[];
  private recycled: number[];
  private next: number;
  private maxNumbers: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.used = new Array(maxNumbers).fill(false);
    this.recycled = [];
    this.next = 0;
  }

  get(): number {
    if (this.recycled.length > 0) {
      const num = this.recycled.shift()!;
      this.used[num] = true;
      return num;
    }
    if (this.next < this.maxNumbers) {
      const num = this.next++;
      this.used[num] = true;
      return num;
    }
    return -1;
  }

  check(number: number): boolean {
    return number >= 0 && number < this.maxNumbers && !this.used[number];
  }

  release(number: number): void {
    if (number >= 0 && number < this.maxNumbers && this.used[number]) {
      this.used[number] = false;
      this.recycled.push(number);
    }
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const d1 = new PhoneDirectory1(3);
  console.log("测试1 get:", d1.get(), "期望: 0");
  console.log("测试2 get:", d1.get(), "期望: 1");
  console.log("测试3 check(2):", d1.check(2), "期望: true");
  d1.release(1);
  console.log("测试4 check(1):", d1.check(1), "期望: true");
  console.log("测试5 get:", d1.get(), "期望: 1 或 2");

  const d2 = new PhoneDirectory2(3);
  console.log("测试6 get:", d2.get(), "期望: 0");
  console.log("测试7 get:", d2.get(), "期望: 1");
  console.log("测试8 get:", d2.get(), "期望: 2");
  console.log("测试9 get:", d2.get(), "期望: -1");
  d2.release(2);
  console.log("测试10 get:", d2.get(), "期望: 2");
}

test();

export {};
