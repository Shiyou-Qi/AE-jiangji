'use client';

import { useState } from 'react';

import { ArrowRight } from './Icons';

const initial = {
  type: '',
  name: '',
  email: '',
  company: '',
  budget: '',
  message: '',
  website: '',
};

export default function ContactForm({ copy }) {
  const [form, setForm] = useState(() => ({ ...initial, type: copy.types[0] || '' }));
  const [status, setStatus] = useState('idle');
  const [notice, setNotice] = useState('');

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  async function onSubmit(event) {
    event.preventDefault();
    setNotice('');

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setNotice(copy.required);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) throw new Error(data.error || 'send failed');

      setForm({ ...initial, type: copy.types[0] || '' });
      setStatus('success');
      setNotice(copy.success);
    } catch {
      setStatus('error');
      setNotice(copy.error);
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <h2 className="h3">{copy.title}</h2>

      <label className="field contact-form__trap">
        <span className="field__l">Website</span>
        <input className="input" name="website" value={form.website} onChange={update('website')} tabIndex={-1} autoComplete="off" />
      </label>

      <div className="contact-grid">
        <label className="field">
          <span className="field__l">{copy.typeLabel}</span>
          <select className="select" value={form.type} onChange={update('type')}>
            {copy.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__l">{copy.nameLabel}</span>
          <input className="input" value={form.name} onChange={update('name')} autoComplete="name" required />
        </label>

        <label className="field">
          <span className="field__l">{copy.emailLabel}</span>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={update('email')}
            autoComplete="email"
            required
          />
        </label>

        <label className="field">
          <span className="field__l">{copy.companyLabel}</span>
          <input className="input" value={form.company} onChange={update('company')} autoComplete="organization" />
        </label>

        <label className="field contact-grid__wide">
          <span className="field__l">{copy.budgetLabel}</span>
          <input className="input" value={form.budget} onChange={update('budget')} />
        </label>

        <label className="field contact-grid__wide">
          <span className="field__l">{copy.messageLabel}</span>
          <textarea className="textarea" value={form.message} onChange={update('message')} rows={7} required />
          <span className="field__hint">{copy.messageHint}</span>
        </label>
      </div>

      {notice ? (
        <p className={`contact-notice contact-notice--${status === 'success' ? 'success' : 'error'}`} role="status">
          {notice}
        </p>
      ) : null}

      <button className="btn btn--primary btn--lg contact-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? copy.sending : copy.submit}
        <ArrowRight />
      </button>
    </form>
  );
}
