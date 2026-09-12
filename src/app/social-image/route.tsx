import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '64px 76px', background: '#f5f4ff', color: '#24204c', fontFamily: 'sans-serif', borderBottom: '16px solid #6554c0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', fontSize: 42, fontWeight: 700 }}>inYice<span style={{ color: '#6554c0' }}>.</span></div>
        <div style={{ display: 'flex', fontSize: 21, color: '#6554c0' }}>YOUR WORKSPACE, EXPLAINED</div>
      </div>
      <div style={{ display: 'flex', marginTop: 58, fontSize: 88, fontWeight: 700, letterSpacing: -4 }}>Help Center</div>
      <div style={{ display: 'flex', marginTop: 18, fontSize: 32, color: '#625d7d' }}>Clarity for every step of your journey.</div>
      <div style={{ display: 'flex', gap: 14, marginTop: 38 }}>
        {['Orders & vouchers', 'Invoices & payments', 'Reports & more'].map(label => <div key={label} style={{ display: 'flex', padding: '12px 19px', background: '#e7e3fb', borderRadius: 12, color: '#51429b', fontSize: 22 }}>{label}</div>)}
      </div>
      <div style={{ display: 'flex', marginTop: 'auto', fontSize: 24, color: '#6554c0' }}>help.inyice.com</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
