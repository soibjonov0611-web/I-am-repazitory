import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { contactChannels, profile } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { TelegramIcon } from '../lib/brandIcons';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion';

const initialForm = { name: '', email: '', message: '' };

const isValidEmail = (email) => /^[^s@]+@[^s@]+.[^s@]+$/.test(email);

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [clientError, setClientError] = useState('');
  const [copied, setCopied] = useState(false);

  function validate() {
    if (!form.name.trim() || form.name.trim().length > 100) {
      return (t('contact.nameLabel') || 'Name') + ' is required (max 100 chars).';
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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

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
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          website: honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm(initialForm);
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      // Honest failure handling: show error and offer direct channels
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
          <motion.div variants={fadeUp(1)} className="contact-heading-wrap">
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h2>
              {t('contact.titleStart')}{' '}
              <span className="gradient-text">{t('contact.titleEnd')}</span>
            </h2>
            <p className="contact-subtext">{t('contact.subtext')}</p>
          </motion.div>

          {/* Quick Contact Chips & Copy Email */}
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
                  className={`contact-chip ${channel.primary ? 'contact-chip-primary' : ''}`}
                  key={channel.name}
                  href={channel.url}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                  aria-label={`${channel.name} — ${channel.handle}`}
                  variants={fadeUp()}
                >
                  <Icon size={17} />
                  <span className="channel-name">{channel.name}</span>
                  <span className="channel-handle">{channel.handle}</span>
                </motion.a>
              );
            })}

            {/* Quick Copy Email Button */}
            <motion.button
              type="button"
              className="contact-chip contact-copy-btn"
              onClick={handleCopyEmail}
              aria-label={t('contact.copyEmail')}
              variants={fadeUp()}
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              <span>{copied ? t('contact.copied') : t('contact.copyEmail')}</span>
            </motion.button>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            variants={fadeUp(2)}
            noValidate
          >
            {/* Honeypot field (hidden from real users, bots fill it) */}
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

            {/* Client-side validation feedback */}
            {clientError && (
              <p className="contact-form-feedback contact-form-feedback--error" role="alert">
                <AlertCircle size={15} />
                {clientError}
              </p>
            )}

            {/* Submit button */}
            <div className="contact-actions-row">
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

              <div className="contact-direct-links">
                <span className="direct-links-label">{t('contact.orDirectly')}</span>
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="direct-link-tag telegram"
                >
                  <TelegramIcon size={14} /> Telegram
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="direct-link-tag mail"
                >
                  Email
                </a>
              </div>
            </div>

            {/* Feedback messages */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.p
                  className="contact-form-feedback contact-form-feedback--success"
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <CheckCircle size={16} />
                  {t('contact.successMsg')}
                </motion.p>
              )}

              {status === 'error' && (
                <motion.div
                  className="contact-form-feedback contact-form-feedback--error contact-error-box"
                  role="alert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} />
                    <span>{t('contact.errorMsg')}</span>
                  </div>
                  <div className="contact-fallback-actions">
                    <a
                      href={profile.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                    >
                      <TelegramIcon size={14} /> {t('contact.chatTelegram')}
                    </a>
                    <a
                      href={`mailto:${profile.email}?subject=Portfolio%20Inquiry&body=Hello%20${encodeURIComponent(profile.name)},`}
                      className="btn btn-ghost btn-sm"
                    >
                      {t('contact.chatGmail')}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
