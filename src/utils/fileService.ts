
interface FileInfo {
  name: string;
  isDirectory: boolean;
  size?: number;
  lastModified?: string;
}

export const fetchDirectoryContents = async (url: string): Promise<FileInfo[]> => {
  console.log('Fetching directory contents from:', url);
  
  try {
    // Use a CORS proxy to bypass CORS restrictions
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const html = data.contents;
    
    return parseDirectoryListing(html);
  } catch (error) {
    console.error('Error fetching directory contents:', error);
    throw error;
  }
};

const parseDirectoryListing = (html: string): FileInfo[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const files: FileInfo[] = [];
  
  // Look for common directory listing patterns
  const links = doc.querySelectorAll('a[href]');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '../' || href === '/' || href.startsWith('http')) {
      return;
    }
    
    const name = href.endsWith('/') ? href.slice(0, -1) : href;
    if (name === '' || name === '.' || name === '..') {
      return;
    }
    
    const isDirectory = href.endsWith('/');
    
    // Try to extract file size and date from the text content
    const parentRow = link.closest('tr') || link.parentElement;
    const textContent = parentRow?.textContent || '';
    
    let size: number | undefined;
    let lastModified: string | undefined;
    
    // Common patterns for file size (look for numbers followed by size units)
    const sizeMatch = textContent.match(/(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB|KiB|MiB|GiB|TiB)/i);
    if (sizeMatch && !isDirectory) {
      const [, sizeStr, unit] = sizeMatch;
      const sizeNum = parseFloat(sizeStr);
      const multipliers: { [key: string]: number } = {
        'B': 1,
        'KB': 1000, 'KIB': 1024,
        'MB': 1000000, 'MIB': 1024 * 1024,
        'GB': 1000000000, 'GIB': 1024 * 1024 * 1024,
        'TB': 1000000000000, 'TIB': 1024 * 1024 * 1024 * 1024
      };
      size = sizeNum * (multipliers[unit.toUpperCase()] || 1);
    }
    
    // Look for date patterns
    const dateMatch = textContent.match(/(\d{1,2}-\w{3}-\d{4}\s+\d{2}:\d{2}|\d{4}-\d{2}-\d{2}|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
    if (dateMatch) {
      lastModified = dateMatch[1];
    }
    
    files.push({
      name,
      isDirectory,
      size,
      lastModified
    });
  });
  
  // Sort directories first, then files
  return files.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};
