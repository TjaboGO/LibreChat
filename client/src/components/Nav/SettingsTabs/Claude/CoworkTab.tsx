/* eslint-disable i18next/no-literal-string */
import React, { useState } from 'react';
import { Switch } from '@librechat/client';
import { Folder, Globe, Shield, Trash2, Plus, X } from 'lucide-react';

export default function CoworkTab() {
  const [requireTrustedDevices, setRequireTrustedDevices] = useState(false);
  const [coworkFilesPath, setCoworkFilesPath] = useState('~/Documents/Claude/Cowork');
  const [onlyOnThisComputer, setOnlyOnThisComputer] = useState(false);
  const [preferredBrowser, setPreferredBrowser] = useState('Built-in browser');
  const [openInBuiltinBrowser, setOpenInBuiltinBrowser] = useState(true);

  // Modals state
  const [isFoldersModalOpen, setIsFoldersModalOpen] = useState(false);
  const [isSitesModalOpen, setIsSitesModalOpen] = useState(false);
  const [isChangePathModalOpen, setIsChangePathModalOpen] = useState(false);
  const [tempPath, setTempPath] = useState(coworkFilesPath);

  // Mock list of trusted folders & allowed sites
  const [trustedFolders, setTrustedFolders] = useState<string[]>([
    '~/Documents/Claude/Cowork',
    '~/Projects/web-apps',
  ]);
  const [newFolderInput, setNewFolderInput] = useState('');

  const [allowedSites, setAllowedSites] = useState<string[]>([
    'localhost:3000',
    'localhost:5173',
    'github.com',
  ]);
  const [newSiteInput, setNewSiteInput] = useState('');

  const handleAddFolder = () => {
    const trimmed = newFolderInput.trim();
    if (trimmed && !trustedFolders.includes(trimmed)) {
      setTrustedFolders([...trustedFolders, trimmed]);
      setNewFolderInput('');
    }
  };

  const handleRemoveFolder = (folder: string) => {
    setTrustedFolders(trustedFolders.filter((f) => f !== folder));
  };

  const handleAddSite = () => {
    const trimmed = newSiteInput.trim();
    if (trimmed && !allowedSites.includes(trimmed)) {
      setAllowedSites([...allowedSites, trimmed]);
      setNewSiteInput('');
    }
  };

  const handleRemoveSite = (site: string) => {
    setAllowedSites(allowedSites.filter((s) => s !== site));
  };

  return (
    <div className="flex flex-col gap-6 text-text-primary">
      {/* HEADER */}
      <div className="border-b border-border-light pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Cowork
        </h3>
      </div>

      <div className="divide-y divide-border-light/60">
        {/* REQUIRE TRUSTED DEVICES */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Require trusted devices</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Verify each new device before it can connect to Claude on your computer remotely —
              applies to Claude Code Remote Control and Cowork.{' '}
              <a
                href="https://docs.anthropic.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 underline hover:text-text-primary"
              >
                <span>Learn more</span>
                <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
          <Switch
            checked={requireTrustedDevices}
            onCheckedChange={setRequireTrustedDevices}
            aria-label="Require trusted devices"
          />
        </div>

        {/* COWORK FILES */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Cowork files</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Your artifacts and scheduled tasks are stored at{' '}
              <span className="font-mono text-text-primary">{coworkFilesPath}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTempPath(coworkFilesPath);
              setIsChangePathModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            <Folder className="h-3.5 w-3.5 text-text-tertiary" />
            <span>Change</span>
          </button>
        </div>

        {/* TRUSTED COWORK FOLDERS */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Trusted Cowork folders</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Cowork tasks may use these folders, and folders inside them, without asking you first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFoldersModalOpen(true)}
            className="rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Manage
          </button>
        </div>

        {/* ONLY ON THIS COMPUTER */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Only on this computer</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Stops when the app closes or this computer sleeps.{' '}
              <a
                href="https://docs.anthropic.com"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-text-primary"
              >
                Learn more about how Claude reads your files
              </a>
            </p>
          </div>
          <Switch
            checked={onlyOnThisComputer}
            onCheckedChange={setOnlyOnThisComputer}
            aria-label="Only on this computer"
          />
        </div>

        {/* PREFERRED BROWSER */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Preferred browser</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Claude uses this browser by default unless you ask otherwise.
            </p>
          </div>
          <select
            value={preferredBrowser}
            onChange={(e) => setPreferredBrowser(e.target.value)}
            className="rounded-lg border border-border-light bg-surface-secondary px-2.5 py-1.5 text-xs text-text-primary focus:outline-none"
            aria-label="Preferred browser"
          >
            <option value="Built-in browser">Built-in browser</option>
            <option value="System default">System default</option>
            <option value="Google Chrome">Google Chrome</option>
            <option value="Safari">Safari</option>
          </select>
        </div>

        {/* OPEN LINKS IN BUILT-IN BROWSER */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">
              Open links in built-in browser
            </div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Links open in the built-in browser instead of your default browser.
            </p>
          </div>
          <Switch
            checked={openInBuiltinBrowser}
            onCheckedChange={setOpenInBuiltinBrowser}
            aria-label="Open links in built-in browser"
          />
        </div>

        {/* ALLOWED SITES */}
        <div className="flex items-center justify-between py-3.5">
          <div className="max-w-md pr-4">
            <div className="text-xs font-medium text-text-primary">Allowed sites</div>
            <p className="mt-0.5 text-xs text-text-secondary">
              Sites where Claude can use its Browser tools without a permission prompt.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSitesModalOpen(true)}
            className="rounded-lg border border-border-light bg-surface-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Manage
          </button>
        </div>
      </div>

      {/* MODAL: CHANGE COWORK FILES PATH */}
      {isChangePathModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <h4 className="text-sm font-semibold text-text-primary">Cowork files directory</h4>
              <button
                type="button"
                onClick={() => setIsChangePathModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Enter the directory path on your computer where Cowork tasks and artifacts will be
              stored.
            </p>
            <input
              type="text"
              value={tempPath}
              onChange={(e) => setTempPath(e.target.value)}
              className="mt-3 w-full rounded-lg border border-border-light bg-surface-secondary px-3 py-2 font-mono text-xs text-text-primary focus:outline-none"
              placeholder="e.g. ~/Documents/Claude/Cowork"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsChangePathModalOpen(false)}
                className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setCoworkFilesPath(tempPath);
                  setIsChangePathModalOpen(false);
                }}
                className="rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TRUSTED COWORK FOLDERS */}
      {isFoldersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-semibold text-text-primary">Trusted Cowork folders</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsFoldersModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Cowork can read, modify, and create files in these folders without prompting for
              permission.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newFolderInput}
                onChange={(e) => setNewFolderInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFolder();
                  }
                }}
                placeholder="e.g. ~/Projects/my-app"
                className="flex-1 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 font-mono text-xs text-text-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFolder}
                className="flex items-center gap-1 rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add folder</span>
              </button>
            </div>

            <div className="mt-4 max-h-56 divide-y divide-border-light/60 overflow-y-auto rounded-lg border border-border-light">
              {trustedFolders.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-tertiary">
                  No trusted folders configured.
                </div>
              ) : (
                trustedFolders.map((folder) => (
                  <div key={folder} className="flex items-center justify-between p-2.5">
                    <span className="font-mono text-xs text-text-primary">{folder}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFolder(folder)}
                      className="text-text-tertiary transition-colors hover:text-red-500"
                      aria-label={`Remove ${folder}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFoldersModalOpen(false)}
                className="rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALLOWED SITES */}
      {isSitesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border-light bg-surface-primary p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-text-primary">Allowed sites</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSitesModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Claude can interact with these domains using its browser tools without prompting for
              confirmation each time.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newSiteInput}
                onChange={(e) => setNewSiteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSite();
                  }
                }}
                placeholder="e.g. localhost:8080 or example.com"
                className="flex-1 rounded-lg border border-border-light bg-surface-secondary px-3 py-1.5 font-mono text-xs text-text-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSite}
                className="flex items-center gap-1 rounded-lg bg-text-primary px-3 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add site</span>
              </button>
            </div>

            <div className="mt-4 max-h-56 divide-y divide-border-light/60 overflow-y-auto rounded-lg border border-border-light">
              {allowedSites.length === 0 ? (
                <div className="p-4 text-center text-xs text-text-tertiary">
                  No allowed sites configured.
                </div>
              ) : (
                allowedSites.map((site) => (
                  <div key={site} className="flex items-center justify-between p-2.5">
                    <span className="font-mono text-xs text-text-primary">{site}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSite(site)}
                      className="text-text-tertiary transition-colors hover:text-red-500"
                      aria-label={`Remove ${site}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSitesModalOpen(false)}
                className="rounded-lg bg-text-primary px-4 py-1.5 text-xs font-medium text-surface-primary hover:bg-text-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
