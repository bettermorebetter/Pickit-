/* ══════════════════════════════════════════════════════════════
   Search Results Section — collapsible category-based results
══════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { FOOD_CATEGORIES } from '../../data/constants.ts';
import type { Restaurant, FoodCategoryKey } from '../../types/index.ts';

const CATEGORY_LABELS: Record<string, string> = {
  korean:   '한식 🍚',
  japanese: '일식 🍣',
  chinese:  '중식 🥟',
  western:  '양식 🍔',
};

interface Props {
  results: Record<string, Restaurant[]>;
  selectedIds: string[];
}

function CategorySection({ catKey, restaurants, selectedIds }: {
  catKey: string;
  restaurants: Restaurant[];
  selectedIds: string[];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="admin-section">
      <div className="admin-section-header" onClick={() => setExpanded(!expanded)}>
        <span className="admin-section-title">{CATEGORY_LABELS[catKey] || catKey}</span>
        <span className="admin-section-count">{restaurants.length}곳</span>
        <button className="admin-section-toggle" aria-expanded={expanded}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      {expanded && (
        <div className="admin-section-body">
          {restaurants.length === 0 ? (
            <p className="admin-empty">검색 결과 없음</p>
          ) : (
            restaurants.map(r => {
              const isSelected = selectedIds.includes(r.id);
              return (
                <div
                  key={r.id}
                  className={`admin-result-row${isSelected ? ' admin-result-row--selected' : ''}`}
                >
                  {r.photoUrl ? (
                    <img src={r.photoUrl} className="admin-result-thumb" alt={r.name} />
                  ) : (
                    <div className="admin-result-thumb admin-result-thumb--emoji">{r.emoji}</div>
                  )}
                  <div className="admin-result-info">
                    <div className="admin-result-name">{r.name}</div>
                    <div className="admin-result-meta">
                      ★ {r.rating} ({r.reviewCount.toLocaleString()})
                      <span className="admin-score">
                        베이지안: {r.bayesianScore ? r.bayesianScore.toFixed(3) : '—'}
                      </span>
                    </div>
                  </div>
                  {isSelected && <span className="admin-badge">✓ 선택됨</span>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsSection({ results, selectedIds }: Props) {
  const catKeys = Object.keys(FOOD_CATEGORIES) as FoodCategoryKey[];
  return (
    <div className="admin-search-results">
      {catKeys.map(catKey => (
        <CategorySection
          key={catKey}
          catKey={catKey}
          restaurants={results[catKey] || []}
          selectedIds={selectedIds}
        />
      ))}
    </div>
  );
}
