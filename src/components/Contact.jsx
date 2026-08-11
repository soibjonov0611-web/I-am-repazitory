import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { contactChannels, profile } from '../data/portfolio';
import { useLanguage } from '../i18n/useLanguage';
import { getIcon } from '../lib/icons';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion';

const initialForm = { name: '', email: '', message: '' };

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

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

          <motion.form className="contact-form" onSubmit={handleSubmit} variants={fadeUp(2)}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="contact-name">{t('contact.nameLabel')}</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t('contact.namePlaceholder')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
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
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {t('contact.sendBtn')} <Send size={16} />
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}