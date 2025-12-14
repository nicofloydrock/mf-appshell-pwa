import { Sidebar } from "./Sidebar";
import type { Microfront } from "../../types/microfront";

type Props = {
  open: boolean;
  copy: { title: string; tag: string };
  microfronts: Microfront[];
  active: Microfront;
  onClose: () => void;
  onSelect: (mf: Microfront) => void;
};

export function MenuDrawer({ open, copy, microfronts, active, onClose, onSelect }: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:bg-slate-900/30"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-x-0 top-24 z-30 flex justify-center px-3 lg:left-auto lg:right-6 lg:w-72 lg:justify-end lg:px-0">
        <Sidebar
          microfronts={microfronts}
          active={active}
          onSelect={(mf) => {
            onSelect(mf);
            onClose();
          }}
          copy={copy}
        />
      </div>
    </>
  );
}
