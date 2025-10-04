import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { feedAPI } from '../../lib/api';

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await feedAPI.getFeed();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary pt-12 pb-4 px-4">
        <Text className="text-white text-3xl font-bold">Feed</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <ScrollView className="flex-1">
          {posts.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📱</Text>
              <Text className="text-xl text-gray-600 mb-2">No posts yet</Text>
              <Text className="text-gray-500 text-center">
                Start sharing your pet adventures!
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post._id} className="border-b border-gray-200">
                {post.photoUrl && (
                  <Image
                    source={{ uri: post.photoUrl }}
                    className="w-full h-80"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4">
                  <Text className="text-gray-800">{post.caption}</Text>
                  <Text className="text-gray-400 text-xs mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
