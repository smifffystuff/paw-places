import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { placesAPI } from '../../lib/api';
import { useRouter } from 'expo-router';

export default function AddPlaceScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: 'cafe',
    description: '',
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  const categories = ['cafe', 'park', 'hotel', 'pub', 'shop'];
  const availableTags = ['Dog-friendly', 'Cat-friendly', 'Water bowls', 'Outdoor seating'];

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a place name');
      return;
    }

    try {
      setLoading(true);
      await placesAPI.create({
        ...formData,
        geo: {
          lat: 51.5074, // Default to London - in production, use device location
          lng: -0.1278,
        },
      });
      Alert.alert('Success', 'Place added successfully!');
      setFormData({ name: '', category: 'cafe', description: '', tags: [] });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add place. Please try again.');
      console.error('Error adding place:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-4 px-4">
        <Text className="text-white text-3xl font-bold">Add a Place</Text>
      </View>

      <View className="p-4">
        <Text className="text-gray-700 font-semibold mb-2">Place Name *</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="e.g., Dog & Duck Pub"
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4"
        />

        <Text className="text-gray-700 font-semibold mb-2">Category</Text>
        <View className="flex-row flex-wrap mb-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setFormData({ ...formData, category: cat })}
              className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                formData.category === cat ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <Text className={formData.category === cat ? 'text-white' : 'text-gray-700'}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-700 font-semibold mb-2">Tags</Text>
        <View className="flex-row flex-wrap mb-4">
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                formData.tags.includes(tag) ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <Text className={formData.tags.includes(tag) ? 'text-white' : 'text-gray-700'}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-700 font-semibold mb-2">Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Tell us about this place..."
          multiline
          numberOfLines={4}
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6"
          style={{ textAlignVertical: 'top' }}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`bg-primary py-4 rounded-full ${loading ? 'opacity-50' : ''}`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Adding...' : 'Add Place'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
