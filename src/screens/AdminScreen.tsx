/* ══════════════════════════════════════════════════════════════
   Admin Screen — restaurant search & editor
══════════════════════════════════════════════════════════════ */

import { useCallback } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AdminProvider, useAdmin } from '../context/AdminContext.tsx';
import RecommendationTestTab from './admin/RecommendationTestTab.tsx';
import RestaurantEditorTab from './admin/RestaurantEditorTab.tsx';

function AdminContent() {
  const { dispatch: appDispatch } = useApp();
  const { state, dispatch } = useAdmin();

  const handleBack = useCallback(() => {
    appDispatch({ type: 'SET_SCREEN', screen: 'location' });
  }, [appDispatch]);

  return (
    <div className="screen">
      <div className="admin-wrapper">
        <header className="admin-header">
          <button className="btn-back" onClick={handleBack}>← 돌아가기</button>
          <h1 className="admin-title">관리자</h1>
        </header>

        <div className="admin-tabs" role="tablist">
          <button
            className={`admin-tab${state.activeTab === 'editor' ? ' admin-tab--active' : ''}`}
            role="tab"
            aria-selected={state.activeTab === 'editor'}
            onClick={() => dispatch({ type: 'SET_TAB', tab: 'editor' })}
          >
            ✏️ 식당 편집
          </button>
          <button
            className={`admin-tab${state.activeTab === 'search' ? ' admin-tab--active' : ''}`}
            role="tab"
            aria-selected={state.activeTab === 'search'}
            onClick={() => dispatch({ type: 'SET_TAB', tab: 'search' })}
          >
            🔍 식당 검색
          </button>
        </div>

        {state.activeTab === 'search' ? (
          <RecommendationTestTab />
        ) : (
          <RestaurantEditorTab />
        )}

        {state.toast && (
          <div className="editor-toast">{state.toast}</div>
        )}
      </div>
    </div>
  );
}

export default function AdminScreen() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
