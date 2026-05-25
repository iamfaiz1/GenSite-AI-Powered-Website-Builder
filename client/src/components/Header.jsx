import React from 'react';
import { X } from 'lucide-react';

function Header({ website, onclose }) {
  return (
    <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 bg-zinc-900/60 backdrop-blur-md">
      <span className="font-semibold text-zinc-100 truncate">
        {website?.title || "Untitled Workspace"}
      </span>
      {onclose && (
        <button onClick={onclose} className="p-2 hover:bg-white/10 rounded-lg ">
          <X />
        </button>
      )}
    </div>
  );
}

export default Header;