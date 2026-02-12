import { Priority, Identity, isPriorityValid, isGoalValid } from '../types/priority';
import { COLORS, FONT_FAMILY } from './graphicStyles';

// Helper for backward compat: handle both string and string[] identity fields
function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) return [val];
  return [];
}

interface Props {
  name: string;
  priorities: Priority[];
  identity: Identity;
}

export function DesktopWallpaperTemplate({ name, priorities, identity }: Props) {
  const validPriorities = priorities.filter(isPriorityValid).slice(0, 5);
  const habitsBuild = toArray(identity.habitsToBuild).slice(0, 4);
  const habitsBreak = toArray(identity.habitsToEliminate).slice(0, 4);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: COLORS.darkRadialBg,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 120px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div
          style={{
            fontSize: 14,
            color: COLORS.darkMuted,
            letterSpacing: 6,
            textTransform: 'uppercase' as const,
            marginBottom: 8,
          }}
        >
          {name}&apos;s
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.darkText,
            letterSpacing: 3,
            textTransform: 'uppercase' as const,
          }}
        >
          2026 Blueprint
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 100,
          height: 2,
          background: COLORS.darkDivider,
          margin: '20px 0 32px',
        }}
      />

      {/* Two-column layout */}
      <div
        style={{
          display: 'flex',
          gap: 80,
          flex: 1,
          width: '100%',
          maxWidth: 1500,
        }}
      >
        {/* Left column: Priorities + Goals */}
        <div style={{ flex: 1 }}>
          {validPriorities.map((priority, index) => (
            <div
              key={priority.id}
              style={{
                marginBottom: 28,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: 'rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.darkMuted,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: COLORS.darkText,
                    lineHeight: 1.3,
                  }}
                >
                  {priority.name}
                </div>
                {/* Up to 2 goals */}
                {priority.goals
                  .filter(isGoalValid)
                  .slice(0, 2)
                  .map((goal) => (
                    <div
                      key={goal.id}
                      style={{
                        fontSize: 16,
                        color: '#C7D2FE',
                        marginTop: 4,
                        lineHeight: 1.4,
                      }}
                    >
                      {goal.what}
                      {goal.byWhen && (
                        <span style={{ color: COLORS.darkSubtle }}> — {goal.byWhen}</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right column: Identity + Habits */}
        <div style={{ flex: 1 }}>
          {/* Identity statement */}
          {identity.iAmSomeoneWho && (
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  fontSize: 13,
                  color: COLORS.darkMuted,
                  letterSpacing: 3,
                  textTransform: 'uppercase' as const,
                  marginBottom: 10,
                }}
              >
                I Am Someone Who...
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                }}
              >
                &quot;{identity.iAmSomeoneWho}&quot;
              </div>
            </div>
          )}

          {/* Habits to build */}
          {habitsBuild.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  color: '#6EE7B7',
                  letterSpacing: 2,
                  textTransform: 'uppercase' as const,
                  marginBottom: 10,
                }}
              >
                Habits to Build
              </div>
              {habitsBuild.map((habit, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 17,
                    color: '#A7F3D0',
                    lineHeight: 1.6,
                    paddingLeft: 16,
                  }}
                >
                  + {habit}
                </div>
              ))}
            </div>
          )}

          {/* Habits to eliminate */}
          {habitsBreak.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  color: '#FCA5A5',
                  letterSpacing: 2,
                  textTransform: 'uppercase' as const,
                  marginBottom: 10,
                }}
              >
                Habits to Eliminate
              </div>
              {habitsBreak.map((habit, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 17,
                    color: '#FECACA',
                    lineHeight: 1.6,
                    paddingLeft: 16,
                  }}
                >
                  - {habit}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.25)',
          letterSpacing: 2,
        }}
      >
        Man of Wisdom &middot; manofwisdom.co
      </div>
    </div>
  );
}
