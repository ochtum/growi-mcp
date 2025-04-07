import { 
  normalizePath, 
  isListPagesArgs, 
  isGetPageArgs, 
  isCreatePageArgs, 
  isUpdatePageArgs,
  isSearchPagesArgs 
} from './index.js';

describe('normalizePath', () => {
  it('should add a leading slash if missing', () => {
    expect(normalizePath('path/to/page')).toBe('/path/to/page');
  });
  
  it('should not modify a path that already has a leading slash', () => {
    expect(normalizePath('/path/to/page')).toBe('/path/to/page');
  });
});

describe('isListPagesArgs', () => {
  it('should return true for a valid object', () => {
    expect(isListPagesArgs({})).toBe(true);
    expect(isListPagesArgs({ limit: 10 })).toBe(true);
    expect(isListPagesArgs({ path: '/home' })).toBe(true);
  });
  
  it('should return false for non-objects', () => {
    expect(isListPagesArgs(null)).toBe(false);
    expect(isListPagesArgs('string')).toBe(false);
    expect(isListPagesArgs(123)).toBe(false);
  });
});

describe('isGetPageArgs', () => {
  it('should return true for an object with a path property', () => {
    expect(isGetPageArgs({ path: '/home' })).toBe(true);
    expect(isGetPageArgs({ path: '/home', extra: 'value' })).toBe(true);
  });
  
  it('should return false for objects without a path property', () => {
    expect(isGetPageArgs({})).toBe(false);
    expect(isGetPageArgs({ notPath: '/home' })).toBe(false);
  });
  
  it('should return false for non-objects or objects with non-string path', () => {
    expect(isGetPageArgs(null)).toBe(false);
    expect(isGetPageArgs('string')).toBe(false);
    expect(isGetPageArgs({ path: 123 })).toBe(false);
  });
});

describe('isCreatePageArgs', () => {
  it('should return true for an object with path and body properties', () => {
    expect(isCreatePageArgs({ path: '/home', body: 'content' })).toBe(true);
    expect(isCreatePageArgs({ path: '/home', body: 'content', extra: 'value' })).toBe(true);
  });
  
  it('should return false for objects missing path or body properties', () => {
    expect(isCreatePageArgs({})).toBe(false);
    expect(isCreatePageArgs({ path: '/home' })).toBe(false);
    expect(isCreatePageArgs({ body: 'content' })).toBe(false);
  });
  
  it('should return false for non-objects or objects with non-string path/body', () => {
    expect(isCreatePageArgs(null)).toBe(false);
    expect(isCreatePageArgs('string')).toBe(false);
    expect(isCreatePageArgs({ path: 123, body: 'content' })).toBe(false);
    expect(isCreatePageArgs({ path: '/home', body: 123 })).toBe(false);
  });
});

describe('isUpdatePageArgs', () => {
  it('should return true for an object with path and body properties', () => {
    expect(isUpdatePageArgs({ path: '/home', body: 'content' })).toBe(true);
    expect(isUpdatePageArgs({ path: '/home', body: 'content', extra: 'value' })).toBe(true);
  });
  
  it('should return false for objects missing path or body properties', () => {
    expect(isUpdatePageArgs({})).toBe(false);
    expect(isUpdatePageArgs({ path: '/home' })).toBe(false);
    expect(isUpdatePageArgs({ body: 'content' })).toBe(false);
  });
  
  it('should return false for non-objects or objects with non-string path/body', () => {
    expect(isUpdatePageArgs(null)).toBe(false);
    expect(isUpdatePageArgs('string')).toBe(false);
    expect(isUpdatePageArgs({ path: 123, body: 'content' })).toBe(false);
    expect(isUpdatePageArgs({ path: '/home', body: 123 })).toBe(false);
  });
});

describe('isSearchPagesArgs', () => {
  it('should return true for an object with a q property', () => {
    expect(isSearchPagesArgs({ q: 'search term' })).toBe(true);
    expect(isSearchPagesArgs({ q: 'search term', limit: 10 })).toBe(true);
    expect(isSearchPagesArgs({ q: 'search term', offset: 5 })).toBe(true);
  });
  
  it('should return false for objects without a q property', () => {
    expect(isSearchPagesArgs({})).toBe(false);
    expect(isSearchPagesArgs({ notQ: 'search term' })).toBe(false);
  });
  
  it('should return false for non-objects or objects with non-string q', () => {
    expect(isSearchPagesArgs(null)).toBe(false);
    expect(isSearchPagesArgs('string')).toBe(false);
    expect(isSearchPagesArgs({ q: 123 })).toBe(false);
  });
});
