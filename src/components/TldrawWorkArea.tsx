import React, { useCallback } from 'react';
import { Tldraw, DefaultContextMenu, DefaultContextMenuContent, TldrawUiMenuGroup, TldrawUiMenuItem } from 'tldraw';
import 'tldraw/tldraw.css';

interface TldrawWorkAreaProps {
  height?: string;
  onSave?: (data: any) => void;
  onClear?: () => void;
  className?: string;
  hideUi?: boolean;
  persistenceKey?: string;
  mobileHeight?: string;
}

export function TldrawWorkArea({
  height = "400px",
  onSave,
  onClear,
  className = "",
  hideUi = false,
  persistenceKey = 'tldraw-work-area-practice',
  mobileHeight = "300px"
}: TldrawWorkAreaProps) {

  const handleSave = useCallback(() => {
    if (onSave) {
      // This would export the current drawing data
      // You can customize this based on what format you need
      onSave('tldraw-data');
    }
  }, [onSave]);

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    }
  }, [onClear]);

  // Custom context menu with save/clear options
  const CustomContextMenu = useCallback((props: any) => {
    return (
      <DefaultContextMenu {...props}>
        <DefaultContextMenuContent />
        <TldrawUiMenuGroup id="custom">
          {onSave && (
            <TldrawUiMenuItem
              id="save-work"
              label="Save Work"
              icon="external-link"
              onSelect={handleSave}
            />
          )}
          {onClear && (
            <TldrawUiMenuItem
              id="clear-work"
              label="Clear All"
              icon="trash"
              onSelect={handleClear}
            />
          )}
        </TldrawUiMenuGroup>
      </DefaultContextMenu>
    );
  }, [handleSave, handleClear, onSave, onClear]);

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <div
        className="block md:hidden"
        style={{ height: mobileHeight }}
      >
        <Tldraw
          components={{
            ContextMenu: CustomContextMenu,
          }}
          persistenceKey={persistenceKey}
          hideUi={hideUi}
        />
      </div>
      <div
        className="hidden md:block"
        style={{ height }}
      >
        <Tldraw
          components={{
            ContextMenu: CustomContextMenu,
          }}
          persistenceKey={persistenceKey}
          hideUi={hideUi}
        />
      </div>
    </div>
  );
}

export default TldrawWorkArea; 