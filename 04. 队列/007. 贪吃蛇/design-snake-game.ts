// ============================================================
// 007. 贪吃蛇
// ============================================================
// LeetCode 353. Design Snake Game
// 设计一个贪吃蛇游戏，给定宽度和高度以及食物位置序列。
// 蛇初始在 (0,0)，每次移动一格，吃到食物身体变长，撞墙或撞自己游戏结束。

// ------------------------------------------------------------
// 方法1：队列 + 哈希集合
// ------------------------------------------------------------
// 用队列保存蛇身坐标（队尾为蛇头），用 Set 实现 O(1) 碰撞检测。
// 吃食物时不删尾，否则删尾。
// 时间 O(1) move，空间 O(w*h + food)。
class SnakeGame1 {
  private width: number;
  private height: number;
  private food: number[][];
  private foodIndex: number = 0;
  private body: [number, number][]; // 队列，body[0] = 尾，末尾 = 头
  private bodySet: Set<string>;
  private score: number = 0;

  constructor(width: number, height: number, food: number[][]) {
    this.width = width;
    this.height = height;
    this.food = food;
    this.body = [[0, 0]];
    this.bodySet = new Set(["0,0"]);
  }

  move(direction: string): number {
    const head = this.body[this.body.length - 1];
    let r = head[0];
    let c = head[1];
    switch (direction) {
      case "U":
        r--;
        break;
      case "D":
        r++;
        break;
      case "L":
        c--;
        break;
      case "R":
        c++;
        break;
    }
    // 撞墙
    if (r < 0 || r >= this.height || c < 0 || c >= this.width) {
      return -1;
    }
    // 新蛇头
    const newHead: [number, number] = [r, c];
    const key = `${r},${c}`;
    // 判断是否吃食物
    const ateFood =
      this.foodIndex < this.food.length &&
      this.food[this.foodIndex][0] === r &&
      this.food[this.foodIndex][1] === c;
    // 移除尾部（除非吃到食物）
    if (!ateFood) {
      const tail = this.body.shift()!;
      this.bodySet.delete(`${tail[0]},${tail[1]}`);
    } else {
      this.foodIndex++;
      this.score++;
    }
    // 碰撞自身
    if (this.bodySet.has(key)) {
      return -1;
    }
    this.body.push(newHead);
    this.bodySet.add(key);
    return this.score;
  }
}

// ------------------------------------------------------------
// 方法2：双端队列
// ------------------------------------------------------------
// 使用数组的 unshift/pop 模拟，蛇头在数组头部。
class SnakeGame2 {
  private width: number;
  private height: number;
  private food: number[][];
  private foodIndex: number = 0;
  private snake: number[]; // 蛇头在头部，存编码 r*width+c
  private bodySet: Set<number>;
  private score: number = 0;

  constructor(width: number, height: number, food: number[][]) {
    this.width = width;
    this.height = height;
    this.food = food;
    this.snake = [0];
    this.bodySet = new Set([0]);
  }

  move(direction: string): number {
    const head = this.snake[0];
    const r = Math.floor(head / this.width);
    const c = head % this.width;
    let nr = r;
    let nc = c;
    switch (direction) {
      case "U":
        nr--;
        break;
      case "D":
        nr++;
        break;
      case "L":
        nc--;
        break;
      case "R":
        nc++;
        break;
    }
    if (nr < 0 || nr >= this.height || nc < 0 || nc >= this.width) {
      return -1;
    }
    const newHead = nr * this.width + nc;
    const ateFood =
      this.foodIndex < this.food.length &&
      this.food[this.foodIndex][0] === nr &&
      this.food[this.foodIndex][1] === nc;
    if (!ateFood) {
      const tail = this.snake.pop()!;
      this.bodySet.delete(tail);
    } else {
      this.foodIndex++;
      this.score++;
    }
    if (this.bodySet.has(newHead)) {
      return -1;
    }
    this.snake.unshift(newHead);
    this.bodySet.add(newHead);
    return this.score;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const food1 = [
    [1, 2],
    [0, 1],
  ];
  const g1 = new SnakeGame1(3, 2, food1);
  console.log("测试1:", g1.move("R"), "期望: 0");
  console.log("测试2:", g1.move("D"), "期望: 1");
  console.log("测试3:", g1.move("L"), "期望: 1");

  const food2 = [
    [1, 2],
    [0, 1],
  ];
  const g2 = new SnakeGame2(3, 2, food2);
  console.log("测试4:", g2.move("R"), "期望: 0");
  console.log("测试5:", g2.move("D"), "期望: 1");
  console.log("测试6:", g2.move("L"), "期望: 1");
}

test();

export {};
