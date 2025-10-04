import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-8 px-4 items-center">
        <View className="w-24 h-24 bg-white rounded-full justify-center items-center mb-4">
          <Text className="text-5xl">👤</Text>
        </View>
        <Text className="text-white text-2xl font-bold">
          {user?.firstName || 'Pet Lover'}
        </Text>
        <Text className="text-orange-100 mt-1">
          {user?.primaryEmailAddress?.emailAddress || 'pet@example.com'}
        </Text>
      </View>

      <View className="p-4">
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-gray-600 mb-2">My Contributions</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">0</Text>
              <Text className="text-gray-600 text-sm">Places</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">0</Text>
              <Text className="text-gray-600 text-sm">Reviews</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary">0</Text>
              <Text className="text-gray-600 text-sm">Posts</Text>
            </View>
          </View>
        </View>

        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-gray-600 mb-3">My Pets</Text>
          <View className="items-center py-8">
            <Text className="text-4xl mb-2">🐾</Text>
            <Text className="text-gray-500">No pets added yet</Text>
            <TouchableOpacity className="mt-3 bg-primary px-4 py-2 rounded-full">
              <Text className="text-white font-semibold">Add a Pet</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-500 py-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
