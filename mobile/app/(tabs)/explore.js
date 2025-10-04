import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { placesAPI } from '../../lib/api';

export default function ExploreScreen() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['cafe', 'park', 'hotel', 'pub', 'shop'];

  useEffect(() => {
    fetchPlaces();
  }, [selectedCategory]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await placesAPI.getNearby(params);
      setPlaces(response.data.places || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-4 px-4">
        <Text className="text-white text-3xl font-bold mb-4">Explore Places</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            className={`mr-2 px-4 py-2 rounded-full ${!selectedCategory ? 'bg-white' : 'bg-orange-400'}`}
          >
            <Text className={!selectedCategory ? 'text-primary font-semibold' : 'text-white'}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`mr-2 px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-white' : 'bg-orange-400'}`}
            >
              <Text className={selectedCategory === cat ? 'text-primary font-semibold' : 'text-white'}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {places.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">🐾</Text>
              <Text className="text-xl text-gray-600 mb-2">No places found</Text>
              <Text className="text-gray-500 text-center">
                Be the first to add a pet-friendly place!
              </Text>
            </View>
          ) : (
            places.map((place) => (
              <View key={place._id} className="bg-gray-50 rounded-lg p-4 mb-3">
                <Text className="text-lg font-semibold mb-1">{place.name}</Text>
                <Text className="text-gray-600 capitalize mb-2">{place.category}</Text>
                {place.tags && place.tags.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {place.tags.map((tag, idx) => (
                      <View key={idx} className="bg-orange-100 rounded-full px-3 py-1 mr-2 mb-2">
                        <Text className="text-primary text-xs">{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
