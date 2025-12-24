import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionApi, invoiceApi } from '@/lib/api';
import { Subscription, Invoice } from '@/lib/supabase';
import { CreditCard, Calendar, DollarSign, FileText, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Billing = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
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
      
      setSubscription(subs[0] || null); // Assuming one active subscription
      setInvoices(invs);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free Plan';
      case 'pro': return 'Pro Plan';
      case 'team': return 'Team Plan';
      default: return 'Unknown Plan';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-8">
            <span className="gradient-text-orange">Billing</span>
          </h1>

          {/* Current Plan */}
          <Card className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {subscription ? getPlanName(subscription.plan) : 'No Active Plan'}
                </h2>
                {subscription ? (
                  <>
                    <p className="text-muted-foreground mb-1">
                      {formatCurrency(subscription.amount)} billed {subscription.billing_cycle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Next billing date: {formatDate(subscription.current_period_end)}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    You're currently on the free plan. Upgrade for more features.
                  </p>
                )}
              </div>
              <Button variant="rocket" asChild>
                <Link to="/dashboard/billing/plans">
                  {subscription ? 'Manage Plan' : 'Upgrade Plan'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </h3>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Current Payment Method</p>
                <p className="font-semibold">No payment method on file</p>
              </div>
              <Button variant="outline" className="mt-4">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Billing Cycle
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Period Started</span>
                  <span>
                    {subscription ? formatDate(subscription.current_period_start) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Period Ends</span>
                  <span>
                    {subscription ? formatDate(subscription.current_period_end) : 'N/A'}
                  </span>
                </div>
                {subscription && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Cycle</span>
                    <span className="capitalize">{subscription.billing_cycle}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Invoices */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Invoices
              </h3>
            </div>
            
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <h4 className="font-medium">Invoice #{invoice.id.substring(0, 8)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(invoice.created_at)} • {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'open'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Billing;