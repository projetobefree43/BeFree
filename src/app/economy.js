import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Economy() {
  const router = useRouter();

  const goals = [
    {
      id: "1",
      title: "Tênis novo",
      saved: 340,
      target: 400,
      percent: 85,
      icon: "shoe-formal",
    },
    {
      id: "2",
      title: "Viagem fim de ano",
      saved: 1350,
      target: 3000,
      percent: 45,
      icon: "airplane",
    },
    {
      id: "3",
      title: "Novo celular",
      saved: 396,
      target: 1800,
      percent: 22,
      icon: "cellphone",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1C3113" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Economia & Metas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.streakCard}>
          <MaterialCommunityIcons name="fire" size={22} color="#E65100" />
          <Text style={styles.streakText}>
            Você está economizando há <Text style={styles.bold}>47 dias!</Text>
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total poupado estimado</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountText}>R$ 2.340,00</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>↗ +12%</Text>
            </View>
          </View>
          <Text style={styles.totalSub}>
            Valor estimado economizado desde o início do seu streak sem apostas.
          </Text>
        </View>

        <View style={styles.goalsHeader}>
          <Text style={styles.sectionTitle}>Suas Metas</Text>
          <TouchableOpacity style={styles.addGoalBtn}>
            <Text style={styles.addGoalText}>+ Nova meta</Text>
          </TouchableOpacity>
        </View>

        {goals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalTop}>
              <View style={styles.goalInfo}>
                <MaterialCommunityIcons
                  name={goal.icon}
                  size={20}
                  color="#4A6B3E"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.goalTitle}>{goal.title}</Text>
              </View>
              <Text style={styles.goalPercent}>{goal.percent}%</Text>
            </View>

            <Text style={styles.goalValue}>
              R$ {goal.saved.toFixed(2)} poupados de R$ {goal.target.toFixed(2)}
            </Text>

            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${goal.percent}%` }]}
              />
            </View>
          </View>
        ))}

        <View style={styles.quoteCard}>
          <Ionicons
            name="leaf-outline"
            size={20}
            color="#4A6B3E"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.quoteText}>
            "Cada dia sem apostar te aproxima dos seus sonhos."
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8C3A0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C3113",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  streakText: {
    fontSize: 14,
    color: "#1C3113",
  },
  bold: {
    fontWeight: "bold",
  },
  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 13,
    color: "#666",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 10,
  },
  amountText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C3113",
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  totalSub: {
    fontSize: 11,
    color: "#888",
  },
  goalsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C3113",
  },
  addGoalBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addGoalText: {
    fontSize: 12,
    color: "#1C3113",
    fontWeight: "600",
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1C3113",
  },
  goalPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A6B3E",
  },
  goalValue: {
    fontSize: 12,
    color: "#666",
    marginVertical: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4A6B3E",
    borderRadius: 4,
  },
  quoteCard: {
    backgroundColor: "#CDE0C3",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    color: "#2A4A23",
    fontStyle: "italic",
  },
});
