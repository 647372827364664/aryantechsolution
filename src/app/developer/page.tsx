"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Code2, 
  Terminal, 
  GitBranch, 
  Cpu,
  Database,
  Globe,
  Rocket,
  Settings,
  Book,
  Users,
  Zap,
  Shield,
  BarChart3,
  FileCode,
  Package,
  Activity,
  LogOut,
  Eye
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { logOut } from "@/lib/firebase";

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Aryan Tech Solution Website",
      type: "Next.js",
      status: "Active",
      lastUpdate: "2 hours ago",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"]
    },
    {
      id: "2", 
      name: "Discord Bot Framework",
      type: "Node.js",
      status: "Development",
      lastUpdate: "1 day ago",
      technologies: ["Node.js", "Discord.js", "MongoDB", "TypeScript"]
    },
    {
      id: "3",
      name: "Client Management API",
      type: "API",
      status: "Testing",
      lastUpdate: "3 days ago",
      technologies: ["Express.js", "PostgreSQL", "JWT", "Redis"]
    }
  ]);

  const [stats, setStats] = useState({
    activeProjects: 8,
    totalCommits: 247,
    codeReviews: 12,
    deployments: 15
  });

  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  if (!user || user.role !== 'developer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-white">Access Denied</CardTitle>
            <CardDescription className="text-gray-300">
              You need developer privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Login as Developer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Code2 className="h-8 w-8 text-blue-400" />
                Developer Dashboard
              </h1>
              <p className="text-gray-300">Build, deploy, and manage Aryan Tech Solution services</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Welcome back, {user?.name}</span>
              <Link href="/">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Globe className="h-4 w-4 mr-2" />
                  View Live Site
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold">{stats.activeProjects}</p>
                </div>
                <Rocket className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Commits</p>
                  <p className="text-3xl font-bold">{stats.totalCommits}</p>
                </div>
                <GitBranch className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Code Reviews</p>
                  <p className="text-3xl font-bold">{stats.codeReviews}</p>
                </div>
                <FileCode className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Deployments</p>
                  <p className="text-3xl font-bold">{stats.deployments}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Projects */}
          <Card className="col-span-2 bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-400" />
                    Active Projects
                  </CardTitle>
                  <CardDescription className="text-gray-400">Manage your development projects</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Code2 className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        project.status === 'Active' ? 'bg-green-400' : 
                        project.status === 'Development' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div>
                        <p className="font-medium text-white">{project.name}</p>
                        <p className="text-sm text-gray-400">{project.type} • {project.lastUpdate}</p>
                        <div className="flex gap-2 mt-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Terminal className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Tools */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  <Terminal className="h-4 w-4 mr-2" />
                  Open Terminal
                </Button>
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Git Operations
                </Button>
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Database Console
                </Button>
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy to Production
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Book className="h-5 w-5 text-green-400" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>API Documentation</span>
                    <span className="text-xs text-gray-500">Updated</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Component Library</span>
                    <span className="text-xs text-gray-500">v2.1.0</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Deployment Guide</span>
                    <span className="text-xs text-gray-500">Latest</span>
                  </div>
                </div>
                <Button className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white" variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  View All Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Cpu className="h-5 w-5 text-blue-400" />
                System Performance
              </CardTitle>
              <CardDescription className="text-gray-400">Real-time system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">CPU Usage</span>
                  <span className="font-semibold text-green-400">23%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-1/4"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Memory Usage</span>
                  <span className="font-semibold text-blue-400">67%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-2/3"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Disk Usage</span>
                  <span className="font-semibold text-orange-400">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full w-5/12"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Development Metrics
              </CardTitle>
              <CardDescription className="text-gray-400">Your coding statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Lines of Code Today</span>
                  <span className="font-semibold text-green-400">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Bugs Fixed</span>
                  <span className="font-semibold text-blue-400">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Tests Written</span>
                  <span className="font-semibold text-purple-400">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Code Coverage</span>
                  <span className="font-semibold text-orange-400">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
