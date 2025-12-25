import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { QuickModeData, DeepModeData, DeepModeCategory } from '../types';

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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4F46E5',
    borderBottom: '2px solid #E5E7EB',
    paddingBottom: 4,
  },
  goal: {
    fontSize: 12,
    marginBottom: 8,
    color: '#374151',
    lineHeight: 1.6,
  },
  goalNumber: {
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  habitBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    border: '1px solid #E5E7EB',
  },
  habitTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1F2937',
  },
  habitText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  themeBox: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 4,
    textAlign: 'center',
    marginTop: 8,
  },
  themeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4338CA',
    fontStyle: 'italic',
  },
  lifeBalanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  lifeBalanceColumn: {
    width: '30%',
  },
  lifeBalanceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1F2937',
  },
  lifeBalanceItem: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  categorySection: {
    marginBottom: 20,
    border: '1px solid #E5E7EB',
    borderRadius: 4,
    padding: 12,
  },
  categoryHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryItemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  categoryItemText: {
    fontSize: 10,
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
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
  },
});

interface GoalsPDFProps {
  name: string;
  mode: 'quick' | 'deep';
  quickModeData?: QuickModeData;
  deepModeData?: DeepModeData;
}

export const GoalsPDF = ({ name, mode, quickModeData, deepModeData }: GoalsPDFProps) => {
  const data = mode === 'quick' ? quickModeData : deepModeData;
  const placesArray = data?.placesToVisit?.split('\n').filter(p => p.trim()) || [];
  const booksArray = data?.booksToRead?.split('\n').filter(b => b.trim()) || [];
  const experiencesArray = data?.experiencesToHave?.split('\n').filter(e => e.trim()) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MY 2026 BLUEPRINT</Text>
          <Text style={styles.subtitle}>{name}&apos;s Goals for 2026</Text>
          <Text style={styles.subtitle}>Mode: {mode === 'quick' ? 'Quick Setup' : 'Deep Planning'}</Text>
        </View>

        {mode === 'quick' && quickModeData ? (
          // Quick Mode Content
          <>
            {/* Top 3 Goals */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 TOP 3 GOALS</Text>
              {quickModeData.topGoals?.map((goal, i) => (
                <Text key={i} style={styles.goal}>
                  <Text style={styles.goalNumber}>{i + 1}. </Text>
                  {goal}
                </Text>
              ))}
            </View>

            {/* Habits */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✅ HABITS</Text>
              <View style={styles.habitBox}>
                <Text style={styles.habitTitle}>Habit to Build:</Text>
                <Text style={styles.habitText}>{quickModeData.habitToBuild}</Text>
              </View>
              <View style={styles.habitBox}>
                <Text style={styles.habitTitle}>Habit to Break:</Text>
                <Text style={styles.habitText}>{quickModeData.habitToBreak}</Text>
              </View>
            </View>

            {/* Theme */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 MY THEME FOR 2026</Text>
              <View style={styles.themeBox}>
                <Text style={styles.themeText}>&quot;{quickModeData.mainTheme}&quot;</Text>
              </View>
            </View>
          </>
        ) : deepModeData ? (
          // Deep Mode Content
          <>
            {[
              { id: 'health', name: 'Health & Fitness', icon: '💪' },
              { id: 'career', name: 'Career & Work', icon: '💼' },
              { id: 'wealth', name: 'Wealth & Finance', icon: '💰' },
              { id: 'relationships', name: 'Relationships & Family', icon: '❤️' },
              { id: 'growth', name: 'Personal Growth & Learning', icon: '📚' },
              { id: 'impact', name: 'Contribution & Impact', icon: '🌟' },
            ].map((category) => {
              const categoryData = deepModeData[category.id as keyof typeof deepModeData] as DeepModeCategory | undefined;
              if (!categoryData?.goal) return null;

              return (
                <View key={category.id} style={styles.categorySection}>
                  <Text style={styles.categoryHeader}>
                    {category.icon} {category.name}
                  </Text>

                  <View style={styles.categoryItem}>
                    <Text style={styles.categoryItemTitle}>Goal:</Text>
                    <Text style={styles.categoryItemText}>{categoryData.goal}</Text>
                  </View>

                  <View style={styles.categoryItem}>
                    <Text style={styles.categoryItemTitle}>Habits to Build:</Text>
                    <Text style={styles.categoryItemText}>{categoryData.habitsBuild}</Text>
                  </View>

                  <View style={styles.categoryItem}>
                    <Text style={styles.categoryItemTitle}>Habits to Break:</Text>
                    <Text style={styles.categoryItemText}>{categoryData.habitsBreak}</Text>
                  </View>

                  <View style={styles.categoryItem}>
                    <Text style={styles.categoryItemTitle}>Why This Matters:</Text>
                    <Text style={styles.categoryItemText}>{categoryData.why}</Text>
                  </View>
                </View>
              );
            })}
          </>
        ) : null}

        {/* Life Balance */}
        {(placesArray.length > 0 || booksArray.length > 0 || experiencesArray.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ LIFE BALANCE & FUN</Text>
            <View style={styles.lifeBalanceGrid}>
              {placesArray.length > 0 && (
                <View style={styles.lifeBalanceColumn}>
                  <Text style={styles.lifeBalanceTitle}>🌍 Places to Visit</Text>
                  {placesArray.slice(0, 5).map((place, i) => (
                    <Text key={i} style={styles.lifeBalanceItem}>• {place}</Text>
                  ))}
                </View>
              )}

              {booksArray.length > 0 && (
                <View style={styles.lifeBalanceColumn}>
                  <Text style={styles.lifeBalanceTitle}>📚 Books to Read</Text>
                  {booksArray.slice(0, 5).map((book, i) => (
                    <Text key={i} style={styles.lifeBalanceItem}>• {book}</Text>
                  ))}
                </View>
              )}

              {experiencesArray.length > 0 && (
                <View style={styles.lifeBalanceColumn}>
                  <Text style={styles.lifeBalanceTitle}>✨ Experiences</Text>
                  {experiencesArray.slice(0, 5).map((exp, i) => (
                    <Text key={i} style={styles.lifeBalanceItem}>• {exp}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Created with Man of Wisdom Goal Setter • manofwisdom.co</Text>
          <Text>Track your goals with the Man of Wisdom Journal starting January 1, 2026</Text>
        </View>
      </Page>
    </Document>
  );
};
