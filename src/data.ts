export const config = {
  allowCheats: true,
};

export const translations = {
  version: "1.0.0",
  en: {
    app: {
      title: "Minesweeper",
      subtitle: "Clear the field without detonating any mines",
      replayMode: "Replay Mode",
      footer: "Right-click (or long press) to place flags",
      howToPlayTooltip: "How to Play",
      switchLanguageTooltip: "Switch Language",
      otherGames: "Other Games"
    },
    difficulty: {
      Beginner: "Beginner",
      Intermediate: "Intermediate",
      Expert: "Expert",
      Custom: "Custom",
    },
    header: {
      resetTooltip: "Reset Game",
    },
    gameOver: {
      won: "You Won!",
      lost: "Game Over",
      wonMessage: "Fantastic job! You cleared the field in {time} seconds.",
      lostMessage: "Better luck next time. Watch out for those mines!",
      review: "Review",
      retry: "Retry",
      newGame: "New Game",
      close: "Close"
    },
    customModal: {
      title: "Custom Game",
      width: "Width",
      height: "Height",
      mines: "Mines",
      max: "Max",
      maxWidth: "Max width is 50",
      maxHeight: "Max height is 50",
      cancel: "Cancel",
      start: "Start Game",
      errors: {
        minSize: "Board size must be at least 5x5",
        maxSize: "Board size cannot exceed 50x50",
        minMines: "There must be at least 1 mine",
        maxMines: "Mines must be less than total cells ({total})",
      }
    },
    helpModal: {
      title: "How to Play",
      goalTitle: "The Goal",
      goalDesc: "Reveal all safe squares on the grid without stepping on a mine. If you click a mine, the game ends!",
      numbersTitle: "The Numbers",
      numbersDesc: "The numbers tell you how many mines are in the 3x3 grid around the area where it is located, and the number of mines in the surrounding 8 squares. A '1' means there is exactly 1 mine next to it (horizontally, vertically, or diagonally).",
      flagsTitle: "Use Flags",
      flagsDesc: "Right-click (or long press on mobile) to place a flag on a square you think hides a mine. This helps you track safe areas.",
      button: "Got it, Let's Play!",
    },
    replay: {
      exit: "Exit Replay",
      toggleGodMode: "Toggle God Mode"
    }
  },
  zh: {
    app: {
      title: "扫雷",
      subtitle: "清除雷区",
      replayMode: "回放模式",
      footer: "右键点击（或长按）插旗标记地雷",
      howToPlayTooltip: "游戏说明",
      switchLanguageTooltip: "切换语言",
      otherGames: "更多游戏"
    },
    difficulty: {
      Beginner: "初级",
      Intermediate: "中级",
      Expert: "高级",
      Custom: "自定义",
    },
    header: {
      resetTooltip: "重置游戏",
    },
    gameOver: {
      won: "你赢了！",
      lost: "游戏结束",
      wonMessage: "太棒了！你用 {time} 秒扫清了雷区。",
      lostMessage: "下次好运噢。",
      review: "回放复盘",
      retry: "重试",
      newGame: "新游戏",
      close: "关闭"
    },
    customModal: {
      title: "自定义游戏",
      width: "宽度",
      height: "高度",
      mines: "地雷数量",
      max: "最大",
      maxWidth: "最大宽度为 50",
      maxHeight: "最大高度为 50",
      cancel: "取消",
      start: "开始游戏",
      errors: {
        minSize: "棋盘大小至少为 5x5",
        maxSize: "棋盘大小不能超过 50x50",
        minMines: "至少需要 1 颗地雷",
        maxMines: "地雷数量必须少于总格子数 ({total})",
      }
    },
    helpModal: {
      title: "游戏说明",
      goalTitle: "目标",
      goalDesc: "找出所有没有地雷的方块。如果踩到地雷, 游戏结束！",
      numbersTitle: "数字含义",
      numbersDesc: "数字告诉你它所在的九宫格内, 周围8个格子有多少颗地雷",
      flagsTitle: "使用旗帜",
      flagsDesc: "右键点击（或长按）方块可以插旗, 标记你认为有地雷的位置。",
      button: "明白了, 开始游戏！",
    },
    replay: {
      exit: "退出回放",
      toggleGodMode: "切换上帝模式"
    }
  }
};

export type Translation = typeof translations.en;