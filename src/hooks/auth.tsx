import React,{createContext, ReactNode, useContext, useState} from 'react';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
interface AuthProviderProps {
  children: ReactNode;
}

interface IAuthContextData{
  user: User;
  signInWithGoogle(): Promise<void>
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
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }
    } catch (error) { 
      throw new Error(error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle
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