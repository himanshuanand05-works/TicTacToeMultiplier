import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { BOARD_SIZE, TicTacToeMultiplierService } from './tic-tac-toe-multiplier.service';

interface ConfettiPiece {
  id: number;
  x: string;
  color: string;
  delay: string;
  duration: string;
  rotate: string;
  drift: string;
}

const CONFETTI_COLORS = ['#22d3ee', '#a78bfa', '#fb923c', '#facc15', '#34d399', '#f472b6'];

const CONFETTI_COUNT = 90;

function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, id) => ({
    id,
    x: `${Math.random() * 100}vw`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: `${Math.random() * 0.9}s`,
    duration: `${2.4 + Math.random() * 1.8}s`,
    rotate: `${(Math.random() - 0.5) * 1080}deg`,
    drift: `${(Math.random() - 0.5) * 220}px`,
  }));
}

@Component({
  selector: 'app-root',
  imports: [],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly game = inject(TicTacToeMultiplierService);
  protected readonly boardSize = BOARD_SIZE;
  protected readonly confettiPieces = signal<ConfettiPiece[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private confettiTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.confettiTimer));
    effect(() => {
      clearTimeout(this.confettiTimer);
      if (this.game.winner() !== null) {
        this.confettiPieces.set(generateConfetti());
        this.confettiTimer = setTimeout(() => this.confettiPieces.set([]), 4500);
      } else {
        this.confettiPieces.set([]);
      }
    });
  }

  protected play(row: number, col: number): void {
    this.game.play(row, col);
  }
}
