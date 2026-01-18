
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BillingHistory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing History</h3>
        <p className="text-sm text-muted-foreground">
          View your past invoices and payment history.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            You have no billing history yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No invoices found.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistory;
