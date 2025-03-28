
import { ApplicationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
      case "processing":
        return {
          label: "Processing",
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "approved":
        return {
          label: "Approved",
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-800 border-red-200"
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium rounded-full px-2.5 py-0.5 text-xs capitalize", 
        statusConfig.className,
        className
      )}
    >
      {statusConfig.label}
    </Badge>
  );
};

export default StatusBadge;
