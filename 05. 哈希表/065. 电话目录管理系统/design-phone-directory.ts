// ============================================================
// 065. 电话目录管理系统
// ============================================================
// LeetCode 379. Design Phone Directory
// 设计电话目录：最多 maxNumbers 个号码（0 ~ maxNumbers-1）。
// 支持 get() 分配一个可用号码、check(number) 查询是否可用、release(number) 释放回收。
// 时间复杂度：get / check / release 均摊 O(1)
// 空间复杂度：O(maxNumbers)

class PhoneDirectory {
  private maxNumbers: number;
  // 标记每个号码是否可用
  private available: boolean[];
  // 可用号码队列（释放的与尚未分配的）
  private queue: number[];
  // 下一个尚未分配的号码（避免重复入队）
  private nextUnassigned: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.available = new Array(maxNumbers).fill(true);
    this.queue = [];
    this.nextUnassigned = 0;
  }

  // 提供一个可用号码，没有则返回 -1
  get(): number {
    // 优先复用被释放的号码
    if (this.queue.length > 0) {
      const num = this.queue.shift()!;
      this.available[num] = false;
      return num;
    }
    // 否则分配下一个尚未使用的号码
    if (this.nextUnassigned < this.maxNumbers) {
      const num = this.nextUnassigned++;
      this.available[num] = false;
      return num;
    }
    return -1; // 全部已分配
  }

  // 检查号码是否可用
  check(number: number): boolean {
    if (number < 0 || number >= this.maxNumbers) return false;
    return this.available[number];
  }

  // 释放号码，使其可被再次分配
  release(number: number): void {
    if (number < 0 || number >= this.maxNumbers) return;
    // 仅在已分配状态下才回收，避免重复入队
    if (!this.available[number]) {
      this.available[number] = true;
      this.queue.push(number);
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 电话目录管理系统 =====");

// 测试 1：基本分配与释放
const dir1 = new PhoneDirectory(3);
console.log("test1 get:", dir1.get()); // 期望 0
console.log("test1 get:", dir1.get()); // 期望 1
console.log("test1 check 2:", dir1.check(2)); // 期望 true
dir1.release(1);
console.log("test1 check 1 after release:", dir1.check(1)); // 期望 true
console.log("test1 get (reused):", dir1.get()); // 期望 1（复用释放的）

// 测试 2：耗尽后返回 -1
const dir2 = new PhoneDirectory(2);
console.log("test2 get:", dir2.get()); // 0
console.log("test2 get:", dir2.get()); // 1
console.log("test2 get (exhausted):", dir2.get()); // 期望 -1
dir2.release(0);
console.log("test2 get after release:", dir2.get()); // 期望 0

// 测试 3：释放未分配号码无效
const dir3 = new PhoneDirectory(2);
dir3.release(0); // 0 本就可用，不应入队
console.log("test3 check 0:", dir3.check(0)); // 期望 true
console.log("test3 get:", dir3.get()); // 期望 0
console.log("test3 get:", dir3.get()); // 期望 1（释放未生效，没有多出一个）

export {};
