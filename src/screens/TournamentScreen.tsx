/* ══════════════════════════════════════════════════════════════
   Tournament Screen — bracket matches (8강 → 4강 → 결승)
══════════════════════════════════════════════════════════════ */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CURATED_AREAS } from '../data/restaurants.ts';
import { ROUND_LABELS, TOTAL_MATCHES } from '../types/index.ts';
import type { Restaurant } from '../types/index.ts';
import PhotoCarousel from '../components/PhotoCarousel.tsx';

function TournamentCard({
  r,
  onPick,
  isWinner,
  isLoser,
  isClicking,
  areaLabel,
}: {
  r: Restaurant;
  onPick: () => void;
  isWinner: boolean;
  isLoser: boolean;
  isClicking: boolean;
  areaLabel?: string;
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
          <div className="tournament-card-info-row">
            <span className="tournament-card-name">{r.name}</span>
            <span className="tournament-card-sep">·</span>
            <span className="tournament-card-category">{r.category}</span>
            <span className="tournament-card-sep">·</span>
            <span className="star">★</span>
            <span>{r.rating}</span>
            <span className="tournament-card-reviews">({r.reviewCount.toLocaleString()})</span>
          </div>
          {r.walkMinutes != null && areaLabel && (
            <div className="tournament-card-walk">🚶 {areaLabel}에서 도보 {r.walkMinutes}분</div>
          )}
          <a
            className="gmaps-btn"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + (r.address || ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            📍 구글맵에서 보기
          </a>
        </div>
      </div>
      <button className="pick-btn" onClick={onPick} disabled={isWinner || isLoser}>
        {r.name} 선택!
      </button>
    </div>
  );
}

function RoundSummary({
  roundLabel,
  nextRoundLabel,
  winners,
  onNext,
}: {
  roundLabel: string;
  nextRoundLabel: string;
  winners: Restaurant[];
  onNext: () => void;
}) {
  return (
    <div className="round-summary cards--entering">
      <div className="round-summary-title">{roundLabel} 완료!</div>
      <div className="round-summary-sub">다음 라운드에 진출한 식당들</div>
      <div className="round-summary-list">
        {winners.map(r => (
          <div key={r.id} className="round-summary-item">
            <div className="round-summary-thumb" style={{ background: r.gradient }}>
              {r.photoUrl ? (
                <img src={r.photoUrl} alt={r.name} />
              ) : (
                <span>{r.emoji}</span>
              )}
            </div>
            <div className="round-summary-info">
              <div className="round-summary-name">{r.name}</div>
              <div className="round-summary-meta">{r.category} · ★{r.rating}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn--primary btn--full" onClick={onNext}>
        {nextRoundLabel} 시작! →
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
  const [showSummary, setShowSummary] = useState(false);
  const prevRoundRef = useRef(bracket.currentRound);

  const mode = state.locationMode;
  const area = mode ? CURATED_AREAS[mode] : null;

  const { currentRound, currentMatch, rounds, winners } = bracket;

  // Detect round change → show summary
  useEffect(() => {
    if (currentRound > prevRoundRef.current) {
      setShowSummary(true);
    }
    prevRoundRef.current = currentRound;
  }, [currentRound]);

  if (!rounds.length || (!showSummary && !rounds[currentRound]?.[currentMatch])) return null;

  const roundLabel = ROUND_LABELS[currentRound] ?? '';
  const totalMatches = TOTAL_MATCHES[currentRound] ?? 1;

  // Total matches done so far
  let totalDone = 0;
  for (let r = 0; r < currentRound; r++) totalDone += TOTAL_MATCHES[r];
  totalDone += currentMatch;

  const handlePick = useCallback((winner: Restaurant, loserId: string) => {
    if (pendingRef.current) return;
    pendingRef.current = true;

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

  useEffect(() => {
    setWinnerId(null);
    setClickingId(null);
  }, [currentRound, currentMatch]);

  // Round summary screen
  if (showSummary && currentRound > 0) {
    const prevWinners = winners[currentRound - 1] || [];
    const prevLabel = ROUND_LABELS[currentRound - 1] ?? '';
    return (
      <div className="screen">
        <div className="tournament-wrapper">
          <div className="screen-header">
            <button className="btn-back" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'map' })}>
              ← 뒤로
            </button>
            <h2 className="screen-title">푸드 월드컵</h2>
            <span className="round-badge">{prevLabel} 결과</span>
          </div>
          <RoundSummary
            roundLabel={prevLabel}
            nextRoundLabel={roundLabel}
            winners={prevWinners}
            onNext={() => setShowSummary(false)}
          />
        </div>
      </div>
    );
  }

  const [a, b] = rounds[currentRound][currentMatch];

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

        <div key={animKey} className="tournament-vs-stack cards--entering">
          <TournamentCard
            r={a}
            onPick={() => handlePick(a, b.id)}
            isWinner={winnerId === a.id}
            isLoser={winnerId === b.id}
            isClicking={clickingId === a.id}
            areaLabel={area?.label}
          />

          <div className="vs-divider">VS</div>

          <TournamentCard
            r={b}
            onPick={() => handlePick(b, a.id)}
            isWinner={winnerId === b.id}
            isLoser={winnerId === a.id}
            isClicking={clickingId === b.id}
            areaLabel={area?.label}
          />
        </div>
      </div>
    </div>
  );
}
