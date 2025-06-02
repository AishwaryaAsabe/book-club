"use client";

import React, { useEffect ,useState} from 'react';
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useRouter } from 'next/navigation';
import { Input } from "../../components/ui/input";
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Navbar from "../../components/Navbar/layout";
import {
  Users,
  Search,
  Plus,
  Book,
  MessageCircle,
  Calendar,
  Crown,
} from "lucide-react";

const Clubs = () => {
  const [joined, setJoined] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [allClubs, setAllClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const router = useRouter();

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    fetchData();
  }, [userId]);
    
  async function fetchData() {
    try {
      const resAll = await fetch('/api/club/all');
      const all = await resAll.json();

      const resMy = await fetch('/api/club/my', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ userId }),
      });
      const mine = await resMy.json();

      setAllClubs(all);
setMyClubs(Array.isArray(mine) ? mine : []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  }

// Remove currentUserId parameter here
const handleJoinClub = async (clubId) => {
  try {
    const response = await fetch(`/api/club/${clubId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",  // important to send cookies!
    });

    if (response.status === 400) {
      toast.error('Already member of club');
      throw new Error("Already member of club");
    }

    if (!response.ok) {
      // handle other errors
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to join club");
    }

    const result = await response.json();
    console.log("Joined club:", result);
    toast.success('Joined club successfully!');
  } catch (error) {
    console.error("Error joining club:", error);
  }
};






  const filters = ["all", "myClubs"];

  const filteredClubs = (selectedFilter === "all" ? allClubs : myClubs).filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bookclub-white">
      <Navbar
        isAuthenticated={true}
        user={{ name: "John Doe", email: "john@example.com" }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-bookclub-navy mb-2">
                Book Clubs
              </h1>
              <p className="text-bookclub-gray">
                Find your perfect reading community
              </p>
            </div>
            <Link href="/clubcreation">
              <Button className="bookclub-gradient text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Club
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-bookclub-gray" />
              <Input
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={
                    selectedFilter === filter
                      ? "bookclub-gradient text-white"
                      : ""
                  }
                >
                  {filter
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {filteredClubs.map((club) => (
            <Card
              key={club._id}
              className="hover:shadow-lg transition-shadow bg-bookclub-cream1"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl text-bookclub-navy">
                        {club.name}
                      </CardTitle>
                      {/* {club.isAdmin && <Crown className="h-4 w-4 text-yellow-500" />}
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          club.privacy === "Public"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {club.privacy}
                      </span> */}
                    </div>
                    <CardDescription className="text-bookclub-gray">
                      {club.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-bookclub-navy">
                        {club.membersCount}
                      </div>
                      <div className="text-xs text-bookclub-gray">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-bookclub-navy">
                        {club.booksCount}
                      </div>
                      <div className="text-xs text-bookclub-gray">
                        Books Read
                      </div>
                    </div>
                    {/* <div className="text-center">
                      <div className="text-lg font-bold text-bookclub-navy">{club.discussions}</div>
                      <div className="text-xs text-bookclub-gray">Discussions</div>
                    </div> */}
                  </div>

                  {/* <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Book className="h-6 w-6 text-bookclub-orange" />
                    <div>
                      <div className="font-medium text-bookclub-navy">Currently Reading</div>
                      <div className="text-sm text-bookclub-gray">{club.currentBook}</div>
                    </div>
                  </div> */}

                  {/* <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Calendar className="h-6 w-6 text-bookclub-orange" />
                    <div>
                      <div className="font-medium text-bookclub-navy">Next Meeting</div>
                      <div className="text-sm text-bookclub-gray">
                        {club.nextMeeting} • {club.meetingType}
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-wrap gap-1">
                    {club.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-bookclub-orange bg-opacity-10 text-bookclub-orange text-xs rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div> */}

                  <div className="flex items-center justify-between text-sm text-bookclub-gray">
                    <span>Admin: {club.admin?.name || "Unknown"}</span>
                    {club.isMember && (
                      <span className="flex items-center text-green-600">
                        <Users className="h-4 w-4 mr-1" />
                        Member
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/clubs/${club.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {club.isMember ? (
                      <Button className="bookclub-gradient text-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Discussions
                      </Button>
                    ) : (
                      <Button
                        className="bookclub-gradient text-white"
                        onClick={() => handleJoinClub(club._id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Join Club
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-bookclub-gray mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-bookclub-navy mb-2">
              No clubs found
            </h3>
            <p className="text-bookclub-gray">
              Try adjusting your search or create a new club
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
