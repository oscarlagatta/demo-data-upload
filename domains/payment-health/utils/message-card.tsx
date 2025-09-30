import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Status = "success" | "pending" | "failed";

export default function TransactionBanner({
  amount = "£1,250.00",
  refId = "TXN-9K3W21",
  date = "30 Sep 2025, 14:22",
  account = "US-Wire ••••1243",
  status = "success" as Status,
}: {
  amount?: string;
  refId?: string;
  date?: string;
  account?: string;
  status?: Status;
}) {
  const statusMap: Record<Status, { label: string; icon: any; badge: string }> = {
    success: { label: "Completed", icon: CheckCircle2, badge: "bg-green-600 text-white" },
    pending: { label: "Pending", icon: Clock,        badge: "bg-amber-500 text-white" },
    failed:  { label: "Failed",  icon: AlertCircle,  badge: "bg-red-600 text-white" },
  };
  const S = statusMap[status];
  const Icon = S.icon;

  return (
    <section className="w-full bg-muted/40 py-10">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-xl shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3">
            <Icon className="h-6 w-6" />
            <div className="flex-1">
              <CardTitle className="text-lg">Money transfer</CardTitle>
              <p className="text-sm text-muted-foreground">Reference: {refId}</p>
            </div>
            <Badge className={S.badge}>{S.label}</Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-3xl font-semibold leading-none">{amount}</div>

            <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <dt className="text-muted-foreground">Date</dt>
                <dd>{date}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <dt className="text-muted-foreground">From account</dt>
                <dd className="truncate">{account}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm">View receipt</Button>
              <Button size="sm" variant="outline">Share</Button>
              <Button size="sm" variant="ghost">Report an issue</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
