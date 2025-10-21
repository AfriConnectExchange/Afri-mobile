import { searchClient } from '@/lib/algolia';
import { View, Text } from 'react-native';
import { InstantSearch } from 'react-instantsearch-core';
import { SearchBox } from '@/components/SearchBox';
import { InfiniteHits } from '@/components/InfiniteHits';

export default function SearchScreen() {
  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 15 }}>
      <InstantSearch searchClient={searchClient} indexName="products">
        <SearchBox />
        <InfiniteHits />
      </InstantSearch>
    </View>
  );
}
