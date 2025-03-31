import { useState, useCallback } from 'react';

export const useRefreshData = (refreshFunction: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFunction();
    setTimeout(() => setRefreshing(false), 500);
  }, [refreshFunction]);

  return {
    refreshing,
    handleRefresh
  };
};