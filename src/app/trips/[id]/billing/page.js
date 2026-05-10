"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";

export default function BillingPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [trip, setTrip] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetch(`/api/trips/${p.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setTrip(data.data);
        });
    });
  }, [params]);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/trips/${id}/itinerary`);
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', textAlign: 'center' }}>
        <div className="icon-box icon-box-lg mb-4" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-muted">Redirecting you to your itinerary...</p>
      </div>
    );
  }

  const flightCost = trip?.flightCost || 0;
  const hotelCost = trip?.hotelCost || 0;
  const platformFee = 1000;
  const totalCost = flightCost + hotelCost + platformFee;
  const currentBudget = trip?.budget || 0;
  const remainingBudget = currentBudget - flightCost - hotelCost;

  return (
    <div className="billing-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div className="flex-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Secure Checkout</h2>
          <p className="text-muted mt-1">Complete your payment to finalize your trip plan</p>
        </div>
        {trip && (
          <div className="text-right">
            <div className="text-sm text-muted mb-1">Remaining Budget</div>
            <div className={`text-xl font-bold ${remainingBudget < 0 ? 'text-error' : 'text-success'}`}>
              ₹{remainingBudget.toLocaleString()} <span className="text-sm font-normal text-muted">/ ₹{currentBudget.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Payment Form */}
        <form onSubmit={handlePayment} className="glass-panel p-6">
          <h3 className="font-semibold mb-4 flex-row gap-2">
            <CreditCard size={18} /> Payment Details
          </h3>
          
          <div className="form-group mb-4">
            <label className="form-label">Cardholder Name</label>
            <input type="text" placeholder="Name on card" required defaultValue="John Doe" />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Card Number</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="0000 0000 0000 0000" required defaultValue="4111 1111 1111 1111" />
              <CreditCard size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="grid-2 mb-6">
            <div className="form-group">
              <label className="form-label">Expiry (MM/YY)</label>
              <input type="text" placeholder="12/26" required defaultValue="12/28" />
            </div>
            <div className="form-group">
              <label className="form-label">CVC</label>
              <input type="text" placeholder="123" required defaultValue="123" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={isProcessing}>
            {isProcessing ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing...</>
            ) : (
              <><Lock size={14} className="mr-1" /> Pay ₹{totalCost.toLocaleString()}</>
            )}
          </button>
          
          <p className="text-xs text-muted mt-4 text-center flex-row gap-1" style={{ justifyContent: 'center' }}>
            <Lock size={10} /> Your payment information is encrypted and secure.
          </p>
        </form>

        {/* Order Summary */}
        <div className="glass-panel p-6" style={{ alignSelf: 'start' }}>
          <h3 className="font-semibold mb-4">Order Summary</h3>
          
          <div className="flex-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-muted">Flights (Selected)</span>
            <span className="font-medium">₹{flightCost.toLocaleString()}</span>
          </div>
          
          <div className="flex-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-muted">Hotel Accommodation</span>
            <span className="font-medium">₹{hotelCost.toLocaleString()}</span>
          </div>
          
          <div className="flex-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="text-muted">Platform Fee</span>
            <span className="font-medium">₹{platformFee.toLocaleString()}</span>
          </div>

          <div className="flex-between mt-4">
            <span className="font-bold text-lg">Total Due Now</span>
            <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>₹{totalCost.toLocaleString()}</span>
          </div>

          <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--success-light)', color: 'var(--success-dark)' }}>
            <h4 className="font-semibold flex-row gap-1 mb-1"><CheckCircle size={14} /> What you get:</h4>
            <ul className="text-sm mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>• Confirmed bookings</li>
              <li>• Access to Itinerary Builder</li>
              <li>• Group collaboration tools</li>
              <li>• Export to PDF & Calendar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
