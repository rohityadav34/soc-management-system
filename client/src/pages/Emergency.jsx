import React, { useState } from 'react';
import { Button, Card } from '../components/ui';
import { AlertOctagon, PhoneCall, ShieldAlert, HeartPulse, Flame, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Emergency() {
  const [panicActive, setPanicActive] = useState(false);

  const handleTriggerPanic = () => {
    setPanicActive(true);
    toast.error('🚨 PANIC ALERT TRIGGERED! Security gate and admins have been notified.', {
      duration: 10000,
      style: {
        border: '2px solid #ef4444',
        padding: '24px',
        color: '#7f1d1d',
        fontWeight: 'bold',
        fontSize: '1.1rem',
      }
    });

    // Mock auto-dismiss after 8 seconds
    setTimeout(() => {
      setPanicActive(false);
      toast.success('Panic alert resolved.');
    }, 8000);
  };

  const contacts = [
    { title: 'Security Guard Gate', icon: ShieldAlert, phone: '+91 98765 43210', desc: 'Main entry gate security guards' },
    { title: 'Local Police Station', icon: AlertOctagon, phone: '100 / +91 731 243 0100', desc: 'Nearest Police Control Room' },
    { title: 'Ambulance & Medical', icon: HeartPulse, phone: '108 / +91 731 252 7300', desc: 'Apex Hospital Emergency Line' },
    { title: 'Fire Station', icon: Flame, phone: '101 / +91 731 245 0101', desc: 'Fire Brigade control desk' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="text-rose-600 animate-pulse" size={24} />
          Emergency Support & Panic Center
        </h1>
        <p className="text-slate-500 text-sm">Instant distress panic alert trigger and local emergency contacts.</p>
      </div>

      {/* Panic Button Area */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
        <div className="space-y-2 max-w-md">
          <h3 className="font-bold text-red-950 text-xl">Do you need immediate assistance?</h3>
          <p className="text-red-700 text-sm leading-relaxed">
            Pressing the button below triggers an immediate loud audio alarm on the security guard terminal and emails/notifies society management administrators.
          </p>
        </div>

        <button
          onClick={handleTriggerPanic}
          className={`h-40 w-40 rounded-full flex flex-col items-center justify-center gap-2 border-8 shadow-2xl transition-all cursor-pointer select-none active:scale-95 ${
            panicActive 
              ? 'bg-rose-600 border-rose-300 animate-ping text-white' 
              : 'bg-red-600 hover:bg-red-700 border-red-200 hover:border-red-300 text-white shadow-red-500/25 hover:shadow-red-500/40'
          }`}
        >
          <ShieldAlert size={48} className={panicActive ? 'animate-bounce' : ''} />
          <span className="font-bold tracking-widest text-xs uppercase">
            {panicActive ? 'ALARM ON' : 'TRIGGER PANIC'}
          </span>
        </button>

        {panicActive && (
          <span className="text-rose-700 font-bold text-sm animate-pulse">
            🚨 Broad-casting panic signal now...
          </span>
        )}
      </div>

      {/* Quick Contacts */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">Emergency Contact Directory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-start gap-4 hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <Icon size={24} />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-800 text-base">{contact.title}</h4>
                  <p className="text-slate-400 text-xs">{contact.desc}</p>
                  <a 
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold text-sm pt-1"
                  >
                    <PhoneCall size={14} />
                    {contact.phone}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Emergency;
