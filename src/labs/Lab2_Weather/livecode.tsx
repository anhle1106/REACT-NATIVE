import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const DANH_SACH_THOI_TIET = [
    { id: 't2', ngay: 'Thứ 2', moTa: 'Nắng nhẹ', nhietDo: 28, doAm: 65, icon: '☀️' },
    { id: 't3', ngay: 'Thứ 3', moTa: 'Nhiều mây', nhietDo: 26, doAm: 70, icon: '⛅' },
    { id: 't4', ngay: 'Thứ 4', moTa: 'Mưa rào', nhietDo: 23, doAm: 85, icon: '🌧️' },
    { id: 't5', ngay: 'Thứ 5', moTa: 'Có dông', nhietDo: 22, doAm: 92, icon: '⛈️' },
    { id: 't6', ngay: 'Thứ 6', moTa: 'Tạnh ráo', nhietDo: 27, doAm: 68, icon: '🌤️' },
    { id: 't7', ngay: 'Thứ 7', moTa: 'Nắng gắt', nhietDo: 32, doAm: 58, icon: '☀️' },
    { id: 'cn', ngay: 'Chủ nhật', moTa: 'Mát mẻ', nhietDo: 25, doAm: 75, icon: '⛅' },
];

export const WeatherScreen = () => {
    const [ngayDangChon, setNgayDangChon] = useState(DANH_SACH_THOI_TIET[0]);

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView style={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Du bao thoi tiet 7 ngay
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scroll: {
        flex: 1,
        padding: 16
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000'
    }
})
