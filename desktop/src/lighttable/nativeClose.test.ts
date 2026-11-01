// Exercise the real Tauri onCloseRequested wrapper, including its final
// destroy command. Mocking only window.close misses the shipping ACL failure.
import capability from '../../src-tauri/capabilities/default.json';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const native = vi.hoisted(() => ({ handlers: [] as Array<(event: object) => Promise<void>>, calls: [] as string[] }));
vi.mock('../host/transport', () => ({ inTauri: () => true }));
import { installReviewCloseGuard } from './launch';
import { lighttableStore } from './review';
import { libraryStore } from './library';
const emit = () => Promise.all(native.handlers.map((handler) => handler({ event: 'tauri://close-requested', id: 1, payload: null })));
beforeEach(async () => {
  native.handlers.length = 0; native.calls.length = 0;
  const callbacks = new Map<number, (event: object) => Promise<void>>(); let next = 0;
  vi.stubGlobal('window', { __TAURI_INTERNALS__: { metadata: { currentWindow: { label: 'main' } },
    transformCallback: (callback: (event: object) => Promise<void>) => { callbacks.set(++next, callback); return next; },
    invoke: async (command: string, args: { handler?: number }) => {
      native.calls.push(command);
      if (command === 'plugin:event|listen') { native.handlers.push(callbacks.get(args.handler!)!); return 1; }
      if (command === 'plugin:window|destroy') {
        if (!capability.permissions.includes('core:window:allow-destroy')) throw new Error('window.destroy not allowed. Permissions associated with this command: core:window:allow-destroy');
      }
    },
  } });
  lighttableStore.setState({ open: true, dirty: false, saving: false, closing: false, error: '', flush: vi.fn(async () => true) });
  libraryStore.setState({ dirty: false, error: '', flush: vi.fn(async () => true), cancelAnalysis: vi.fn() });
  await installReviewCloseGuard();
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
describe('native title-bar and taskbar close contract', () => {
  it('allows the actual SDK destroy command after opening a clean lighttable', async () => {
    await expect(emit()).resolves.toEqual([undefined]); expect(native.calls).toContain('plugin:window|destroy');
  });
  it('waits for review records and destroys once without recursively requesting close', async () => {
    let finish!: (value: boolean) => void;
    lighttableStore.setState({ dirty: true, flush: vi.fn(() => new Promise<boolean>((resolve) => { finish = resolve; })) });
    const closing = emit(); await vi.waitFor(() => expect(finish).toBeTypeOf('function'));
    expect(native.calls).not.toContain('plugin:window|destroy'); finish(true); await closing;
    expect(native.calls.filter((c) => c === 'plugin:window|destroy')).toHaveLength(1);
    expect(native.calls).not.toContain('plugin:window|close');
  });
  it('keeps the window usable when saving fails, then permits retry', async () => {
    lighttableStore.setState({ dirty: true, flush: vi.fn(async () => false) }); await emit();
    expect(native.calls).not.toContain('plugin:window|destroy'); expect(lighttableStore.getState().closing).toBe(false);
    lighttableStore.setState({ dirty: false, flush: vi.fn(async () => true) }); await emit();
    expect(native.calls).toContain('plugin:window|destroy');
  });
});
