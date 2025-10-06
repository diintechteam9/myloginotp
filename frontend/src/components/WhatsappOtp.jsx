import { useMemo, useState } from 'react';
import { API_BASE_URL } from '../config';

function WhatsappOtp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = useMemo(() => {
    return CONFIG_BASE_URL || 'http://localhost:4000';
  }, []);

  function validatePhone(input) {
    const normalized = input.trim();
    // Accept optional +, digits only, reasonable length for international numbers
    const e164Like = /^\+?\d{8,15}$/;
    return e164Like.test(normalized);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const to = phoneNumber.trim();
    if (!validatePhone(to)) {
      setErrorMessage('Enter a valid WhatsApp number with country code, e.g., +14155552671');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/whatsapp/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send OTP');
      }

      setSuccessMessage('OTP sent successfully to your WhatsApp.');
      setPhoneNumber('');
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while sending OTP');
    } finally {
      setIsSubmitting(false);
    }
  }

  const apiWarning = !CONFIG_BASE_URL ? 'Using default http://localhost:4000 because VITE_BACKEND_URL is not set.' : '';

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl ring-1 ring-black/5 rounded-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
                <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 .01 5.36.01 11.98c0 2.12.55 4.17 1.6 5.98L0 24l6.23-1.63a11.98 11.98 0 005.77 1.49h.01c6.62 0 11.99-5.36 11.99-11.98 0-3.2-1.25-6.21-3.48-8.4zM12 22.02h-.01c-1.93 0-3.81-.52-5.45-1.5l-.39-.23-3.7.97.99-3.6-.25-.41A9.98 9.98 0 012.01 12C2.01 6.48 6.48 2.01 12 2.01c2.66 0 5.16 1.04 7.04 2.94 1.87 1.88 2.95 4.39 2.95 7.03 0 5.52-4.48 9.99-9.99 9.99z"/>
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.95-.95 1.14-.17.2-.35.22-.64.07-.3-.15-1.24-.46-2.36-1.47-.86-.77-1.44-1.72-1.6-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">WhatsApp OTP</h2>
              <p className="text-sm text-gray-500">Send a one-time code to your verified WhatsApp number.</p>
            </div>
          </div>

          {apiWarning && (
            <div className="mx-6 mt-2 mb-0 rounded-lg bg-amber-50 text-amber-800 text-xs px-3 py-2 border border-amber-100">
              {apiWarning}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g., +14155552671"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500/60 disabled:opacity-50"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Use your WhatsApp-verified number with country code.</p>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-white font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="-ml-0.5 mr-1 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M2 3h20v2H2zM2 11h20v2H2zM2 19h20v2H2z"/>
                  </svg>
                  Send OTP via WhatsApp
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing you agree to receive a one-time code via WhatsApp.
        </p>
      </div>
    </div>
  );
}

export default WhatsappOtp;


