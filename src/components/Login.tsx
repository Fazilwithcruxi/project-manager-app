import { useState } from "react";
import { Layers, Mail, Lock, ArrowRight } from "lucide-react";

interface Props {
  onLogin: () => void;
}

export function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate a quick network request layout to make it feel premium
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', 
        background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%', width: '300px', height: '300px', 
        background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%'
      }}></div>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Layers color="var(--primary)" size={40} style={{ filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))' }} />
            <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Zenith</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', textAlign: 'center' }}>
            Enter your credentials to access your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '15px',
                  transition: 'border 0.2s', outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
              />
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '15px',
                  transition: 'border 0.2s', outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !email || !password}
            style={{
              padding: '14px', background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)', 
              color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '16px',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              marginTop: '12px', opacity: loading || !email || !password ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'transform 0.1s, box-shadow 0.2s',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
            }}
            onMouseDown={(e) => { if (!loading && email && password) e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Request Access</span>
        </div>
      </div>
    </div>
  );
}
