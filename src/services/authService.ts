import { auth } from '../config/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

class AuthService {
  /**
   * メールアドレスとパスワードでログイン
   */
  async signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new AuthError(this.getJapaneseErrorMessage(error.code), error.code);
    }
  }

  /**
   * ログアウト
   */
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new AuthError('ログアウトに失敗しました', error.code);
    }
  }

  /**
   * 認証状態の変化を監視
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return auth().onAuthStateChanged((firebaseUser: FirebaseAuthTypes.User | null) => {
      if (firebaseUser) {
        callback(this.mapFirebaseUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }

  /**
   * 現在のユーザーを取得
   */
  getCurrentUser(): FirebaseUser | null {
    const firebaseUser = auth().currentUser;
    return firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * FirebaseユーザーをアプリのFirebaseUser形式にマップ
   */
  private mapFirebaseUser(firebaseUser: FirebaseAuthTypes.User): FirebaseUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    };
  }

  /**
   * Firebase Auth エラーコードを日本語メッセージに変換（ログイン用）
   */
  private getJapaneseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'このメールアドレスは登録されていません';
      case 'auth/wrong-password':
        return 'パスワードが正しくありません';
      case 'auth/invalid-email':
        return '有効なメールアドレスを入力してください';
      case 'auth/user-disabled':
        return 'このアカウントは無効になっています';
      case 'auth/too-many-requests':
        return 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください';
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました';
      default:
        return 'ログインに失敗しました';
    }
  }

  /**
   * Firebase Auth エラーコードを日本語メッセージに変換（登録用）
   */
  private getJapaneseRegisterErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に使用されています';
      case 'auth/invalid-email':
        return '有効なメールアドレスを入力してください';
      case 'auth/weak-password':
        return 'パスワードは6文字以上で入力してください';
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました';
      default:
        return 'アカウント作成に失敗しました';
    }
  }
}

// シングルトンインスタンスを提供
export const authService = new AuthService(); 