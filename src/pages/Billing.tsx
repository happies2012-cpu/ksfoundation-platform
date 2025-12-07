import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subscriptionApi, invoiceApi } from '@/lib/api';
import { Subscription, Invoice } from '@/lib/supabase';
import { DollarSign, Download, Calendar, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';

const Billing = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subs, invs] = await Promise.all([
        subscriptionApi.getSubscriptions(),
        invoiceApi.getInvoices(),
      ]);
      setSubscriptions(subs);
      setInvoices(invs);
    } catch (error: any) {
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    try {
      await subscriptionApi.cancelSubscription(id);
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will remain active until the end of the billing period.',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'cancelled':
        return 'bg-muted text-muted-foreground';
      case 'past_due':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black mb-8">
            <span className="gradient-text-orange">Billing</span>
          </h1>

          <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions">
              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <Card className="glass-card p-12 text-center">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">No subscriptions</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any active subscriptions
                    </p>
                  </Card>
                ) : (
                  subscriptions.map((sub) => (
                    <Card key={sub.id} className="glass-card p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">VPS Subscription</h3>
                            <Badge className={getStatusColor(sub.status)}>
                              {sub.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-semibold">${sub.amount}/{sub.billing_cycle === 'annual' ? 'year' : 'month'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Billing Cycle</p>
                              <p className="font-semibold capitalize">{sub.billing_cycle}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Next Billing</p>
                              <p className="font-semibold">
                                {new Date(sub.current_period_end).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Auto-renew</p>
                              <p className="font-semibold">
                                {sub.cancel_at_period_end ? 'No' : 'Yes'}
                              </p>
                            </div>
                          </div>
                        </div>
                        {sub.status === 'active' && !sub.cancel_at_period_end && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelSubscription(sub.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="invoices">
              <div className="space-y-4">
                {invoices.length === 0 ? (
                  <Card className="glass-card p-12 text-center">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">No invoices</h3>
                    <p className="text-muted-foreground">
                      Your invoices will appear here
                    </p>
                  </Card>
                ) : (
                  invoices.map((invoice) => (
                    <Card key={invoice.id} className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">Invoice #{invoice.id.slice(0, 8)}</h3>
                            <Badge
                              className={
                                invoice.status === 'paid'
                                  ? 'bg-success/20 text-success'
                                  : invoice.status === 'open'
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>Amount: ${invoice.amount}</span>
                            <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                            {invoice.paid_at && (
                              <span>Paid: {new Date(invoice.paid_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="payment">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Payment Methods</h2>
                  <Button variant="rocket">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
                <div className="p-8 text-center text-muted-foreground">
                  No payment methods on file
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Billing;

