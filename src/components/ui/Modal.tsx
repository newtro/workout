import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        className="
          w-full max-w-lg
          bg-surface-900 border border-surface-800
          rounded-2xl shadow-2xl shadow-black/40
          animate-in fade-in zoom-in-95 duration-200
        "
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800">
            <h2 className="text-lg font-bold text-surface-100">{title}</h2>
            <button
              onClick={onClose}
              className="
                flex items-center justify-center w-8 h-8 rounded-lg
                text-surface-400 hover:text-surface-100 hover:bg-surface-800
                transition-colors duration-150
              "
              aria-label="Close"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <div className="flex justify-end px-4 pt-4">
            <button
              onClick={onClose}
              className="
                flex items-center justify-center w-8 h-8 rounded-lg
                text-surface-400 hover:text-surface-100 hover:bg-surface-800
                transition-colors duration-150
              "
              aria-label="Close"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
