import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PriorityModeData, isPriorityValid, isGoalValid } from '../types/priority';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4F46E5',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  priorityCard: {
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
    paddingLeft: 12,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#4F46E5',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 8,
  },
  priorityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  priorityWhy: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 8,
    marginLeft: 32,
  },
  goalCard: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    marginLeft: 32,
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  goalDetail: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  goalDetailLabel: {
    fontWeight: 'bold',
    color: '#4B5563',
  },
  milestoneRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  milestoneBadge: {
    fontSize: 8,
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    marginRight: 4,
  },
  identitySection: {
    marginBottom: 24,
  },
  identityStatement: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  identityStatementLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 6,
  },
  identityStatementText: {
    fontSize: 12,
    color: '#1F2937',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  identityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  identityBox: {
    width: '48%',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  identityBoxGreen: {
    backgroundColor: '#ECFDF5',
  },
  identityBoxRed: {
    backgroundColor: '#FEF2F2',
  },
  identityBoxBlue: {
    backgroundColor: '#EFF6FF',
  },
  identityBoxPurple: {
    backgroundColor: '#F5F3FF',
  },
  identityBoxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  identityBoxTitleGreen: {
    color: '#059669',
  },
  identityBoxTitleRed: {
    color: '#DC2626',
  },
  identityBoxTitleBlue: {
    color: '#2563EB',
  },
  identityBoxTitlePurple: {
    color: '#7C3AED',
  },
  identityBoxText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#9CA3AF',
  },
});

// Helper for backward compat: handle both string and string[] identity fields
function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) return [val];
  return [];
}

interface PriorityPDFProps {
  name: string;
  data: PriorityModeData;
}

export const PriorityPDF = ({ name, data }: PriorityPDFProps) => {
  const validPriorities = data.priorities.filter(isPriorityValid);

  return (
    <Document>
      {/* Page 1: Overview & Priorities */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MY 2026 BLUEPRINT</Text>
          <Text style={styles.subtitle}>{name} - Priority Mode</Text>
          <Text style={styles.subtitle}>
            {validPriorities.length} Priorities •{' '}
            {validPriorities.reduce((sum, p) => sum + p.goals.filter(isGoalValid).length, 0)} Goals
          </Text>
        </View>

        {/* Identity Statement (if exists) */}
        {data.identity.iAmSomeoneWho && (
          <View style={styles.identityStatement}>
            <Text style={styles.identityStatementLabel}>I AM SOMEONE WHO...</Text>
            <Text style={styles.identityStatementText}>
              &quot;{data.identity.iAmSomeoneWho}&quot;
            </Text>
          </View>
        )}

        {/* Priorities Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY PRIORITIES FOR 2026</Text>
          {validPriorities.slice(0, 5).map((priority, index) => (
            <View key={priority.id} style={styles.priorityCard}>
              <View style={styles.priorityHeader}>
                <Text style={styles.priorityNumber}>{index + 1}</Text>
                <Text style={styles.priorityName}>{priority.name}</Text>
              </View>
              {priority.why && (
                <Text style={styles.priorityWhy}>&quot;{priority.why}&quot;</Text>
              )}
              {/* Goals for this priority */}
              {priority.goals.filter(isGoalValid).slice(0, 3).map((goal) => (
                <View key={goal.id} style={styles.goalCard}>
                  <Text style={styles.goalTitle}>{goal.what}</Text>
                  {goal.byWhen && (
                    <Text style={styles.goalDetail}>
                      <Text style={styles.goalDetailLabel}>Target: </Text>
                      {goal.byWhen}
                    </Text>
                  )}
                  {goal.successLooksLike && (
                    <Text style={styles.goalDetail}>
                      <Text style={styles.goalDetailLabel}>Success: </Text>
                      {goal.successLooksLike}
                    </Text>
                  )}
                  {goal.milestones.length > 0 && (
                    <View style={styles.milestoneRow}>
                      {goal.milestones.map((m) => (
                        <Text key={m.id} style={styles.milestoneBadge}>
                          {m.period}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Created with Man of Wisdom Goal Setter - Priority Mode</Text>
          <Text>manofwisdom.co</Text>
        </View>
      </Page>

      {/* Page 2: Identity Transformation (if has content) */}
      {(toArray(data.identity.habitsToBuild).length > 0 ||
        toArray(data.identity.habitsToEliminate).length > 0 ||
        toArray(data.identity.beliefsToHold).length > 0 ||
        data.identity.personWhoAchieves) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>IDENTITY TRANSFORMATION</Text>
            <Text style={styles.subtitle}>Who I need to become in 2026</Text>
          </View>

          <View style={styles.identityGrid}>
            {toArray(data.identity.habitsToBuild).length > 0 && (
              <View style={[styles.identityBox, styles.identityBoxGreen]}>
                <Text style={[styles.identityBoxTitle, styles.identityBoxTitleGreen]}>
                  HABITS TO BUILD
                </Text>
                {toArray(data.identity.habitsToBuild).map((item, i) => (
                  <Text key={i} style={styles.identityBoxText}>• {item}</Text>
                ))}
              </View>
            )}

            {toArray(data.identity.habitsToEliminate).length > 0 && (
              <View style={[styles.identityBox, styles.identityBoxRed]}>
                <Text style={[styles.identityBoxTitle, styles.identityBoxTitleRed]}>
                  HABITS TO ELIMINATE
                </Text>
                {toArray(data.identity.habitsToEliminate).map((item, i) => (
                  <Text key={i} style={styles.identityBoxText}>• {item}</Text>
                ))}
              </View>
            )}

            {toArray(data.identity.beliefsToHold).length > 0 && (
              <View style={[styles.identityBox, styles.identityBoxBlue]}>
                <Text style={[styles.identityBoxTitle, styles.identityBoxTitleBlue]}>
                  BELIEFS TO HOLD
                </Text>
                {toArray(data.identity.beliefsToHold).map((item, i) => (
                  <Text key={i} style={styles.identityBoxText}>• {item}</Text>
                ))}
              </View>
            )}

            {data.identity.personWhoAchieves && (
              <View style={[styles.identityBox, styles.identityBoxPurple]}>
                <Text style={[styles.identityBoxTitle, styles.identityBoxTitlePurple]}>
                  THE PERSON WHO ACHIEVES THIS
                </Text>
                <Text style={styles.identityBoxText}>{data.identity.personWhoAchieves}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Created with Man of Wisdom Goal Setter - Priority Mode</Text>
            <Text>manofwisdom.co</Text>
          </View>
        </Page>
      )}

      {/* Additional pages for priorities 6-10 if they exist */}
      {validPriorities.length > 5 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>ADDITIONAL PRIORITIES</Text>
          </View>

          <View style={styles.section}>
            {validPriorities.slice(5).map((priority, index) => (
              <View key={priority.id} style={styles.priorityCard}>
                <View style={styles.priorityHeader}>
                  <Text style={styles.priorityNumber}>{index + 6}</Text>
                  <Text style={styles.priorityName}>{priority.name}</Text>
                </View>
                {priority.why && (
                  <Text style={styles.priorityWhy}>&quot;{priority.why}&quot;</Text>
                )}
                {priority.goals.filter(isGoalValid).map((goal) => (
                  <View key={goal.id} style={styles.goalCard}>
                    <Text style={styles.goalTitle}>{goal.what}</Text>
                    {goal.byWhen && (
                      <Text style={styles.goalDetail}>
                        <Text style={styles.goalDetailLabel}>Target: </Text>
                        {goal.byWhen}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Created with Man of Wisdom Goal Setter - Priority Mode</Text>
            <Text>manofwisdom.co</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
