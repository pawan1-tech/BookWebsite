import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link } from "expo-router";
import style from "../../assets/styles/signup.styles";
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function SignUp() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, isLoading, register,  } = useAuthStore();



  const router = useRouter();

  const handleSingUp = async () => {
    const result = await register( email, username, password);
    if (!result.success) {
      Alert.alert("Error",result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={style.container}>
        <View style={style.card}>
          {/* Header */}
          <View style={style.header}>
            <Text style={style.title}>BookWorm🐛</Text>
            <Text style={style.subtitle}>Share your favorite reads</Text>
          </View>

          <View style={style.formContainer}>
            {/* user Input */}
            <View style={style.inputGroup}>
              <Text style={style.label}>Username</Text>
              <View style={style.inputContainer}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={COLORS.primary}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="John Doe"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUserName}
                  autoCapitalize='none'                  
                />
              </View>
            </View>

            {/* email Input */}
            <View style={style.inputGroup}>
              <Text style={style.label}>Email</Text>
              <View style={style.inputContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={COLORS.primary}
                  style={style.inputIcon}
                />
                <TextInput
                  style={style.input}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>
            </View>

            {/* password Input */}
            <View style={style.inputGroup}>
              <Text style={style.label}>Password</Text>
              <View style={style.inputContainer}>
                {/* Left */}
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={COLORS.primary}
                  style={style.inputIcon}
                />
                {/* Input */}
                <TextInput
                  style={style.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={style.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={COLORS.primary}
                  />

                </TouchableOpacity>
              </View>
            </View>

            {/* signup button */}
            <TouchableOpacity
              style={style.button}
              onPress={handleSingUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={style.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={style.footer}>
              <Text style={style.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={style.link}>Login</Text>
                </TouchableOpacity>

            </View>


          </View>


        </View>
      </View>

    </KeyboardAvoidingView>
  )
}

// fkj pawansah@gmail.com