import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { TextInput } from 'react-native';

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

interface BusinessHoursSectionProps {
  businessHours: BusinessHours;
  onUpdate: (newHours: BusinessHours) => void;
}

const dayNames: Record<string, string> = {
  monday: '月曜日',
  tuesday: '火曜日',
  wednesday: '水曜日',
  thursday: '木曜日',
  friday: '金曜日',
  saturday: '土曜日',
  sunday: '日曜日',
};

export default function BusinessHoursSection({ businessHours, onUpdate }: BusinessHoursSectionProps) {
  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    onUpdate({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [type]: value,
      },
    });
  };

  const handleIsOpenChange = (day: string, value: boolean) => {
    onUpdate({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        isOpen: value,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>営業時間</Text>
      {Object.entries(businessHours).map(([day, hours]) => (
        <View key={day} style={styles.dayRow}>
          <View style={styles.dayNameContainer}>
            <Text style={styles.dayName}>{dayNames[day]}</Text>
          </View>
          <View style={styles.hoursContainer}>
            <Switch
              value={hours.isOpen}
              onValueChange={(value) => handleIsOpenChange(day, value)}
            />
            {hours.isOpen && (
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={hours.open}
                  onChangeText={(text) => handleTimeChange(day, 'open', text)}
                  placeholder="00:00"
                  keyboardType="numbers-and-punctuation"
                />
                <Text style={styles.timeSeparator}>-</Text>
                <TextInput
                  style={styles.timeInput}
                  value={hours.close}
                  onChangeText={(text) => handleTimeChange(day, 'close', text)}
                  placeholder="00:00"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayNameContainer: {
    width: 80,
  },
  dayName: {
    fontSize: 16,
  },
  hoursContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: 80,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
  },
}); 