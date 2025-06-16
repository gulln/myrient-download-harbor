
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Folder, File } from 'lucide-react';
import { formatFileSize } from '@/utils/formatters';

interface FileInfo {
  name: string;
  isDirectory: boolean;
  size?: number;
  lastModified?: string;
}

interface FileItemProps {
  file: FileInfo;
  baseUrl: string;
  currentPath: string;
  onFolderClick: (folderName: string) => void;
}

export const FileItem = ({ file, baseUrl, currentPath, onFolderClick }: FileItemProps) => {
  const handleDownload = () => {
    const downloadUrl = baseUrl + currentPath + file.name;
    window.open(downloadUrl, '_blank');
  };

  const handleFolderClick = () => {
    if (file.isDirectory) {
      onFolderClick(file.name);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {file.isDirectory ? (
              <Folder className="h-5 w-5 text-blue-600 flex-shrink-0" />
            ) : (
              <File className="h-5 w-5 text-gray-600 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {file.name}
              </p>
              {!file.isDirectory && file.size && (
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                  {file.lastModified && (
                    <span className="ml-2">
                      Modified: {new Date(file.lastModified).toLocaleDateString()}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            {file.isDirectory ? (
              <Button 
                onClick={handleFolderClick}
                variant="outline"
                size="sm"
              >
                Open
              </Button>
            ) : (
              <Button 
                onClick={handleDownload}
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
