import React from "react";
import { FolderX, Plus } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderX,
  title = "No records found",
  description = "There are currently no items in this section.",
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-2xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-[13px]late-400">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-bold text-[13px]late-800">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-[13px]late-500 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
