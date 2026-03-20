import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowLeft } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for students just getting started.',
    amountRaw: 0,
    features: [
      'Basic AI Explanations',
      'Up to 50 Flashcards/mo',
      'Text Notes',
      'Community Support'
    ],
    icon: Shield,
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
  },
  {
    name: 'Pro',
    price: '$10',
    period: '/month',
    description: 'For serious learners who want to accelerate.',
    amountRaw: 1000, 
    features: [
      'Advanced AI Assistant',
      'Unlimited Flashcards',
      'Smart Notes Generation',
      'Progress Tracking',
      'Priority Email Support'
    ],
    icon: Sparkles,
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'primary',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$30',
    period: '/month',
    description: 'Full power for power users and teams.',
    amountRaw: 3000,
    features: [
      'Everything in Pro',
      'Custom Context AI',
      'Export to Notion/PDF',
      'Team Collaboration',
      'Dedicated Support Manager'
    ],
    icon: Zap,
    buttonText: 'Get Enterprise',
    buttonVariant: 'secondary',
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  // Fallback public key for testing if the env variable isn't set.
  // In a real scenario, you MUST use your actual Paystack public key.
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dummy_key';

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment complete', response);
    try {
      const { error } = await supabase.functions.invoke('verify-payment', {
        body: { reference: response.reference }
      });
      
      if (error) throw error;
      
      alert(`Payment verified successfully! You are now on the ${processingTier} plan.`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Verification failed', error);
      alert(`Payment verification failed: ${error.message}`);
    } finally {
      setProcessingTier(null);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed');
    setProcessingTier(null);
  };

  const initializePayment = usePaystackPayment({
    publicKey: paystackPublicKey,
    reference: (new Date()).getTime().toString(),
    email: 'user@example.com', // In a real app, get from useAuth()
    amount: 0, // This will be set dynamically
    currency: 'ZAR', // Adjust currency as needed (ZAR, NGN, GHS, etc)
  });

  const handleSubscribe = (tierName: string, amountRaw: number) => {
    if (amountRaw === 0) {
      navigate('/dashboard');
      return;
    }

    if (!user) {
      alert("Please log in to upgrade your subscription.");
      navigate('/login');
      return;
    }

    setProcessingTier(tierName);
    
    // Paystack expects amount in the lowest denomination (e.g., kobo for NGN, cents for USD/ZAR)
    // Here we assume amountRaw is in Dollars/Rands and we multiply by 100 for cents/kobo
    const config = {
      amount: amountRaw * 100,
      email: user.email || 'user@explein.com',
      publicKey: paystackPublicKey,
      reference: `EXPLEIN-${new Date().getTime()}`,
    };

    initializePayment(
      // @ts-ignore - The react-paystack types can sometimes be strict without a wrapper, passing config directly is standard.
      handlePaymentSuccess, handlePaymentClose, config
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-200">
      <header className="absolute top-0 w-full p-6 z-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </header>

      <main className="flex-1 relative pt-24 pb-32 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6"
            >
              Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">pricing.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Choose the perfect plan to accelerate your learning journey with Explein.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {pricingTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className={`relative flex flex-col p-8 rounded-3xl bg-white border ${tier.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20 md:-mt-8 md:mb-8' : 'border-gray-200 shadow-xl shadow-gray-200/50'}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${tier.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
                    </div>
                    <div className="mb-2 text-foreground">
                      <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                      {tier.period && <span className="text-gray-500 text-lg font-medium">{tier.period}</span>}
                    </div>
                    <p className="text-gray-600">{tier.description}</p>
                  </div>

                  <div className="flex-1">
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 shrink-0 ${tier.popular ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSubscribe(tier.name, tier.amountRaw)}
                    disabled={processingTier === tier.name}
                    className={`w-full py-4 rounded-xl font-bold transition-all text-lg flex items-center justify-center gap-2 ${
                      tier.buttonVariant === 'primary'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/30'
                        : tier.buttonVariant === 'secondary'
                        ? 'bg-foreground text-white hover:bg-gray-800 shadow-lg shadow-gray-200'
                        : 'bg-white text-foreground border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {processingTier === tier.name ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      tier.buttonText
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
