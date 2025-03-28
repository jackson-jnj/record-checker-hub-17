
import { Application } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/formatters";

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-police-dark">{application.referenceNumber}</h3>
            <p className="text-sm text-muted-foreground capitalize">{application.applicationType} Check</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{application.applicantName}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Submitted {formatDate(application.submissionDate)}</span>
        </div>
        {application.assignedOfficerName && (
          <div className="flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Assigned to {application.assignedOfficerName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link to={`/applications/${application.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
