import { Priority, Identity, isPriorityValid } from '../types/priority';
import { COLORS, FONT_FAMILY } from './graphicStyles';

interface Props {
  name: string;
  priorities: Priority[];
  identity: Identity;
}

export function PhoneWallpaperTemplate({ name, priorities, identity }: Props) {
  const validPriorities = priorities.filter(isPriorityValid).slice(0, 5);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: COLORS.darkBg,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top spacer for phone clock area */}
      <div style={{ height: 280, flexShrink: 0 }} />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div
          style={{
            fontSize: 18,
            color: COLORS.darkMuted,
            letterSpacing: 6,
            textTransform: 'uppercase' as const,
            marginBottom: 12,
          }}
        >
          {name}&apos;s
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: COLORS.darkText,
            letterSpacing: 4,
            textTransform: 'uppercase' as const,
          }}
        >
          2026 Priorities
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 120,
          height: 2,
          background: COLORS.darkDivider,
          margin: '32px auto 48px',
        }}
      />

      {/* Priorities */}
      <div style={{ flex: 1 }}>
        {validPriorities.map((priority, index) => (
          <div
            key={priority.id}
            style={{
              marginBottom: 40,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
            }}
          >
            {/* Number circle */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: 'rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
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
                  fontSize: 30,
                  fontWeight: 600,
                  color: COLORS.darkText,
                  lineHeight: 1.3,
                }}
              >
                {priority.name}
              </div>
              {priority.why && (
                <div
                  style={{
                    fontSize: 20,
                    color: COLORS.darkMuted,
                    fontStyle: 'italic',
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  &quot;{priority.why}&quot;
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Identity statement */}
      {identity.iAmSomeoneWho && (
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              width: 80,
              height: 1,
              background: COLORS.darkDivider,
              margin: '0 auto 24px',
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255, 255, 255, 0.7)',
              fontStyle: 'italic',
              textAlign: 'center',
              lineHeight: 1.5,
              padding: '0 20px',
            }}
          >
            &quot;{identity.iAmSomeoneWho}&quot;
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: 60,
          fontSize: 16,
          color: COLORS.darkSubtle,
          letterSpacing: 2,
        }}
      >
        Man of Wisdom
      </div>
    </div>
  );
}
