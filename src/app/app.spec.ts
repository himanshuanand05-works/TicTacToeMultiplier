import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TicTacToeMultiplierService } from './tic-tac-toe-multiplier.service';

describe('App', () => {
  function setup(): { fixture: any; service: TicTacToeMultiplierService } {
    const service = TestBed.inject(TicTacToeMultiplierService);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return { fixture, service };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [TicTacToeMultiplierService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the game title', () => {
    const { fixture } = setup();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Multiplier');
  });

  it('should render an 11x11 board', () => {
    const { fixture } = setup();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.cell').length).toBe(121);
  });

  it('should place an X on the board when a cell is clicked', async () => {
    const { fixture, service } = setup();
    const cell = fixture.nativeElement.querySelector('.cell') as HTMLButtonElement;
    cell.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(service.board()[0][0]).toBe('X');
    expect(service.currentPlayer()).toBe('O');
    expect(cell.textContent?.trim()).toBe('X');
  });
});
