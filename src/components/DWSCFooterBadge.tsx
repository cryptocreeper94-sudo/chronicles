import { useRef } from "react";

export function DWSCFooterBadge() {
  const clickRef = useRef({ count: 0, timer: null as any });
  const handleClick = () => {
    clickRef.current.count++;
    if (clickRef.current.count === 3) {
      clickRef.current.count = 0;
      clearTimeout(clickRef.current.timer);
      window.open('https://dwsc.io/#portal', '_blank');
    } else {
      clearTimeout(clickRef.current.timer);
      clickRef.current.timer = setTimeout(() => { clickRef.current.count = 0; }, 800);
    }
  };

  return (
    <footer style={{
      width: '100%',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(0,0,0,0.3)',
    }}>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
        © 2026 DarkWave Studios, LLC
      </span>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>·</span>
      <a
        href="https://dwtl.io"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
      >
        Trust Layer
      </a>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>·</span>
      <span
        onClick={handleClick}
        style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', cursor: 'default', userSelect: 'none' }}
        title="◈ DWSC"
      >
        ◈
      </span>
    </footer>
  );
}
