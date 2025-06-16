
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { FileItem } from '@/components/FileItem';
import { fetchDirectoryContents } from '@/utils/fileService';
import { toast } from 'sonner';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FileExplorerProps {
  baseUrl: string;
  currentPath: string;
  onPathChange: (path: string) => void;
}

export const FileExplorer = ({ baseUrl, currentPath, onPathChange }: FileExplorerProps) => {
  const { data: files, isLoading, error, refetch } = useQuery({
    queryKey: ['directory', currentPath],
    queryFn: () => fetchDirectoryContents(baseUrl + currentPath),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 2) { // Keep at least /files/No-Intro/
      pathParts.pop();
      const newPath = '/' + pathParts.join('/') + '/';
      onPathChange(newPath);
    }
  };

  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath + folderName + '/';
    onPathChange(newPath);
  };

  if (error) {
    console.error('Directory loading error:', error);
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Failed to load directory</h3>
            <p className="text-gray-600 mb-4">
              Unable to fetch directory contents. This might be due to network restrictions or server issues.
            </p>
          </div>
          <Button onClick={() => refetch()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button 
          onClick={navigateUp} 
          variant="outline" 
          disabled={currentPath === '/files/No-Intro/'}
        >
          ← Back
        </Button>
        <span className="text-sm text-gray-600">
          {isLoading ? 'Loading...' : `${files?.length || 0} items`}
        </span>
      </div>

      {/* File List */}
      <ScrollArea className="h-[600px] border rounded-lg">
        <div className="p-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          ) : files && files.length > 0 ? (
            files.map((file, index) => (
              <FileItem
                key={index}
                file={file}
                baseUrl={baseUrl}
                currentPath={currentPath}
                onFolderClick={navigateToFolder}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No files or folders found in this directory.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
