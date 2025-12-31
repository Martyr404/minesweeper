import { BoardData, CellData } from '../types';

export const createEmptyBoard = (rows: number, cols: number): BoardData => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborCount: 0,
    }))
  );
};

const getNeighbors = (board: BoardData, row: number, col: number): CellData[] => {
  const neighbors: CellData[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  directions.forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;
    if (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length
    ) {
      neighbors.push(board[newRow][newCol]);
    }
  });

  return neighbors;
};

export const placeMines = (
  initialBoard: BoardData,
  minesToPlace: number,
  safeCell: { row: number; col: number },
  fixedMines?: { row: number; col: number }[]
): { board: BoardData; mineLocations: { row: number; col: number }[] } => {
  const rows = initialBoard.length;
  const cols = initialBoard[0].length;
  const newBoard = JSON.parse(JSON.stringify(initialBoard)); // Deep copy
  const mineLocations: { row: number; col: number }[] = [];

  if (fixedMines && fixedMines.length > 0) {
    // Place mines at fixed locations (Retry Level mode)
    fixedMines.forEach(({ row, col }) => {
      if (row < rows && col < cols) {
        newBoard[row][col].isMine = true;
        mineLocations.push({ row, col });
      }
    });
  } else {
    // Random generation
    let minesPlaced = 0;
    while (minesPlaced < minesToPlace) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Don't place mine on the safe cell (first click) or if already a mine
      if (
        !newBoard[r][c].isMine &&
        !(r === safeCell.row && c === safeCell.col)
      ) {
        newBoard[r][c].isMine = true;
        mineLocations.push({ row: r, col: c });
        minesPlaced++;
      }
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newBoard[r][c].isMine) {
        const neighbors = getNeighbors(newBoard, r, c);
        newBoard[r][c].neighborCount = neighbors.filter((n) => n.isMine).length;
      }
    }
  }

  return { board: newBoard, mineLocations };
};

export const revealCell = (board: BoardData, row: number, col: number): BoardData => {
  const cell = board[row][col];
  
  if (cell.isRevealed || cell.isFlagged) return board;

  const newBoard = [...board]; 
  newBoard[row] = [...board[row]]; 
  const currentCell = { ...newBoard[row][col], isRevealed: true };
  newBoard[row][col] = currentCell;

  if (currentCell.isMine) {
    return newBoard; 
  }

  // Logic is usually handled by revealRegion now, but keeping strictly for single cell ops if needed
  return newBoard;
};

// Iterative flood fill for robustness
export const revealRegion = (board: BoardData, startRow: number, startCol: number): BoardData => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[startRow, startCol]];
  
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const cell = newBoard[r][c];
    
    if (cell.isRevealed || cell.isFlagged) continue;
    
    cell.isRevealed = true;
    
    if (cell.neighborCount === 0 && !cell.isMine) {
      const neighbors = getNeighbors(newBoard, r, c);
      neighbors.forEach(n => {
        if (!n.isRevealed && !n.isFlagged) {
           queue.push([n.row, n.col]);
        }
      });
    }
  }
  return newBoard;
};

export const toggleFlag = (board: BoardData, row: number, col: number): BoardData => {
  const newBoard = [...board];
  newBoard[row] = [...board[row]];
  newBoard[row][col] = {
    ...newBoard[row][col],
    isFlagged: !newBoard[row][col].isFlagged,
  };
  return newBoard;
};

export const checkWinCondition = (board: BoardData): boolean => {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) return false;
      if (cell.isMine && cell.isRevealed) return false;
    }
  }
  return true;
};

export const revealAllMines = (board: BoardData): BoardData => {
  return board.map(row => 
    row.map(cell => 
      cell.isMine ? { ...cell, isRevealed: true } : cell
    )
  );
};
