// ============================================================
// 039. 扫地机器人
// ============================================================
// LeetCode 489. Robot Room Cleaner
// 给定一个有move(), turnLeft(), turnRight(), clean()方法的机器人，清理整个房间（有障碍物的网格）。
// 时间复杂度：O(4^n), 空间复杂度：O(n)，n为可达单元格数量

// 机器人接口定义
interface Robot {
  // 返回是否能成功移动一格
  move(): boolean;
  // 左转90度
  turnLeft(): void;
  // 右转90度
  turnRight(): void;
  // 清理当前单元格
  clean(): void;
}

// 方法1：螺旋回溯DFS (推荐)
// 从起点开始DFS，每个位置尝试4个方向。访问过的位置用Set记录。
// 每次探索完一个方向后回退到原位置，然后右转尝试下一个方向。
// 时间复杂度 O(4^n), 空间复杂度 O(n)
function cleanRoom(robot: Robot): void {
  const visited: Set<string> = new Set();
  // 方向：上、右、下、左（顺时针）
  const directions: number[][] = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  // 回退到上一个位置：转180度，移动，再转180度恢复方向
  function goBack(): void {
    robot.turnRight();
    robot.turnRight();
    robot.move();
    robot.turnRight();
    robot.turnRight();
  }

  // row, col: 当前坐标（相对坐标）
  // dir: 当前朝向（0=上, 1=右, 2=下, 3=左）
  function backtrack(row: number, col: number, dir: number): void {
    // 清理当前位置
    visited.add(`${row},${col}`);
    robot.clean();

    // 尝试4个方向
    for (let i: number = 0; i < 4; i++) {
      const newDir: number = (dir + i) % 4;
      const newRow: number = row + directions[newDir][0];
      const newCol: number = col + directions[newDir][1];

      // 如果该位置未访问过，尝试移动
      if (!visited.has(`${newRow},${newCol}`)) {
        if (robot.move()) {
          // 成功移动，递归清理
          backtrack(newRow, newCol, newDir);
          // 回退到原位置
          goBack();
        }
      }
      // 右转，准备尝试下一个方向
      robot.turnRight();
    }
  }

  // 从(0,0)开始，面朝上方
  backtrack(0, 0, 0);
}

// 方法2：DFS+方向回退（使用turnLeft变体）
// 与方法1类似，但使用左转探索方向，回退策略略有不同
// 时间复杂度 O(4^n), 空间复杂度 O(n)
function cleanRoom2(robot: Robot): void {
  const visited: Set<string> = new Set();
  // 方向：上、左、下、右（逆时针）
  const dirs: number[][] = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];

  function goBack(): void {
    robot.turnLeft();
    robot.turnLeft();
    robot.move();
    robot.turnLeft();
    robot.turnLeft();
  }

  function dfs(row: number, col: number, dir: number): void {
    robot.clean();
    visited.add(`${row},${col}`);

    for (let i: number = 0; i < 4; i++) {
      const newDir: number = (dir + i) % 4;
      const newRow: number = row + dirs[newDir][0];
      const newCol: number = col + dirs[newDir][1];

      if (!visited.has(`${newRow},${newCol}`) && robot.move()) {
        dfs(newRow, newCol, newDir);
        goBack();
      }
      // 左转尝试下一个方向
      robot.turnLeft();
    }
  }

  dfs(0, 0, 0);
}

// ============================================================
// 测试（模拟机器人）
// ============================================================
console.log("===== 039. 扫地机器人 =====");

// 模拟机器人实现
class MockRobot implements Robot {
  private room: number[][]; // 1=可通行, 0=障碍
  private r: number;
  private c: number;
  private dir: number;
  public cleaned: Set<string>;

  constructor(room: number[][], startRow: number, startCol: number, startDir: number) {
    this.room = room;
    this.r = startRow;
    this.c = startCol;
    this.dir = startDir; // 0=上, 1=右, 2=下, 3=左
    this.cleaned = new Set();
  }

  move(): boolean {
    const dirs: number[][] = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    const nr: number = this.r + dirs[this.dir][0];
    const nc: number = this.c + dirs[this.dir][1];
    if (
      nr >= 0 &&
      nr < this.room.length &&
      nc >= 0 &&
      nc < this.room[0].length &&
      this.room[nr][nc] === 1
    ) {
      this.r = nr;
      this.c = nc;
      return true;
    }
    return false;
  }

  turnLeft(): void {
    this.dir = (this.dir + 3) % 4;
  }

  turnRight(): void {
    this.dir = (this.dir + 1) % 4;
  }

  clean(): void {
    this.cleaned.add(`${this.r},${this.c}`);
  }
}

// 测试用例：简单的十字形房间
const room: number[][] = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
];
const robot1: MockRobot = new MockRobot(room, 0, 0, 0);
cleanRoom(robot1);
console.log("清理的单元格数量:", robot1.cleaned.size); // 期望: 25

const robot2: MockRobot = new MockRobot(room, 2, 2, 0);
cleanRoom2(robot2);
console.log("清理的单元格数量:", robot2.cleaned.size); // 期望: 25

export {};
