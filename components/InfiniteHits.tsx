import { useInfiniteHits } from 'react-instantsearch-core';
import { View, Text, FlatList, Button } from 'react-native';

export function InfiniteHits(props: any) {
  const { hits, isLastPage, showMore } = useInfiniteHits(props);

  return (
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
          <Text>{item.name}</Text>
        </View>
      )}
      onEndReached={() => !isLastPage && showMore()}
      ListFooterComponent={() => (
        !isLastPage && <Button title="Load more" onPress={showMore} />
      )}
    />
  );
}
