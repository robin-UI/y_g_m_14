
import { Progress } from '@/components/ui/progress';

interface ProfileProgressBarProps {
  completion: number;
}

const ProfileProgressBar = ({ completion }: ProfileProgressBarProps) => {
  // Define color classes based on completion percentage
  const getColorClass = () => {
    if (completion < 30) return "bg-red-500";
    if (completion < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const getCompletionLabel = () => {
    if (completion < 30) return "Just Started";
    if (completion < 50) return "Getting There";
    if (completion < 70) return "Good Progress";
    if (completion < 100) return "Almost Complete";
    return "Complete";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-grey-700">Profile Completion</span>
        <div className="flex items-center">
          <span className="text-lg font-bold text-primary">{completion}%</span>
          <span className="ml-2 text-xs text-grey-600">{getCompletionLabel()}</span>
        </div>
      </div>
      
      <div className="relative">
        <Progress value={completion} className="h-2.5 rounded-full bg-grey-200/70">
          <div 
            className={`absolute inset-0 h-full rounded-full ${getColorClass()} transition-all duration-500`}
            style={{ width: `${completion}%` }}
          />
        </Progress>
        
        {/* Milestones */}
        <div className="relative h-6 mt-1">
          {[25, 50, 75, 100].map((milestone) => (
            <div 
              key={milestone}
              className={`absolute top-0 -ml-1.5 ${
                completion >= milestone ? "text-primary" : "text-grey-400"
              }`}
              style={{ left: `${milestone}%` }}
            >
              <div className={`w-3 h-3 rounded-full mb-1 mx-auto ${
                completion >= milestone 
                  ? "bg-primary" 
                  : "bg-grey-300"
              }`}></div>
              <span className="text-[10px]">{milestone}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;
