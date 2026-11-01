// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
import { lighttableStore } from './review';
import { flushEditsBeforeClose, sessionStore } from '../state/session';
import { dropImportStore } from '../state/dropImport';
import { inTauri } from '../host/transport';
import { libraryStore } from './library';

export function openLighttable() {
  const s = sessionStore.getState();
  if (s.batchExporting || s.exportOpen || s.settingsOpen || s.aboutOpen || dropImportStore.getState().open || !s.frames.length) return;
  void lighttableStore.getState().start(s.frames, s.selection);
}

/** Flush editor history and review records. The SDK awaits this callback
 * and then destroys the window. Do not recursively call window.close(). */
export async function installReviewCloseGuard() {
  if (!inTauri()) return;
  const window = (await import('@tauri-apps/api/window')).getCurrentWindow();
  let closing = false;
  await window.onCloseRequested(async (event) => {
    const review = lighttableStore.getState();
    if (review.open) libraryStore.getState().cancelAnalysis();
    if (closing) { event.preventDefault(); return; }
    closing = true; lighttableStore.setState({ closing: true });
    try {
      if (!await flushEditsBeforeClose() || !await review.flush() || !await libraryStore.getState().flush()) event.preventDefault();
    }
    catch (error) { event.preventDefault(); lighttableStore.setState({ error: String(error) }); }
    finally { closing = false; lighttableStore.setState({ closing: false }); }
  });
}
