// ============================================================
// 060. 贪吃蛇
// ============================================================
// LeetCode 353. Design Snake Game
// 设计一个贪吃蛇游戏，在给定网格中移动蛇身，吃到食物则增长，撞墙或撞自身则游戏结束。
// 时间复杂度：move 为 O(1)，空间复杂度：O(n)（n 为蛇身长度）

// 哈希集合存蛇身位置（快速碰撞检测）+ 双端队列存蛇身节点
type Position = [number, number];

class SnakeGame {
  private width: number;
  private height: number;
  private food: Position[];
  private foodIndex: number;
  // 双端队列：蛇身节点，头部在队首
  private snake: Position[];
  // 哈希集合：记录蛇身占据的位置（用于 O(1) 碰撞检测）
  private bodySet: Set<string>;
  // 方向映射
  private directions: Map<string, Position>;

  constructor(width: number, height: number, food: Position[]) {
    this.width = width;
    this.height = height;
    this.food = food;
    this.foodIndex = 0;
    // 蛇初始位置在 (0, 0)
    this.snake = [[0, 0]];
    this.bodySet = new Set<string>(["0,0"]);
    this.directions = new Map<string, Position>([
      ["U", [-1, 0]],
      ["D", [1, 0]],
      ["L", [0, -1]],
      ["R", [0, 1]],
    ]);
  }

  // 蛇朝指定方向移动一步，返回当前分数（吃到食物数）
  // 若游戏结束返回 -1
  move(direction: string): number {
    const dir = this.directions.get(direction);
    if (!dir) return -1;

    // 计算新的蛇头位置
    const [headRow, headCol] = this.snake[0];
    const [dRow, dCol] = dir;
    const newHead: Position = [headRow + dRow, headCol + dCol];
    const newHeadKey = `${newHead[0]},${newHead[1]}`;

    // 检查是否撞墙
    if (
      newHead[0] < 0 ||
      newHead[0] >= this.height ||
      newHead[1] < 0 ||
      newHead[1] >= this.width
    ) {
      return -1;
    }

    // 判断是否吃到食物
    const willEatFood =
      this.foodIndex < this.food.length &&
      this.food[this.foodIndex][0] === newHead[0] &&
      this.food[this.foodIndex][1] === newHead[1];

    // 若未吃到食物，尾部会移走，先移除尾部再检测碰撞
    // 这样可以正确处理蛇头移动到原尾部位置的情况
    if (!willEatFood) {
      const tail = this.snake.pop()!;
      const tailKey = `${tail[0]},${tail[1]}`;
      this.bodySet.delete(tailKey);
    }

    // 检查是否撞到自身（此时尾部已移除，直接检查剩余蛇身）
    if (this.bodySet.has(newHeadKey)) {
      return -1;
    }

    // 将新头部加入蛇身和集合
    this.snake.unshift(newHead);
    this.bodySet.add(newHeadKey);

    // 吃到食物则增加分数
    if (willEatFood) {
      this.foodIndex++;
    }

    // 返回当前分数（吃到食物的数量）
    return this.foodIndex;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 贪吃蛇 =====");

// 测试 1: 基本移动 + 吃食物 + 撞墙
// 网格 3x2，食物 [[1,2],[0,1]]，蛇从 (0,0) 出发
const game1 = new SnakeGame(3, 2, [
  [1, 2],
  [0, 1],
]);
console.log(game1.move("R")); // 期望: 0 (移到 (0,1)，未吃到食物)
console.log(game1.move("D")); // 期望: 0 (移到 (1,1)，未吃到食物)
console.log(game1.move("R")); // 期望: 1 (移到 (1,2)，吃到食物 [1,2])
console.log(game1.move("U")); // 期望: 1 (移到 (0,2)，未吃到食物)
console.log(game1.move("L")); // 期望: 2 (移到 (0,1)，吃到食物 [0,1])
console.log(game1.move("U")); // 期望: -1 (撞墙，行越界)

// 测试 2: 撞自身
// 网格 3x3，食物 [[0,1],[0,2],[1,2]]，蛇从 (0,0) 出发
// 蛇吃到 3 个食物后绕一圈，最后撞到自身
const game2 = new SnakeGame(3, 3, [
  [0, 1],
  [0, 2],
  [1, 2],
]);
console.log(game2.move("R")); // 期望: 1 (吃到 [0,1])
console.log(game2.move("R")); // 期望: 2 (吃到 [0,2])
console.log(game2.move("D")); // 期望: 3 (吃到 [1,2])
console.log(game2.move("L")); // 期望: 3 (移到 (1,1)，无食物)
console.log(game2.move("U")); // 期望: 3 (移到 (0,1)，尾部让位)
console.log(game2.move("D")); // 期望: -1 (撞到自身 (1,1))

// 测试 3: 简单移动
const game3 = new SnakeGame(2, 2, [[1, 1]]);
console.log(game3.move("R")); // 期望: 0 (移到 (0,1)，未吃到食物)
console.log(game3.move("D")); // 期望: 1 (移到 (1,1)，吃到食物 [1,1])

export {};
