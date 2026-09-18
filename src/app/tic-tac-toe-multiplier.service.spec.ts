import { TestBed } from '@angular/core/testing';
import { BOARD_SIZE, TicTacToeMultiplierService } from './tic-tac-toe-multiplier.service';

describe('TicTacToeMultiplierService', () => {
  let service: TicTacToeMultiplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicTacToeMultiplierService],
    });
    service = TestBed.inject(TicTacToeMultiplierService);
  });

  it('should start with an empty board and X as first player', () => {
    expect(service.currentPlayer()).toBe('X');
    expect(service.winner()).toBeNull();
    expect(service.moveCount()).toBe(0);

    for (const row of service.board()) {
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });

  it('should alternate players after each move', () => {
    service.play(0, 0);
    expect(service.currentPlayer()).toBe('O');
    expect(service.moveCount()).toBe(1);

    service.play(1, 1);
    expect(service.currentPlayer()).toBe('X');
    expect(service.moveCount()).toBe(2);
  });

  it('should not overwrite an occupied cell', () => {
    service.play(0, 0);
    service.play(0, 0);
    expect(service.moveCount()).toBe(1);
    expect(service.board()[0][0]).toBe('X');
  });

  it('should declare X the winner with five in a horizontal row', () => {
    for (let c = 0; c < 5; c++) {
      service.play(7, c);
      if (c < 4) service.play(0, c);
    }
    expect(service.winner()).toBe('X');
    expect(service.statusText()).toContain('Player X wins');
  });

  it('should declare O the winner with five in a vertical row', () => {
    // X's moves are staggered so they never complete five themselves.
    for (let r = 0; r < 4; r++) {
      service.play(0, r);
      service.play(r, 8);
    }
    service.play(1, 0);
    service.play(4, 8);
    expect(service.winner()).toBe('O');
    expect(service.statusText()).toContain('Player O wins');
  });

  it('should detect a diagonal win (top-left to bottom-right)', () => {
    for (let i = 0; i < 5; i++) {
      service.play(i, i);
      if (i < 4) service.play(i, 10);
    }
    expect(service.winner()).toBe('X');
  });

  it('should detect a diagonal win (top-right to bottom-left)', () => {
    for (let i = 0; i < 5; i++) {
      service.play(i, 10 - i);
      if (i < 4) service.play(i, 0);
    }
    expect(service.winner()).toBe('X');
  });

  it('should mark winning cells as true', () => {
    for (let c = 0; c < 5; c++) {
      service.play(3, c);
      if (c < 4) service.play(4, c);
    }
    for (let c = 0; c < 5; c++) {
      expect(service.isWinningCell(3, c)).toBe(true);
    }
    expect(service.isWinningCell(3, 5)).toBe(false);
  });

  it('should declare a draw when the board is full without a winner', () => {
    // Fill the entire board with a checkerboard pattern (no five in a row).
    const pattern = (r: number, c: number) => ((r + c) % 2 === 0 ? 'X' : 'O');
    const filled = Array.from({ length: BOARD_SIZE }, (_, r) =>
      Array.from({ length: BOARD_SIZE }, (_, c) => pattern(r, c)),
    );
    service.board.set(filled);
    service.moveCount.set(BOARD_SIZE * BOARD_SIZE);

    expect(service.winner()).toBeNull();
    expect(service.statusText()).toContain('draw');
  });

  it('should increment win counters', () => {
    // X wins first game
    for (let c = 0; c < 5; c++) {
      service.play(0, c);
      if (c < 4) service.play(9, c);
    }
    expect(service.xWins()).toBe(1);

    // Restart and O wins the second game
    service.restart();
    for (let c = 0; c < 4; c++) {
      service.play(10, c);
      service.play(0, c);
    }
    service.play(9, 0);
    service.play(0, 4);
    expect(service.oWins()).toBe(1);
  });

  it('should not allow moves after a win', () => {
    for (let c = 0; c < 5; c++) {
      service.play(5, c);
      if (c < 4) service.play(6, c);
    }
    const countAfterWin = service.moveCount();
    service.play(14, 14);
    expect(service.moveCount()).toBe(countAfterWin);
  });

  it('should reset the board on restart', () => {
    service.play(0, 0);
    service.restart();
    expect(service.winner()).toBeNull();
    expect(service.currentPlayer()).toBe('X');
    expect(service.moveCount()).toBe(0);
    expect(service.board()[0][0]).toBeNull();
  });
});
