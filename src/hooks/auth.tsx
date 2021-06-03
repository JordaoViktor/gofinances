import React,{createContext, ReactNode, useContext, useState, useEffect} from 'react';
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage'
interface AuthProviderProps {
  children: ReactNode;
}

interface IAuthContextData{
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({children}:AuthProviderProps){
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true)
  const userStorageKey = '@gofinances:user'
  async function signInWithGoogle(){
    try {
      const result = await Google.logInAsync({
        iosClientId:'127647105593-anul7g3n9bkniaq9jta88k5q9h3o38jq.apps.googleusercontent.com',
        androidClientId:'127647105593-lmplioh4sbvc9iro8424ko6c3k6vkcqi.apps.googleusercontent.com',
        scopes:['profile', 'email']
      })
      if(result.type === 'success'){
        const userLogged = {
          id:String(result.user.id),
          email:result.user.email!,
          name:result.user.name!,
          photo:result.user.photoUrl!,
        }
        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
      }
    } catch (error) { 
      throw new Error(error)
    }
  }

  async function signInWithApple(){
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      })
      if(credential){
        const userLogged = {
          id:String(credential.user),
          email:credential.email!,
          name:credential.fullName!.givenName!,
          photo:undefined,
        }
        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))

      }
    } catch (error) {
      throw new Error(error)
    }
  }
  useEffect(()=>{
    async function loadUserStorageDate(){
      const userStoraged = await AsyncStorage.getItem(userStorageKey)
      if(userStoraged){
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged)
      }
      setUserStorageLoading(false)
    }
    loadUserStorageDate()
  })

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext);
  return context;
}

export {AuthProvider, useAuth}