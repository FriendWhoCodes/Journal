import { Priority, Identity, isPriorityValid, isGoalValid } from '../types/priority';
import { COLORS, FONT_FAMILY } from './graphicStyles';

// Helper for backward compat
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

export function InfographicTemplate({ name, priorities, identity }: Props) {
  const validPriorities = priorities.filter(isPriorityValid);
  const displayPriorities = validPriorities.slice(0, 7);
  const remainingCount = validPriorities.length - displayPriorities.length;
  const totalGoals = validPriorities.reduce(
    (sum, p) => sum + p.goals.filter(isGoalValid).length,
    0,
  );
  const habitsBuild = toArray(identity.habitsToBuild).slice(0, 5);
  const habitsBreak = toArray(identity.habitsToEliminate).slice(0, 5);

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        background: COLORS.lightBg,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Header with gradient */}
      <div
        style={{
          background: COLORS.lightHeaderBg,
          padding: '40px 60px 36px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: 3,
            textTransform: 'uppercase' as const,
            marginBottom: 8,
          }}
        >
          My 2026 Blueprint
        </div>
        <div
          style={{
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: 6,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 15,
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {validPriorities.length} Priorities &bull; {totalGoals} Goals
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, padding: '24px 60px 20px', overflow: 'hidden' }}>
        {/* Identity statement */}
        {identity.iAmSomeoneWho && (
          <div
            style={{
              background: COLORS.lightAccentBg,
              padding: '16px 20px',
              borderRadius: 8,
              marginBottom: 20,
              borderLeft: `4px solid ${COLORS.lightAccent}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.lightAccent,
                letterSpacing: 2,
                textTransform: 'uppercase' as const,
                marginBottom: 6,
              }}
            >
              I Am Someone Who...
            </div>
            <div
              style={{
                fontSize: 16,
                color: COLORS.lightText,
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              &quot;{identity.iAmSomeoneWho}&quot;
            </div>
          </div>
        )}

        {/* Section title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: COLORS.lightAccent,
            borderBottom: `2px solid ${COLORS.lightDivider}`,
            paddingBottom: 6,
            marginBottom: 16,
            letterSpacing: 1,
            textTransform: 'uppercase' as const,
          }}
        >
          Priorities & Goals
        </div>

        {/* Priorities list */}
        {displayPriorities.map((priority, index) => {
          const validGoals = priority.goals.filter(isGoalValid).slice(0, 3);
          return (
            <div
              key={priority.id}
              style={{
                marginBottom: 14,
                paddingLeft: 14,
                borderLeft: `3px solid ${COLORS.lightAccent}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: COLORS.lightAccent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.white,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.lightText }}>
                  {priority.name}
                </div>
              </div>
              {validGoals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    fontSize: 14,
                    color: COLORS.lightMuted,
                    marginLeft: 36,
                    lineHeight: 1.5,
                  }}
                >
                  {goal.what}
                  {goal.byWhen && (
                    <span style={{ color: '#9CA3AF' }}> — {goal.byWhen}</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div
            style={{
              fontSize: 14,
              color: COLORS.lightMuted,
              fontStyle: 'italic',
              marginLeft: 14,
              marginBottom: 16,
            }}
          >
            +{remainingCount} more priorit{remainingCount === 1 ? 'y' : 'ies'}
          </div>
        )}

        {/* Habits section */}
        {(habitsBuild.length > 0 || habitsBreak.length > 0) && (
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.lightAccent,
                borderBottom: `2px solid ${COLORS.lightDivider}`,
                paddingBottom: 6,
                marginBottom: 12,
                letterSpacing: 1,
                textTransform: 'uppercase' as const,
              }}
            >
              Identity Habits
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {habitsBuild.length > 0 && (
                <div
                  style={{
                    flex: 1,
                    background: COLORS.greenBg,
                    borderRadius: 8,
                    padding: '12px 16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORS.greenText,
                      marginBottom: 8,
                      textTransform: 'uppercase' as const,
                      letterSpacing: 1,
                    }}
                  >
                    Build
                  </div>
                  {habitsBuild.map((h, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#065F46', lineHeight: 1.6 }}>
                      + {h}
                    </div>
                  ))}
                </div>
              )}
              {habitsBreak.length > 0 && (
                <div
                  style={{
                    flex: 1,
                    background: COLORS.redBg,
                    borderRadius: 8,
                    padding: '12px 16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORS.redText,
                      marginBottom: 8,
                      textTransform: 'uppercase' as const,
                      letterSpacing: 1,
                    }}
                  >
                    Eliminate
                  </div>
                  {habitsBreak.map((h, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.6 }}>
                      - {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px 60px',
          borderTop: `1px solid ${COLORS.lightDivider}`,
          fontSize: 13,
          color: '#9CA3AF',
        }}
      >
        Created with Man of Wisdom &middot; manofwisdom.co
      </div>
    </div>
  );
}
