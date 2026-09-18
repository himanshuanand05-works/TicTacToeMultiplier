import { computed, Injectable, signal } from '@angular/core';

export type Player = 'X' | 'O';
export type Cell = Player | null;

export const BOARD_SIZE = 11;
export const WIN_LENGTH = 5;

const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

@Injectable({ providedIn: 'root' })
export class TicTacToeMultiplierService {
  readonly board = signal<Cell[][]>(createEmptyBoard());
  readonly currentPlayer = signal<Player>('X');
  readonly winner = signal<Player | null>(null);
  readonly winningCells = signal<Set<string>>(new Set());
  readonly moveCount = signal(0);
  readonly xWins = signal(0);
  readonly oWins = signal(0);
  readonly draws = signal(0);

  readonly statusText = computed(() => {
    const winner = this.winner();
    if (winner !== null) {
      return `Player ${winner} wins the round!`;
    }
    if (this.moveCount() >= BOARD_SIZE * BOARD_SIZE) {
      return `It's a draw!`;
    }
    return `Player ${this.currentPlayer()}'s turn`;
  });

  play(row: number, col: number): void {
    if (!this.isLegalMove(row, col)) {
      return;
    }

    const player = this.currentPlayer();
    this.board.update((grid) => {
      const next = grid.map((r) => [...r]);
      next[row][col] = player;
      return next;
    });
    this.moveCount.update((moves) => moves + 1);

    const winCells = this.findWinningLine(row, col, player);
    if (winCells !== null) {
      this.winningCells.set(winCells);
      this.winner.set(player);
      if (player === 'X') {
        this.xWins.update((wins) => wins + 1);
      } else {
        this.oWins.update((wins) => wins + 1);
      }
      return;
    }

    if (this.moveCount() === BOARD_SIZE * BOARD_SIZE) {
      this.draws.update((draws) => draws + 1);
      return;
    }

    this.currentPlayer.update((p) => (p === 'X' ? 'O' : 'X'));
  }

  isWinningCell(row: number, col: number): boolean {
    return this.winningCells().has(`${row},${col}`);
  }

  restart(): void {
    this.board.set(createEmptyBoard());
    this.currentPlayer.set('X');
    this.winner.set(null);
    this.winningCells.set(new Set());
    this.moveCount.set(0);
  }

  private isLegalMove(row: number, col: number): boolean {
    if (this.winner() !== null) {
      return false;
    }
    if (!isInBounds(row, col)) {
      return false;
    }
    return this.board()[row][col] === null;
  }

  private findWinningLine(row: number, col: number, player: Player): Set<string> | null {
    for (const [dr, dc] of DIRECTIONS) {
      const line = new Set<string>([`${row},${col}`]);
      for (const sign of [1, -1]) {
        let r = row + dr * sign;
        let c = col + dc * sign;
        while (isInBounds(r, c) && this.board()[r][c] === player) {
          line.add(`${r},${c}`);
          r += dr * sign;
          c += dc * sign;
        }
      }
      if (line.size >= WIN_LENGTH) {
        return line;
      }
    }
    return null;
  }
}

function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null));
}
