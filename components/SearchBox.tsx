import { useSearchBox } from 'react-instantsearch-core';
import { Input } from './ui/input';

export function SearchBox(props: any) {
  const { query, refine } = useSearchBox(props);

  return (
    <Input
      placeholder="Search products..."
      value={query}
      onChangeText={refine}
      autoFocus
    />
  );
}
