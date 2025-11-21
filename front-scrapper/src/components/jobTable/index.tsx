import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobsMock } from "./mock";

export default function JobTable() {
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number>(-1);
  const [jobs, setJobs] = useState(jobsMock);
  // Sample job data

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Filter jobs based on search and duration
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        job.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.platform.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDuration =
        durationFilter === "all" ||
        (durationFilter === "24h" && job.postedDays <= 1) ||
        (durationFilter === "7d" && job.postedDays <= 7) ||
        (durationFilter === "30d" && job.postedDays <= 30);

      return matchesSearch && matchesDuration;
    });
  }, [jobs, searchTerm, durationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, durationFilter, rowsPerPage]);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? -1 : id);
  };

  const getDurationText = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Job Listings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredJobs.length} jobs found
              </p>
            </div>
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, company, skills, city, or platform..."
                    className="pl-10"
                  />
                </div>

                {/* Duration Filter */}
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="all">All Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>

                {/* Rows Per Page */}
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Skills
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Posted
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentJobs.map((job) => (
                      <React.Fragment key={job.id}>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {job.title}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {job.company}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {job.skills.map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {job.city}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="text-xs">
                              {job.platform}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {getDurationText(job.postedDays)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleRow(job.id)}
                                title="View Details"
                              >
                                {expandedRow == job.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => window.open(job.link, "_blank")}
                                title="Apply Now"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {expandedRow === job.id && (
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                    Description
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {job.description}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                    Requirements
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {job.requirements}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                    Salary Range
                                  </h4>
                                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    {job.salary}
                                  </p>
                                </div>
                                <Button
                                  onClick={() =>
                                    window.open(job.link, "_blank")
                                  }
                                  className="mt-2"
                                >
                                  Apply on {job.platform}
                                  <ExternalLink className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredJobs.length)} of{" "}
                  {filteredJobs.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
