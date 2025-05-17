import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

// メニューカテゴリーの型定義
type MenuCategory = '食べ物' | 'ドリンク';
type MenuStatus = '販売中' | '在庫切れ' | '非表示';

// メニューアイテムの型定義
interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl: string | null;
  status: MenuStatus;
  stock: number;
}

// ナビゲーションの型定義
type RootStackParamList = {
  EditMenu: { id: string };
};

type EditMenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditMenu'>;
type EditMenuScreenRouteProp = RouteProp<RootStackParamList, 'EditMenu'>;

// モックデータ
const mockMenuItems: MenuItem[] = [
  {
    id: 'MENU-001',
    name: 'カフェラテ',
    category: 'ドリンク',
    price: 480,
    description: '濃厚なエスプレッソと滑らかなミルクの組み合わせ',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800',
    status: '販売中',
    stock: 100,
  },
  {
    id: 'MENU-002',
    name: 'アメリカーノ',
    category: 'ドリンク',
    price: 400,
    description: 'すっきりとした味わいのブラックコーヒー',
    imageUrl: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=800',
    status: '在庫切れ',
    stock: 0,
  },
  {
    id: 'MENU-003',
    name: 'クロワッサン',
    category: '食べ物',
    price: 280,
    description: 'バターの香り豊かなサクサクのクロワッサン',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
    status: '販売中',
    stock: 8,
  },
  {
    id: 'MENU-004',
    name: 'チョコレートケーキ',
    category: '食べ物',
    price: 480,
    description: '濃厚なチョコレートの味わい',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    status: '非表示',
    stock: 0,
  },
];

export const EditMenuScreen = () => {
  const navigation = useNavigation<EditMenuScreenNavigationProp>();
  const route = useRoute<EditMenuScreenRouteProp>();
  const menuId = route.params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    // 実際のアプリではAPIからデータを取得
    const item = mockMenuItems.find((item) => item.id === menuId);
    if (item) {
      setMenuItem(item);
    } else {
      Alert.alert('エラー', 'メニューアイテムが見つかりませんでした');
      navigation.goBack();
    }
  }, [menuId]);

  const pickImage = async () => {
    if (!menuItem) return;

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

  const handleSave = async () => {
    if (!menuItem) return;

    setIsLoading(true);
    try {
      // TODO: APIを呼び出してメニューを更新
      Alert.alert('成功', 'メニューを更新しました');
      navigation.goBack();
    } catch (error) {
      console.error('メニューの更新に失敗しました:', error);
      Alert.alert('エラー', 'メニューの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'メニューの削除',
      'このメニューを削除してもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // TODO: APIを呼び出してメニューを削除
              Alert.alert('成功', 'メニューを削除しました');
              navigation.goBack();
            } catch (error) {
              console.error('メニューの削除に失敗しました:', error);
              Alert.alert('エラー', 'メニューの削除に失敗しました');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!menuItem) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

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
          {['食べ物', 'ドリンク'].map((category) => (
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
          <Text style={styles.label}>販売中</Text>
          <Switch
            value={menuItem.status === '販売中'}
            onValueChange={(value) => setMenuItem({ ...menuItem, status: value ? '販売中' : '在庫切れ' })}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>表示</Text>
          <Switch
            value={menuItem.status === '販売中'}
            onValueChange={(value) => setMenuItem({ ...menuItem, status: value ? '販売中' : '非表示' })}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>削除</Text>
          </TouchableOpacity>

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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
    marginRight: 8,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 