
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FileExplorer } from "@/components/FileExplorer";
import { Download, Folder } from "lucide-react";

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/files/No-Intro/");
  const baseUrl = "https://myrient.erista.me";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Download className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Myrient Download Harbor</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Browse and download files from the Myrient archive
          </p>
          
          {/* Current Path Display */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Current Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-gray-100 p-3 rounded border">
                {baseUrl}{currentPath}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Explorer */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>File Browser</CardTitle>
            <CardDescription>
              Navigate through directories and download files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileExplorer 
              baseUrl={baseUrl}
              currentPath={currentPath}
              onPathChange={setCurrentPath}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
