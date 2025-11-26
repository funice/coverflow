import React from 'react';
import { STYLE_TAGS } from '../constants';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 5) return; // Limit to 5 tags
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {STYLE_TAGS.map(tag => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
              ${isSelected 
                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'}
            `}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagSelector;