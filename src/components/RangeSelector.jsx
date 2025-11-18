// Converted to .jsx (RangeSelectorProps interface and type annotations removed)
// - Updated text colors (text-slate-200, text-primary) for the dark theme.
// - Styled the <Badge> for better contrast on the dark panel.
// - Styled the toggle <button> for the dark theme.
// - Kept all functionality, state (isGlobal), and props identical.

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

// RangeSelectorProps interface removed
const RangeSelector = ({
  value,
  onChange,
  min = 5,
  max = 500,
  step = 5,
  showGlobal = true,
  className = '',
}) => {
  // We infer 'isGlobal' is a boolean from its usage
  const [isGlobal, setIsGlobal] = useState(false);

  const handleToggleGlobal = () => {
    setIsGlobal(!isGlobal);
    // If switching to global, we pass a special value (e.g., -1)
    // If switching to range-based, we use the current slider value
    onChange(isGlobal ? value : -1);
  };

  const handleSliderChange = (newValue) => { // type removed
    if (isGlobal) {
      setIsGlobal(false);
    }
    onChange(newValue[0]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-slate-200">Distance Range</h3>
        </div>
        
        <Badge 
          variant={isGlobal ? "secondary" : "default"}
          className="text-xs py-1 h-6 transition-all"
        >
          {isGlobal ? 'Global' : `${value} km`}
        </Badge>
      </div>
      
      <div className="px-1">
        <Slider
          disabled={isGlobal}
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className={isGlobal ? "opacity-50" : ""}
        />
      </div>
      
      {showGlobal && (
        <button
          type="button"
          onClick={handleToggleGlobal}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200"
        >
          {isGlobal ? 'Switch to range-based' : 'Show incidents globally'}
        </button>
      )}
    </div>
  );
};

export default RangeSelector;