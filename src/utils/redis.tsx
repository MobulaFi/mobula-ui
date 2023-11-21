class InMemoryCache {
  cache: Map<string, any> = new Map();

  set(key: string, value: any, ex: number) {
    this.cache[key] = {
      data: value,
      expires: Date.now() + ex * 1000,
    };
  }

  get(key: string): any | undefined {
    const data = this.cache[key];

    if (data && Date.now() < data.expires) {
      return data.data;
    }
    return undefined;
  }
}

export const memoryCache = new InMemoryCache();
