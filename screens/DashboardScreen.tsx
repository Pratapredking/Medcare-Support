import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, PALETTE, PageHeader } from '@/components/medical-support-ui';
import { useMedicalSupport } from '@/context/medical-support';
import type { MedicalSupportStackParamList } from '@/screens/navigation-types';

function SummaryCard({ icon, count, label }: { icon: string; count: number; label: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MedicalSupportStackParamList>>();
  const { reports, devices } = useMedicalSupport();
  const accepted = reports.filter((report) => report.status === 'Accepted').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <PageHeader title="MediCare Support" subtitle="Doctor workspace" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Doctor Dashboard</Text>
        <Text style={styles.subtitle}>Manage equipment support and marketplace inventory</Text>

        <View style={styles.cardGrid}>
          <SummaryCard icon="↗" count={reports.length} label="Fault Reports Sent" />
          <SummaryCard icon="✓" count={accepted} label="Accepted by Technician" />
          <SummaryCard icon="◷" count={reports.length - accepted} label="Awaiting Acceptance" />
          <SummaryCard icon="▣" count={devices.length} label="My Devices" />
        </View>

        <ActionButton title="+ Report Device Fault" onPress={() => navigation.navigate('ReportFault')} />

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Marketplace</Text>
          <Text style={styles.description}>
            Register and manage medical devices in your possession that may be offered for sale.
          </Text>
          <ActionButton title="View My Devices →" onPress={() => navigation.navigate('MyDevices')} />
          <ActionButton title="+ Add Device" onPress={() => navigation.navigate('AddDevice')} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Recent Fault Reports</Text>
          {reports.map((report) => (
            <View style={styles.listRow} key={report.id}>
              <View style={styles.flexOne}>
                <Text style={styles.itemTitle}>{report.device}</Text>
                <Text style={styles.smallText}>{report.id}</Text>
              </View>
              <Text style={[styles.status, report.status === 'Accepted' ? styles.accepted : styles.pending]}>
                {report.status}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PALETTE.page },
  container: { flex: 1, backgroundColor: PALETTE.page },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 18, paddingBottom: 36 },
  heading: { color: PALETTE.heading, fontSize: 25, fontWeight: '900' },
  subtitle: { color: '#668473', marginTop: 7, marginBottom: 22 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: { width: '48%', padding: 18, marginBottom: 12, borderRadius: 16, backgroundColor: PALETTE.white },
  cardIcon: { color: PALETTE.primary, fontSize: 25, fontWeight: '900' },
  count: { color: '#254E36', fontSize: 30, fontWeight: '900', marginTop: 12 },
  cardLabel: { color: '#627D6D', fontSize: 12, marginTop: 6 },
  panel: { padding: 18, marginTop: 18, borderRadius: 16, backgroundColor: PALETTE.white },
  panelTitle: { color: '#28573E', fontSize: 17, fontWeight: '900' },
  description: { color: PALETTE.text, lineHeight: 22, marginTop: 10, marginBottom: 3 },
  listRow: { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#E6EFE8', flexDirection: 'row', alignItems: 'center' },
  flexOne: { flex: 1 },
  itemTitle: { color: '#244A35', fontSize: 16, fontWeight: '700' },
  smallText: { color: '#708575', fontSize: 12, marginTop: 5 },
  status: { fontSize: 12, fontWeight: '800' },
  accepted: { color: '#248456' },
  pending: { color: '#A97422' },
});
