import type { FutureProfile } from '../lib/types';

interface PdfTemplateProps {
  profile: FutureProfile;
}

export default function PdfTemplate({ profile }: PdfTemplateProps) {
  const futureYear = new Date().getFullYear() + 15;

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
    pageBreakInside: 'avoid',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#00d4ff',
    marginBottom: '10px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
    fontFamily: "'Courier New', monospace",
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: '1.7',
    color: '#c8d0e0',
    whiteSpace: 'pre-line' as const,
  };

  const timelineItemStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '10px',
  };

  const yearBadgeStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 700,
    color: '#00d4ff',
    fontFamily: "'Courier New', monospace",
    minWidth: '44px',
    flexShrink: 0,
  };

  const scoreContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '32px',
    justifyContent: 'center',
    marginBottom: '8px',
  };

  const scoreBoxStyle: React.CSSProperties = {
    textAlign: 'center' as const,
  };

  const scoreNumStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
  };

  const scoreLabelStyle: React.CSSProperties = {
    fontSize: '9px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#7a8599',
    marginTop: '4px',
  };

  return (
    <div
      id="pdf-content"
      style={{
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        padding: '40px 36px',
        backgroundColor: '#0a0e1a',
        color: '#c8d0e0',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' as const, marginBottom: '36px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#00d4ff', marginBottom: '12px', fontFamily: "'Courier New', monospace" }}>
          YEAR {futureYear}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          {profile.name}
        </h1>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#00d4ff', fontFamily: "'Courier New', monospace" }}>
          {profile.future_title}
        </div>
        <div style={{ marginTop: '16px', fontSize: '10px', letterSpacing: '0.15em', color: '#4a5568', fontFamily: "'Courier New', monospace" }}>
          FUTURE ME AI
        </div>
      </div>

      {/* Future Quote */}
      {profile.future_quote && (
        <div style={{ ...sectionStyle, textAlign: 'center' as const }}>
          <div style={{ padding: '16px 20px', backgroundColor: 'rgba(0,212,255,0.04)', borderRadius: '8px', border: '1px solid rgba(0,212,255,0.08)' }}>
            <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#a0aec0', lineHeight: '1.6' }}>{profile.future_quote}</p>
          </div>
        </div>
      )}

      {/* Scores */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Future Scores</div>
        <div style={scoreContainerStyle}>
          <div style={scoreBoxStyle}>
            <div style={{ ...scoreNumStyle, color: '#00d4ff' }}>{profile.ai_score}</div>
            <div style={scoreLabelStyle}>AI Future Score</div>
          </div>
          <div style={scoreBoxStyle}>
            <div style={{ ...scoreNumStyle, color: '#00f5d4' }}>{profile.success_meter}</div>
            <div style={scoreLabelStyle}>Success Meter</div>
          </div>
        </div>
      </div>

      {/* Future Story */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Your Future Story</div>
        <p style={bodyStyle}>{profile.future_story}</p>
      </div>

      {/* Personality Evolution */}
      {profile.personality_evolution && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Personality Evolution</div>
          <p style={bodyStyle}>{profile.personality_evolution}</p>
        </div>
      )}

      {/* Achievement Timeline */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Achievement Timeline</div>
        {profile.achievements.map((item, i) => (
          <div key={i} style={timelineItemStyle}>
            <div style={{
              ...yearBadgeStyle,
              paddingTop: '2px',
            }}>{item.year}</div>
            <div style={{
              fontSize: '12px',
              lineHeight: '1.5',
              color: '#c8d0e0',
              borderLeft: '2px solid rgba(0,212,255,0.2)',
              paddingLeft: '12px',
            }}>{item.event}</div>
          </div>
        ))}
      </div>

      {/* Income */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Income & Success Prediction</div>
        <p style={bodyStyle}>{profile.future_income}</p>
      </div>

      {/* Glow-Up */}
      {profile.glow_up && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Glow-Up Evolution</div>
          <p style={bodyStyle}>{profile.glow_up}</p>
        </div>
      )}

      {/* Daily Routine */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Future Daily Routine</div>
        {profile.future_routine.split('\n').map((line, i) => (
          <div key={i} style={{
            fontSize: '12px',
            lineHeight: '1.7',
            color: '#c8d0e0',
            paddingLeft: '14px',
            position: 'relative' as const,
            marginBottom: '2px',
          }}>
            <span style={{
              position: 'absolute' as const,
              left: '0',
              top: '8px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,212,255,0.4)',
            }} />
            {line}
          </div>
        ))}
      </div>

      {/* Workspace Vibe */}
      {profile.workspace_vibe && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Future Workspace Vibe</div>
          <p style={bodyStyle}>{profile.workspace_vibe}</p>
        </div>
      )}

      {/* Hidden Talent */}
      {profile.hidden_talent && (
        <div style={{
          ...sectionStyle,
          padding: '16px 20px',
          backgroundColor: 'rgba(0,212,255,0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(0,212,255,0.1)',
        }}>
          <div style={sectionTitleStyle}>Hidden Talent Prediction</div>
          <p style={bodyStyle}>{profile.hidden_talent}</p>
        </div>
      )}

      {/* Message from Future Self */}
      <div style={{
        ...sectionStyle,
        padding: '20px 24px',
        backgroundColor: 'rgba(0,245,212,0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(0,245,212,0.12)',
      }}>
        <div style={{ ...sectionTitleStyle, color: '#00f5d4', borderBottomColor: 'rgba(0,245,212,0.15)' }}>
          Message from Your Future Self
        </div>
        <p style={{ ...bodyStyle, fontStyle: 'italic', color: '#e2e8f0' }}>
          {profile.future_advice}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center' as const,
        marginTop: '32px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#4a5568', fontFamily: "'Courier New', monospace" }}>
          FUTURE ME AI — YOUR FUTURE IS WAITING
        </div>
      </div>
    </div>
  );
}
