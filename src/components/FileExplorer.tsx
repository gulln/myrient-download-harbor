
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { FileItem } from '@/components/FileItem';
import { fetchDirectoryContents } from '@/utils/fileService';
import { toast } from 'sonner';

interface FileExplorerProps {
  baseUrl: string;
  currentPath: string;
  onPathChange: (path: string) => void;
}

export const FileExplorer = ({ baseUrl, currentPath, onPathChange }: FileExplorerProps) => {
  const { data: files, isLoading, error } = useQuery({
    queryKey: ['directory', currentPath],
    queryFn: () => fetchDirectoryContents(baseUrl + currentPath),
    retry: 2,
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
    toast.error('Failed to load directory contents');
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 mb-4">Failed to load directory contents</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
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
          {files?.length || 0} items
        </span>
      </div>

      {/* File List */}
      <ScrollArea className="h-[600px] border rounded-lg">
        <div className="p-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))
          ) : (
            files?.map((file, index) => (
              <FileItem
                key={index}
                file={file}
                baseUrl={baseUrl}
                currentPath={currentPath}
                onFolderClick={navigateToFolder}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
