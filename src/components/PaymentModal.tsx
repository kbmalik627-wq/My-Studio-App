import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  MessageSquare,
  ShieldCheck,
  Check,
  Flame,
} from 'lucide-react';
import { PlanStatus } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planStatus: PlanStatus;
  onPlanUpdated: (newPlan: PlanStatus) => void;
  initialPackage?: 'voices' | 'words' | 'combo';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planStatus,
  onPlanUpdated,
  initialPackage = 'combo',
}) => {
  const [selectedPkg, setSelectedPkg] = useState<'voices' | 'words' | 'combo'>(initialPackage);
  const [trxId, setTrxId] = useState('');
  const [senderName, setSenderName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa' | 'binance'>('jazzcash');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trxId.trim()) {
      setFeedback({ type: 'error', message: 'Transaction ID / Hash darj karein!' });
      return;
    }

    setIsVerifying(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trxid: trxId.trim(),
          pkg: selectedPkg,
          senderName: senderName.trim(),
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.success && data.verified) {
        const updated: PlanStatus = {
          isPremiumVoice: planStatus.isPremiumVoice || data.unlockVoices,
          isPremiumWords: planStatus.isPremiumWords || data.unlockWords,
          activatedPackage: selectedPkg,
          trxId: data.trxId,
          activatedAt: new Date().toISOString(),
          expiresAt: data.expiresAt,
        };

        localStorage.setItem('premiumVoice', updated.isPremiumVoice ? 'true' : 'false');
        localStorage.setItem('premiumWords', updated.isPremiumWords ? 'true' : 'false');
        localStorage.setItem('planStatus', JSON.stringify(updated));

        onPlanUpdated(updated);
        setFeedback({ type: 'success', message: data.message });
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Verification fail ho gayi. WhatsApp par screenshot bhejein.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedback({ type: 'error', message: `Server error: ${msg}` });
    } finally {
      setIsVerifying(false);
    }
  };

  const applyInstantCode = (code: string, pkg: 'voices' | 'words' | 'combo') => {
    setTrxId(code);
    setSelectedPkg(pkg);
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-pink-500/40 bg-slate-900 p-5 sm:p-7 text-white shadow-2xl shadow-pink-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 shadow-lg shadow-pink-600/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🔒 Premium Unlock <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-mono">Full World Access</span>
            </h3>
            <p className="text-xs text-slate-400">12+ Voices &bull; 500+ Words Unlimited &bull; 100% Copyright Free</p>
          </div>
        </div>

        {/* Package Selector Cards */}
        <div className="mt-5 space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Your Package:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Package 1 */}
            <div
              onClick={() => setSelectedPkg('voices')}
              className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                selectedPkg === 'voices'
                  ? 'border-pink-500 bg-pink-950/40 ring-2 ring-pink-500/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-medium text-slate-400">Package 1</div>
              <div className="text-base font-bold text-white">All Voices</div>
              <div className="text-lg font-extrabold text-pink-400 mt-1">Rs. 250<span className="text-xs text-slate-400 font-normal"> /mo</span></div>
              <p className="mt-1 text-[11px] text-slate-300">12+ International Male/Female voices unlock</p>
            </div>

            {/* Package 2 */}
            <div
              onClick={() => setSelectedPkg('words')}
              className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                selectedPkg === 'words'
                  ? 'border-pink-500 bg-pink-950/40 ring-2 ring-pink-500/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-medium text-slate-400">Package 2</div>
              <div className="text-base font-bold text-white">Unlimited Words</div>
              <div className="text-lg font-extrabold text-pink-400 mt-1">Rs. 250<span className="text-xs text-slate-400 font-normal"> /mo</span></div>
              <p className="mt-1 text-[11px] text-slate-300">500+ words limit khatam, lambi audio banayein</p>
            </div>

            {/* Combo Package */}
            <div
              onClick={() => setSelectedPkg('combo')}
              className={`relative cursor-pointer rounded-2xl p-3.5 border transition-all ${
                selectedPkg === 'combo'
                  ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/30'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-2.5 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-extrabold text-slate-950 uppercase">
                Best Value
              </div>
              <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Combo Pack
              </div>
              <div className="text-base font-bold text-white">Voices + Words</div>
              <div className="text-lg font-extrabold text-emerald-400 mt-1">
                Rs. 400<span className="text-xs text-slate-400 line-through font-normal ml-1">Rs. 500</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-200">Dono packages shaamil hain (Save Rs. 100)</p>
            </div>
          </div>
        </div>

        {/* Payment Details Accordion/Section */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" /> 1. Payment Bhejne Ka Tareeqa
          </h4>

          {/* Pakistan Methods */}
          <div className="mt-3 rounded-xl bg-slate-900/90 p-3.5 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400">🇵🇰 Pakistan (JazzCash & Easypaisa):</span>
                <div className="text-xl font-black font-mono tracking-wider text-white mt-0.5">
                  03267976823
                </div>
                <div className="text-xs text-slate-300">
                  Account Title: <b className="text-white">AI Voice Studio</b>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard('03267976823', 'pakistan_num')}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600/20 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 ring-1 ring-emerald-500/40"
              >
                {copiedField === 'pakistan_num' ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy No
                  </>
                )}
              </button>
            </div>
          </div>

          {/* International Methods */}
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-bold">🌍 Binance Pay ID:</span>
                <p className="font-mono font-bold text-white text-sm">3267976823</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('3267976823', 'binance_id')}
                className="rounded-lg bg-amber-500/20 p-1.5 text-amber-300 hover:bg-amber-500/30"
              >
                {copiedField === 'binance_id' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <a
              href="https://wa.me/923267976823?text=Assalam-o-Alaikum!%20AI%20Voice%20Studio%20ke%20payment%20ke%20liye%20rabta%20kiya%20hai."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-950/40 p-3 border border-emerald-500/30 flex items-center justify-between text-emerald-300 hover:bg-emerald-900/40 transition-colors"
            >
              <div>
                <span className="text-[11px] font-bold">💬 WhatsApp Support:</span>
                <p className="font-mono font-bold text-white text-sm">03267976823</p>
              </div>
              <MessageSquare className="h-4 w-4 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="mt-5 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            2. Payment Ke Baad Trx ID Darj Karein:
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="trxid"
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="Transaction ID / TID (e.g. 03291847192)"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
            />

            <select
              value={selectedPkg}
              onChange={(e) => setSelectedPkg(e.target.value as 'voices' | 'words' | 'combo')}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
            >
              <option value="voices">Sirf Voices - Rs.250</option>
              <option value="words">Sirf Unlimited Words - Rs.250</option>
              <option value="combo">Combo (Dono) - Rs.400</option>
            </select>
          </div>

          {/* Quick Demo Test Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
            <span>Instant Demo Code:</span>
            <button
              type="button"
              onClick={() => applyInstantCode('DEMO400', 'combo')}
              className="rounded-md bg-purple-950/80 px-2 py-0.5 text-purple-300 ring-1 ring-purple-500/30 hover:bg-purple-900"
            >
              DEMO400 (Combo)
            </button>
            <button
              type="button"
              onClick={() => applyInstantCode('VIPFREE', 'combo')}
              className="rounded-md bg-pink-950/80 px-2 py-0.5 text-pink-300 ring-1 ring-pink-500/30 hover:bg-pink-900"
            >
              VIPFREE
            </button>
            <button
              type="button"
              onClick={() => applyInstantCode('STUDIO2026', 'voices')}
              className="rounded-md bg-slate-800 px-2 py-0.5 text-slate-300 hover:bg-slate-700"
            >
              STUDIO2026
            </button>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/30 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          >
            {isVerifying ? 'Verifying Transaction...' : '✅ Verify & Unlock Now'}
          </button>
        </form>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`mt-4 rounded-xl p-3.5 text-xs flex items-start gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{feedback.message}</p>
              {feedback.type === 'success' && (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 inline-block rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  Start Using Premium Voices &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Fast Unlock WhatsApp Note */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            WhatsApp par screenshot bhejo for fast unlock:{' '}
            <a
              href="https://wa.me/923267976823?text=Assalam-o-Alaikum!%20Maine%20AI%20Voice%20Studio%20ki%20payment%20ki%20hai,%20yeh%20screenshot%20hai."
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-400 underline hover:text-emerald-300 ml-1"
            >
              03267976823
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
