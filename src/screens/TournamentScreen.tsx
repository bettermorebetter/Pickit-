/* ══════════════════════════════════════════════════════════════
   Tournament Screen — bracket matches (8강 → 4강 → 결승)
══════════════════════════════════════════════════════════════ */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ROUND_LABELS, TOTAL_MATCHES } from '../types/index.ts';
import type { Restaurant } from '../types/index.ts';
import PhotoCarousel from '../components/PhotoCarousel.tsx';

function TournamentCard({
  r,
  onPick,
  isWinner,
  isLoser,
  isClicking,
}: {
  r: Restaurant;
  onPick: () => void;
  isWinner: boolean;
  isLoser: boolean;
  isClicking: boolean;
}) {
  const cardClass = [
    'tournament-card',
    isWinner ? 'card--selected' : '',
    isClicking ? 'card--clicking' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="tournament-card-slot" style={isLoser ? { opacity: 0.35, transform: 'scale(.95)', pointerEvents: 'none' } : undefined}>
      <div
        className={cardClass}
        tabIndex={0}
        role="button"
        aria-label={`${r.name} 선택`}
        onClick={onPick}
      >
        <div className="tournament-card-hero" style={{ background: r.gradient }}>
          {r.photoUrl ? (
            <PhotoCarousel photos={r.photoUrls?.length ? r.photoUrls : [r.photoUrl]} alt={r.name} />
          ) : (
            r.emoji
          )}
        </div>
        <div className="tournament-card-body">
          <div className="tournament-card-name">{r.name}</div>
          <div className="tournament-card-category">{r.category}</div>
          <div className="tournament-card-rating">
            <span className="star">★</span>
            <span>{r.rating}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '.75rem' }}>
              ({r.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
      </div>
      <button className="pick-btn" onClick={onPick} disabled={isWinner || isLoser}>
        {r.name} 선택!
      </button>
    </div>
  );
}

export default function TournamentScreen() {
  const { state, dispatch } = useApp();
  const { bracket } = state;
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [clickingId, setClickingId] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const pendingRef = useRef(false);

  const { currentRound, currentMatch, rounds } = bracket;
  if (!rounds.length || !rounds[currentRound]?.[currentMatch]) return null;

  const [a, b] = rounds[currentRound][currentMatch];
  const roundLabel = ROUND_LABELS[currentRound];
  const totalMatches = TOTAL_MATCHES[currentRound];

  // Total matches done so far
  let totalDone = 0;
  for (let r = 0; r < currentRound; r++) totalDone += TOTAL_MATCHES[r];
  totalDone += currentMatch;

  const handlePick = useCallback((winner: Restaurant, loserId: string) => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    // Brief click feedback
    setClickingId(winner.id);

    setTimeout(() => {
      setClickingId(null);
      setWinnerId(winner.id);

      setTimeout(() => {
        dispatch({ type: 'PICK_WINNER', winner });
        setWinnerId(null);
        setAnimKey(k => k + 1);
        pendingRef.current = false;
      }, 380);
    }, 160);
  }, [dispatch]);

  // Reset animation on match change
  useEffect(() => {
    setWinnerId(null);
    setClickingId(null);
  }, [currentRound, currentMatch]);

  return (
    <div className="screen">
      <div className="tournament-wrapper">
        <div className="screen-header">
          <button className="btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'map' })}>
            ← 뒤로
          </button>
          <h2 className="screen-title">푸드 월드컵</h2>
          <span className="round-badge">{roundLabel}</span>
        </div>

        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{ width: `${(totalDone / 7) * 100}%` }}
            role="progressbar"
            aria-valuenow={totalDone}
            aria-valuemin={0}
            aria-valuemax={7}
          />
        </div>
        <div className="progress-label">{roundLabel} · 매치 {currentMatch + 1}/{totalMatches}</div>

        <div className="tournament-prompt">어떤 식당이 더 좋으세요?</div>

        <div key={animKey} className="tournament-vs-grid cards--entering">
          <TournamentCard
            r={a}
            onPick={() => handlePick(a, b.id)}
            isWinner={winnerId === a.id}
            isLoser={winnerId === b.id}
            isClicking={clickingId === a.id}
          />

          <div className="vs-divider">VS</div>

          <TournamentCard
            r={b}
            onPick={() => handlePick(b, a.id)}
            isWinner={winnerId === b.id}
            isLoser={winnerId === a.id}
            isClicking={clickingId === b.id}
          />
        </div>
      </div>
    </div>
  );
}
