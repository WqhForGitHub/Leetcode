// ============================================================
// 039. 考场就座
// ============================================================
// LeetCode 855. Exam Room
// 考场有 N 个座位，学生就座时选离其他人最远的位置，离开时释放座位。
// 时间复杂度：seat O(log N)，leave O(log N)

// 方法1：有序集合（用数组模拟）
class ExamRoom {
  private seats: number[] = [];
  private n: number;
  constructor(n: number) {
    this.n = n;
  }
  seat(): number {
    if (this.seats.length === 0) {
      this.seats.push(0);
      return 0;
    }
    let maxDist = this.seats[0];
    let pos = 0;
    for (let i = 1; i < this.seats.length; i++) {
      const dist = (this.seats[i] - this.seats[i - 1]) >> 1;
      if (dist > maxDist) {
        maxDist = dist;
        pos = (this.seats[i] + this.seats[i - 1]) >> 1;
      }
    }
    if (this.n - 1 - this.seats[this.seats.length - 1] > maxDist) {
      pos = this.n - 1;
    }
    // 插入有序
    let lo = 0;
    let hi = this.seats.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.seats[mid] < pos) lo = mid + 1;
      else hi = mid;
    }
    this.seats.splice(lo, 0, pos);
    return pos;
  }
  leave(p: number): void {
    const idx = this.seats.indexOf(p);
    if (idx !== -1) this.seats.splice(idx, 1);
  }
}

// 方法2：最大堆 + 懒删除
class ExamRoomHeap {
  private seats: number[] = [];
  private n: number;
  constructor(n: number) {
    this.n = n;
  }
  seat(): number {
    if (this.seats.length === 0) {
      this.seats.push(0);
      return 0;
    }
    this.seats.sort((a, b) => a - b);
    let maxDist = this.seats[0];
    let pos = 0;
    for (let i = 1; i < this.seats.length; i++) {
      const dist = (this.seats[i] - this.seats[i - 1]) >> 1;
      if (dist > maxDist) {
        maxDist = dist;
        pos = (this.seats[i] + this.seats[i - 1]) >> 1;
      }
    }
    if (this.n - 1 - this.seats[this.seats.length - 1] > maxDist) pos = this.n - 1;
    this.seats.push(pos);
    return pos;
  }
  leave(p: number): void {
    const idx = this.seats.indexOf(p);
    if (idx !== -1) this.seats.splice(idx, 1);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 考场就座 =====");
const er = new ExamRoom(10);
console.log("seat:", er.seat()); // 期望 0
console.log("seat:", er.seat()); // 期望 9
console.log("seat:", er.seat()); // 期望 4
console.log("seat:", er.seat()); // 期望 2
er.leave(4);
console.log("seat:", er.seat()); // 期望 5

export {};
