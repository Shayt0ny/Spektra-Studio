// EditorWindow.tsx — three regions and a filmstrip (ARCHITECTURE §7.1):
// Film and Print (left) | top bar + canvas + filmstrip | Parameters (right).

import { Canvas } from '../canvas/Canvas';
import { LeftRail } from '../panels/LeftRail';
import { RightRail } from '../panels/RightRail';
import { useSettings } from '../state/settings';
import { importPreviews, useSession } from '../state/session';
import { PreviewBuildStatus } from './PreviewBuildStatus';
import { Filmstrip } from './Filmstrip';
import { TopBar } from './TopBar';
import { AboutDialog, HostFailure, SettingsDialog } from './Dialogs';
import { DropImportDialog } from './DropImportDialog';
import { ExportPage } from '../export/ExportPage';
import { PanelResize } from '../controls/PanelResize';
import { lazy, Suspense } from 'react';
import { useLighttable } from '../lighttable/review';
import { tz } from '../i18n';

// Loading the editor does not initialize the review image pool or viewer UI.
const Lighttable = lazy(() => import('../lighttable/Lighttable').then((module) => ({ default: module.Lighttable })));

export function EditorWindow() {
  const left = useSettings((s) => s.leftCollapsed);
  const right = useSettings((s) => s.rightCollapsed);
  const strip = useSettings((s) => s.filmstripCollapsed);
  const batch = useSession((s) => s.batchExporting);
  const reviewing = useLighttable((s) => s.open);
  return (
    <>
      <div
        className="editor"
        inert={reviewing}
        style={{ ['--left-col' as string]: left ? '0px' : 'var(--left-width)', ['--right-col' as string]: right ? '0px' : 'var(--right-width)', pointerEvents: batch ? 'none' : undefined }}
        data-testid="editor"
      >
        {left ? <div /> : <LeftRail />}
        <main className="centre" style={{ position: 'relative' }}>
          {!left && <PanelResize side="left" />}
          {!right && <PanelResize side="right" />}
          <TopBar />
          <Canvas />
          <PreviewBuildStatus queue={importPreviews} />
          {!strip && <Filmstrip />}
          <HostFailure />
        </main>
        {right ? <div /> : <RightRail />}
      </div>
      <SettingsDialog />
      <AboutDialog />
      <ExportPage />
      <DropImportDialog />
      {reviewing && <Suspense fallback={<div className="dialog-overlay" role="status">{tz('Opening lighttable…', '正在打开观片台…')}</div>}><Lighttable /></Suspense>}
    </>
  );
}
