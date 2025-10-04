import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignIn = async () => {
    // For now, we'll redirect to tabs. In production, implement Clerk sign-in flow
    router.replace('/(tabs)/explore');
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <Text className="text-4xl font-bold text-primary mb-2">🐾 PawPlaces</Text>
      <Text className="text-xl text-gray-600 mb-8 text-center">
        Discover pet-friendly places near you
      </Text>
      
      <TouchableOpacity
        onPress={handleSignIn}
        className="bg-primary px-8 py-4 rounded-full mb-4"
      >
        <Text className="text-white text-lg font-semibold">Get Started</Text>
      </TouchableOpacity>
      
      <Text className="text-gray-500 text-center mt-4">
        Join the community of pet lovers
      </Text>
    </View>
  );
}
