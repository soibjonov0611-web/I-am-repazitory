import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { contactChannels } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion';

const initialForm = { name: '', email: '', message: '' };

// Basic client-side email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm]     = useState(initialForm);
  const [honeypot, setHoneypot] = useState(''); // spam trap — must stay empty
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [clientError, setClientError] = useState('');

  // ─── Client-side validation ───────────────────────────────────────────────
  function validate() {
    if (!form.name.trim() || form.name.trim().length > 100) {
      return t('contact.nameLabel') + ' is required (max 100 chars).';
    }
    if (!form.email.trim() || !isValidEmail(form.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      return 'Message must be at least 10 characters.';
    }
    if (form.message.trim().length > 2000) {
      return 'Message must not exceed 2000 characters.';
    }
    return null;
  }

  // ─── Submit handler ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');

    const validationError = validate();
    if (validationError) {
      setClientError(validationError);
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim(),
          email:   form.email.trim(),
          message: form.message.trim(),
          website: honeypot, // honeypot field
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm(initialForm);

      // Reset to idle after 6 seconds
      setTimeout(() => setStatus('idle'), 6000);

    } catch {
      setStatus('error');
    }
  };

  const isSending = status === 'sending';

  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          className="contact-card"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp()}
        >
          <motion.div variants={fadeUp(1)}>
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h2>
              {t('contact.titleStart')}{' '}
              <span className="gradient-text">{t('contact.titleEnd')}</span>
            </h2>
            <p>{t('contact.subtext')}</p>
          </motion.div>

          <motion.div
            className="contact-channels"
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {contactChannels.map((channel) => {
              const Icon = getIcon(channel.icon);
              const isMail = channel.url.startsWith('mailto:');

              return (
                <motion.a
                  className="contact-chip"
                  key={channel.name}
                  href={channel.url}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  aria-label={`${channel.name} — ${channel.handle}`}
                  variants={fadeUp()}
                >
                  <Icon size={17} />
                  <span>{channel.name}</span>
                  <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>{channel.handle}</span>
                </motion.a>
              );
            })}
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            variants={fadeUp(2)}
            noValidate
          >
            {/* ── Honeypot (hidden from real users, bots fill it) ── */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />

            <div className="form-row">
              <div className="field">
                <label htmlFor="contact-name">{t('contact.nameLabel')}</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t('contact.namePlaceholder')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isSending}
                  required
                  maxLength={100}
                />
              </div>
              <div className="field">
                <label htmlFor="contact-email">{t('contact.emailLabel')}</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isSending}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="contact-message">{t('contact.messageLabel')}</label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder={t('contact.messagePlaceholder')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                disabled={isSending}
                required
                minLength={10}
                maxLength={2000}
              />
            </div>

            {/* ── Client-side validation error ── */}
            {clientError && (
              <p className="contact-form-feedback contact-form-feedback--error" role="alert">
                <AlertCircle size={15} />
                {clientError}
              </p>
            )}

            {/* ── Submit button ── */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSending}
              aria-busy={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 size={16} className="spin" />
                  {t('contact.sending')}
                </>
              ) : (
                <>
                  {t('contact.sendBtn')} <Send size={16} />
                </>
              )}
            </button>

            {/* ── Status feedback messages ── */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.p
                  className="contact-form-feedback contact-form-feedback--success"
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <CheckCircle size={15} />
                  {t('contact.successMsg')}
                </motion.p>
              )}

              {status === 'error' && (
                <motion.p
                  className="contact-form-feedback contact-form-feedback--error"
                  role="alert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AlertCircle size={15} />
                  {t('contact.errorMsg')}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}