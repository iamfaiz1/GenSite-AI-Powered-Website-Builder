import React from 'react';

function Header({ website }) {
  return (
    <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
      <span className="font-semibold text-zinc-100 truncate">
        {website?.title || "Untitled Workspace"}
      </span>
    </div>
  );
}

export default Header;