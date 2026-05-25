
import React from 'react';
import { Send } from 'lucide-react';

function Chat({ website, handleUpdate, setPrompt, prompt, messages, thinkingSteps, thinkingIndex, updateLoading }) {

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 w-full">
        {messages?.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] flex ${m.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                  ? "bg-white text-black rounded-br-sm"
                  : "bg-zinc-800 border border-white/10 text-zinc-200 rounded-bl-sm"
                }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* dynamic loading text*/}
        {updateLoading && (
          <div className='max-w-[85%] mr-auto'>
            <div className='px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 border border-white/10 text-zinc-200 rounded-bl-sm'>
              {thinkingSteps[thinkingIndex]}
            </div>
          </div>
        )}
      </div>
      
      {/* chat inputbox */}
      <div className='p-3 border-t border-white/10'>
        <div className='flex gap-2'>
          <textarea
            rows={1}
            placeholder='Describe changes...'
            className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className='px-4 py-3 bg-white rounded-2xl text-black' onClick={handleUpdate}

          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;