import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

// メニューカテゴリの型定義
type MenuCategory = 'coffee' | 'tea' | 'food' | 'other';

// 新規メニューアイテムの型定義
interface NewMenuItem {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isVisible: boolean;
  stock: number;
  stockManaged: boolean;
}

export const CreateMenuScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // 新規メニューの初期値
  const [menuItem, setMenuItem] = useState<NewMenuItem>({
    name: '',
    description: '',
    price: 0,
    category: 'coffee',
    imageUrl: '',
    isVisible: true,
    stock: 0,
    stockManaged: false,
  });

  // 画像選択処理
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMenuItem({ ...menuItem, imageUrl: result.assets[0].uri });
    }
  };

  // メニュー保存処理
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: APIを呼び出してメニューを保存
      navigation.goBack();
    } catch (error) {
      console.error('メニューの保存に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>メニュー名</Text>
        <TextInput
          style={styles.input}
          value={menuItem.name}
          onChangeText={(text) => setMenuItem({ ...menuItem, name: text })}
          placeholder="メニュー名を入力"
        />

        <Text style={styles.label}>説明</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={menuItem.description}
          onChangeText={(text) => setMenuItem({ ...menuItem, description: text })}
          placeholder="メニューの説明を入力"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>価格</Text>
        <TextInput
          style={styles.input}
          value={menuItem.price.toString()}
          onChangeText={(text) => setMenuItem({ ...menuItem, price: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="価格を入力"
        />

        <Text style={styles.label}>カテゴリ</Text>
        <View style={styles.categoryContainer}>
          {['coffee', 'tea', 'food', 'other'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                menuItem.category === category && styles.categoryButtonActive,
              ]}
              onPress={() => setMenuItem({ ...menuItem, category: category as MenuCategory })}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  menuItem.category === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>画像</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {menuItem.imageUrl ? (
            <Image source={{ uri: menuItem.imageUrl }} style={styles.image} />
          ) : (
            <Text style={styles.imageButtonText}>画像を選択</Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>在庫管理</Text>
          <Switch
            value={menuItem.stockManaged}
            onValueChange={(value) => setMenuItem({ ...menuItem, stockManaged: value })}
          />
        </View>

        {menuItem.stockManaged && (
          <>
            <Text style={styles.label}>在庫数</Text>
            <TextInput
              style={styles.input}
              value={menuItem.stock.toString()}
              onChangeText={(text) => setMenuItem({ ...menuItem, stock: parseInt(text) || 0 })}
              keyboardType="numeric"
              placeholder="在庫数を入力"
            />
          </>
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>表示</Text>
          <Switch
            value={menuItem.isVisible}
            onValueChange={(value) => setMenuItem({ ...menuItem, isVisible: value })}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#000',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  imageButton: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 