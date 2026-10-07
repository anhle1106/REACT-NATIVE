import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function LayoutScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hồ sơ</Text>
            </View>

            <View style={styles.profile}>
                <View style={styles.avatar} />
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>Lê Minh Châu</Text>
                    <Text style={styles.major}>Sinh viên CNTT</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Môn</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>3.6</Text>
                    <Text style={styles.statLabel}>GPA</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>120</Text>
                    <Text style={styles.statLabel}>Tín chỉ</Text>
                </View>
            </View>

            <View style={styles.list}>
                <View style={styles.listItem} />
                <View style={styles.listItem} />
                <View style={styles.listItem} />
                <View style={styles.listItem} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    profile: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    profileInfo: {
        marginLeft: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    major: {
        fontSize: 14,
        marginTop: 4,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 16,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 13,
        marginTop: 2,
    },
    list: {
        flex: 1,
        padding: 16,
    },
    listItem: {
        height: 50,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
    },
});
